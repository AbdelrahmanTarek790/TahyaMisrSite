import 'dart:io';

import 'package:dartz/dartz.dart';

import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/network/network_info.dart';
import '../local/achievements_local_storage.dart';
import '../models/achievement_model.dart';
import '../services/achievements_api_service.dart';

class AchievementsRepository {
  final AchievementsApiService apiService;
  final AchievementsLocalStorage localStorage;
  final NetworkInfo networkInfo;

  AchievementsRepository({
    required this.apiService,
    required this.localStorage,
    required this.networkInfo,
  });

  Future<Either<Failure, List<AchievementModel>>> getAchievements({
    bool? isActive,
    bool forceRefresh = false,
  }) async {
    try {
      if (await networkInfo.isConnected) {
        try {
          final achievements = await apiService.getAchievements(isActive: isActive);
          await localStorage.cacheAchievements(achievements);
          return Right(achievements);
        } on ServerException catch (e) {
          print('Server error, trying cache: $e');
          final cachedAchievements = await localStorage.getCachedAchievements();
          if (cachedAchievements != null && cachedAchievements.isNotEmpty) {
            return Right(cachedAchievements);
          }
          return Left(ServerFailure(e.message));
        }
      } else {
        final cachedAchievements = await localStorage.getCachedAchievements();
        if (cachedAchievements != null && cachedAchievements.isNotEmpty) {
          return Right(cachedAchievements);
        }
        return const Left(NetworkFailure('No internet connection'));
      }
    } catch (e) {
      print('Unexpected error in getAchievements: $e');
      return Left(ServerFailure(e.toString()));
    }
  }

  Future<Either<Failure, AchievementModel>> getAchievementById(String id) async {
    try {
      if (await networkInfo.isConnected) {
        try {
          final achievement = await apiService.getAchievementById(id);
          await localStorage.cacheAchievement(achievement);
          return Right(achievement);
        } on ServerException catch (e) {
          print('Server error, trying cache: $e');
          final cachedAchievement = await localStorage.getCachedAchievement(id);
          if (cachedAchievement != null) {
            return Right(cachedAchievement);
          }
          return Left(ServerFailure(e.message));
        }
      } else {
        final cachedAchievement = await localStorage.getCachedAchievement(id);
        if (cachedAchievement != null) {
          return Right(cachedAchievement);
        }
        return const Left(NetworkFailure('No internet connection'));
      }
    } catch (e) {
      print('Unexpected error in getAchievementById: $e');
      return Left(ServerFailure(e.toString()));
    }
  }

  Future<Either<Failure, AchievementModel>> createAchievement({
    required String title,
    required String description,
    List<String>? highlights,
    File? imageFile,
    String? color,
    String? icon,
    int? order,
    bool? isActive,
  }) async {
    if (!await networkInfo.isConnected) {
      return const Left(NetworkFailure('No internet connection'));
    }

    try {
      final achievement = await apiService.createAchievement(
        title: title,
        description: description,
        highlights: highlights,
        imageFile: imageFile,
        color: color,
        icon: icon,
        order: order,
        isActive: isActive,
      );
      return Right(achievement);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  Future<Either<Failure, AchievementModel>> updateAchievement({
    required String id,
    String? title,
    String? description,
    List<String>? highlights,
    File? imageFile,
    String? color,
    String? icon,
    int? order,
    bool? isActive,
  }) async {
    if (!await networkInfo.isConnected) {
      return const Left(NetworkFailure('No internet connection'));
    }

    try {
      final achievement = await apiService.updateAchievement(
        id: id,
        title: title,
        description: description,
        highlights: highlights,
        imageFile: imageFile,
        color: color,
        icon: icon,
        order: order,
        isActive: isActive,
      );
      return Right(achievement);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  Future<Either<Failure, void>> deleteAchievement(String id) async {
    if (!await networkInfo.isConnected) {
      return const Left(NetworkFailure('No internet connection'));
    }

    try {
      await apiService.deleteAchievement(id);
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  Future<Either<Failure, AchievementModel>> toggleAchievementStatus(
      String id) async {
    if (!await networkInfo.isConnected) {
      return const Left(NetworkFailure('No internet connection'));
    }

    try {
      final achievement = await apiService.toggleAchievementStatus(id);
      return Right(achievement);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }

  Future<Either<Failure, void>> reorderAchievements(
      List<Map<String, dynamic>> achievements) async {
    if (!await networkInfo.isConnected) {
      return const Left(NetworkFailure('No internet connection'));
    }

    try {
      await apiService.reorderAchievements(achievements);
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure(e.toString()));
    }
  }
}
