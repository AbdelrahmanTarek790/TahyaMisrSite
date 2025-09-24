import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/network/network_info.dart';
import '../models/position_model.dart';
import '../services/positions_api_service.dart';
import '../local/positions_local_storage.dart';

abstract class PositionsRepository {
  Future<Either<Failure, List<PositionModel>>> getPositions({String? governorate});
  Future<Either<Failure, PositionModel>> getPositionById(String id);
  Future<Either<Failure, PositionModel>> createPosition(Map<String, dynamic> positionData);
  Future<Either<Failure, PositionModel>> updatePosition(String id, Map<String, dynamic> positionData);
  Future<Either<Failure, void>> deletePosition(String id);
}

class PositionsRepositoryImpl implements PositionsRepository {
  final PositionsApiService apiService;
  final PositionsLocalStorage localStorage;
  final NetworkInfo networkInfo;

  PositionsRepositoryImpl({
    required this.apiService,
    required this.localStorage,
    required this.networkInfo,
  });

  @override
  Future<Either<Failure, List<PositionModel>>> getPositions({String? governorate}) async {
    if (await networkInfo.isConnected) {
      try {
        final positions = await apiService.getPositions(governorate: governorate);
        await localStorage.cachePositions(positions);
        return Right(positions);
      } on DioException catch (e) {
        return Left(_handleDioError(e));
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      } catch (e) {
        return Left(ServerFailure('Unexpected error occurred: $e'));
      }
    } else {
      try {
        final cachedPositions = await localStorage.getCachedPositions();
        if (cachedPositions != null && cachedPositions.isNotEmpty) {
          return Right(cachedPositions);
        } else {
          return const Left(NetworkFailure('No internet connection and no cached data'));
        }
      } catch (e) {
        return const Left(NetworkFailure('No internet connection'));
      }
    }
  }

  @override
  Future<Either<Failure, PositionModel>> getPositionById(String id) async {
    if (await networkInfo.isConnected) {
      try {
        final position = await apiService.getPositionById(id);
        return Right(position);
      } on DioException catch (e) {
        return Left(_handleDioError(e));
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      } catch (e) {
        return Left(ServerFailure('Unexpected error occurred: $e'));
      }
    } else {
      return const Left(NetworkFailure('No internet connection'));
    }
  }

  @override
  Future<Either<Failure, PositionModel>> createPosition(Map<String, dynamic> positionData) async {
    if (await networkInfo.isConnected) {
      try {
        final position = await apiService.createPosition(positionData);
        return Right(position);
      } on DioException catch (e) {
        return Left(_handleDioError(e));
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      } catch (e) {
        return Left(ServerFailure('Unexpected error occurred: $e'));
      }
    } else {
      return const Left(NetworkFailure('No internet connection'));
    }
  }

  @override
  Future<Either<Failure, PositionModel>> updatePosition(String id, Map<String, dynamic> positionData) async {
    if (await networkInfo.isConnected) {
      try {
        final position = await apiService.updatePosition(id, positionData);
        return Right(position);
      } on DioException catch (e) {
        return Left(_handleDioError(e));
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      } catch (e) {
        return Left(ServerFailure('Unexpected error occurred: $e'));
      }
    } else {
      return const Left(NetworkFailure('No internet connection'));
    }
  }

  @override
  Future<Either<Failure, void>> deletePosition(String id) async {
    if (await networkInfo.isConnected) {
      try {
        await apiService.deletePosition(id);
        return const Right(null);
      } on DioException catch (e) {
        return Left(_handleDioError(e));
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      } catch (e) {
        return Left(ServerFailure('Unexpected error occurred: $e'));
      }
    } else {
      return const Left(NetworkFailure('No internet connection'));
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