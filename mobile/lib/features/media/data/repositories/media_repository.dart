import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/network/network_info.dart';
import '../models/media_model.dart';
import '../services/media_api_service.dart';
import '../local/media_local_storage.dart';

abstract class MediaRepository {
  Future<Either<Failure, List<MediaModel>>> getMedia({required int page, required int limit});
}

class MediaRepositoryImpl implements MediaRepository {
  final MediaApiService apiService;
  final MediaLocalStorage localStorage;
  final NetworkInfo networkInfo;

  MediaRepositoryImpl({
    required this.apiService,
    required this.localStorage,
    required this.networkInfo,
  });

  @override
  Future<Either<Failure, List<MediaModel>>> getMedia({required int page, required int limit}) async {
    if (await networkInfo.isConnected) {
      try {
        final mediaList = await apiService.getMedia(page: page, limit: limit);
        await localStorage.cacheMedia(mediaList);
        return Right(mediaList);
      } on DioException catch (e) {
        return Left(_handleDioError(e));
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      } catch (e) {
        return Left(ServerFailure('Unexpected error occurred: $e'));
      }
    } else {
      try {
        final cachedMedia = await localStorage.getCachedMedia();
        if (cachedMedia != null && cachedMedia.isNotEmpty) {
          return Right(cachedMedia);
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