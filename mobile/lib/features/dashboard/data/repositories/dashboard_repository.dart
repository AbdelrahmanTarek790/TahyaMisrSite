import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/network/network_info.dart';
import '../models/dashboard_stats_model.dart';
import '../models/recent_activity_model.dart';
import '../services/dashboard_api_service.dart';
import '../local/dashboard_local_storage.dart';

abstract class DashboardRepository {
  Future<Either<Failure, DashboardStatsModel>> getDashboardStats();
  Future<Either<Failure, List<RecentActivityModel>>> getRecentActivity({int page = 1, int limit = 10});
}

class DashboardRepositoryImpl implements DashboardRepository {
  final DashboardApiService apiService;
  final DashboardLocalStorage localStorage;
  final NetworkInfo networkInfo;

  DashboardRepositoryImpl({
    required this.apiService,
    required this.localStorage,
    required this.networkInfo,
  });

  @override
  Future<Either<Failure, DashboardStatsModel>> getDashboardStats() async {
    if (await networkInfo.isConnected) {
      try {
        final stats = await apiService.getDashboardStats();
        await localStorage.cacheDashboardStats(stats);
        return Right(stats);
      } on DioException catch (e) {
        return Left(_handleDioError(e));
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      } catch (e) {
        return Left(ServerFailure('Unexpected error occurred: $e'));
      }
    } else {
      try {
        final cachedStats = await localStorage.getCachedDashboardStats();
        if (cachedStats != null) {
          return Right(cachedStats);
        } else {
          return const Left(NetworkFailure('No internet connection and no cached data'));
        }
      } catch (e) {
        return const Left(NetworkFailure('No internet connection'));
      }
    }
  }

  @override
  Future<Either<Failure, List<RecentActivityModel>>> getRecentActivity({int page = 1, int limit = 10}) async {
    if (await networkInfo.isConnected) {
      try {
        final activities = await apiService.getRecentActivity(page: page, limit: limit);
        await localStorage.cacheRecentActivity(activities);
        return Right(activities);
      } on DioException catch (e) {
        return Left(_handleDioError(e));
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      } catch (e) {
        return Left(ServerFailure('Unexpected error occurred: $e'));
      }
    } else {
      try {
        final cachedActivities = await localStorage.getCachedRecentActivity();
        if (cachedActivities != null && cachedActivities.isNotEmpty) {
          return Right(cachedActivities);
        } else {
          return const Left(NetworkFailure('No internet connection and no cached data'));
        }
      } catch (e) {
        return const Left(NetworkFailure('No internet connection'));
      }
    }
  }

  Failure _handleDioError(DioException e) {
    switch (e.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return const NetworkFailure('Connection timeout');
      case DioExceptionType.badResponse:
        final statusCode = e.response?.statusCode;
        final responseData = e.response?.data;
        String message = 'Server error';
        if (responseData is Map<String, dynamic>) {
          message = responseData['error']?.toString() ?? responseData['message']?.toString() ?? 'Server error';
        }
        switch (statusCode) {
          case 400: return ValidationFailure(message);
          case 401: return UnauthorizedFailure(message);
          case 404: return NotFoundFailure(message);
          case 500:
          default: return ServerFailure(message);
        }
      case DioExceptionType.connectionError:
        return const NetworkFailure('No internet connection');
      case DioExceptionType.cancel:
        return const ServerFailure('Request cancelled');
      default:
        return ServerFailure('Unexpected error: ${e.message}');
    }
  }
}