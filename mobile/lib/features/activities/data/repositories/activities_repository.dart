import 'dart:io';

import 'package:dartz/dartz.dart';

import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/network/network_info.dart';
import '../local/activities_local_storage.dart';
import '../models/activity_model.dart';
import '../services/activities_api_service.dart';

class ActivitiesRepository {
  final ActivitiesApiService apiService;
  final ActivitiesLocalStorage localStorage;
  final NetworkInfo networkInfo;

  ActivitiesRepository({
    required this.apiService,
    required this.localStorage,
    required this.networkInfo,
  });

  Future<Either<Failure, List<ActivityModel>>> getActivities({
    bool? isActive,
    bool forceRefresh = false,
  }) async {
    try {
      if (await networkInfo.isConnected) {
        try {
          final activities = await apiService.getActivities(isActive: isActive);
          await localStorage.cacheActivities(activities);
          return Right(activities);
        } on ServerException catch (e) {
          print('Server error, trying cache: $e');
          final cachedActivities = await localStorage.getCachedActivities();
          if (cachedActivities != null && cachedActivities.isNotEmpty) {
            return Right(cachedActivities);
          }
          return Left(ServerFailure(e.message));
        }
      } else {
        final cachedActivities = await localStorage.getCachedActivities();
        if (cachedActivities != null && cachedActivities.isNotEmpty) {
          return Right(cachedActivities);
        }
        return const Left(NetworkFailure('No internet connection'));
      }
    } catch (e) {
      print('Unexpected error in getActivities: $e');
      return Left(ServerFailure(e.toString()));
    }
  }

  Future<Either<Failure, ActivityModel>> getActivityById(String id) async {
    try {
      if (await networkInfo.isConnected) {
        try {
          final activity = await apiService.getActivityById(id);
          await localStorage.cacheActivity(activity);
          return Right(activity);
        } on ServerException catch (e) {
          print('Server error, trying cache: $e');
          final cachedActivity = await localStorage.getCachedActivity(id);
          if (cachedActivity != null) {
            return Right(cachedActivity);
          }
          return Left(ServerFailure(e.message));
        }
      } else {
        final cachedActivity = await localStorage.getCachedActivity(id);
        if (cachedActivity != null) {
          return Right(cachedActivity);
        }
        return const Left(NetworkFailure('No internet connection'));
      }
    } catch (e) {
      print('Unexpected error in getActivityById: $e');
      return Left(ServerFailure(e.toString()));
    }
  }

  Future<Either<Failure, ActivityModel>> createActivity({
    required String title,
    File? imageFile,
    String? color,
    int? order,
    bool? isActive,
  }) async {
    if (!await networkInfo.isConnected) {
      return const Left(NetworkFailure('No internet connection'));
    }

    try {
      final activity = await apiService.createActivity(
        title: title,
        imageFile: imageFile,
        color: color,
        order: order,
        isActive: isActive,
      );
      return Right(activity);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  Future<Either<Failure, ActivityModel>> updateActivity({
    required String id,
    String? title,
    File? imageFile,
    String? color,
    int? order,
    bool? isActive,
  }) async {
    if (!await networkInfo.isConnected) {
      return const Left(NetworkFailure('No internet connection'));
    }

    try {
      final activity = await apiService.updateActivity(
        id: id,
        title: title,
        imageFile: imageFile,
        color: color,
        order: order,
        isActive: isActive,
      );
      return Right(activity);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  Future<Either<Failure, void>> deleteActivity(String id) async {
    if (!await networkInfo.isConnected) {
      return const Left(NetworkFailure('No internet connection'));
    }

    try {
      await apiService.deleteActivity(id);
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  Future<Either<Failure, ActivityModel>> toggleActivityStatus(
      String id) async {
    if (!await networkInfo.isConnected) {
      return const Left(NetworkFailure('No internet connection'));
    }

    try {
      final activity = await apiService.toggleActivityStatus(id);
      return Right(activity);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  Future<Either<Failure, void>> reorderActivities(
      List<Map<String, dynamic>> activities) async {
    if (!await networkInfo.isConnected) {
      return const Left(NetworkFailure('No internet connection'));
    }

    try {
      await apiService.reorderActivities(activities);
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }
}
