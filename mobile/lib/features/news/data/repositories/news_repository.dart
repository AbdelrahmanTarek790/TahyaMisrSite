import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';

import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/network/network_info.dart';
import '../models/news_model.dart';
import '../services/news_api_service.dart';
import '../local/news_local_storage.dart';

abstract class NewsRepository {
  Future<Either<Failure, List<NewsModel>>> getNews({
    required int page,
    required int limit,
  });

  Future<Either<Failure, NewsModel>> getNewsById(String id);

  Future<Either<Failure, List<NewsModel>>> getCachedNews();

  Future<Either<Failure, void>> cacheNews(List<NewsModel> newsList);
}

class NewsRepositoryImpl implements NewsRepository {
  final NewsApiService apiService;
  final NewsLocalStorage localStorage;
  final NetworkInfo networkInfo;

  NewsRepositoryImpl({
    required this.apiService,
    required this.localStorage,
    required this.networkInfo,
  });

  @override
  Future<Either<Failure, List<NewsModel>>> getNews({
    required int page,
    required int limit,
  }) async {
    if (await networkInfo.isConnected) {
      try {
        final newsList = await apiService.getNews(page: page, limit: limit);
        
        // Cache the news list
        await localStorage.cacheNews(newsList);
        
        return Right(newsList);
      } on DioException catch (e) {
        return Left(_handleDioError(e));
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      } catch (e) {
        return Left(ServerFailure('Unexpected error occurred: $e'));
      }
    } else {
      // Try to get cached news when offline
      try {
        final cachedNews = await localStorage.getCachedNews();
        if (cachedNews != null && cachedNews.isNotEmpty) {
          return Right(cachedNews);
        } else {
          return const Left(NetworkFailure('No internet connection and no cached data'));
        }
      } catch (e) {
        return const Left(NetworkFailure('No internet connection'));
      }
    }
  }

  @override
  Future<Either<Failure, NewsModel>> getNewsById(String id) async {
    if (await networkInfo.isConnected) {
      try {
        final news = await apiService.getNewsById(id);
        
        // Cache the news detail
        await localStorage.cacheNewsDetail(id, news);
        
        return Right(news);
      } on DioException catch (e) {
        return Left(_handleDioError(e));
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      } catch (e) {
        return Left(ServerFailure('Unexpected error occurred: $e'));
      }
    } else {
      // Try to get cached news detail when offline
      try {
        final cachedNews = await localStorage.getCachedNewsDetail(id);
        if (cachedNews != null) {
          return Right(cachedNews);
        } else {
          return const Left(NetworkFailure('No internet connection and no cached data'));
        }
      } catch (e) {
        return const Left(NetworkFailure('No internet connection'));
      }
    }
  }

  @override
  Future<Either<Failure, List<NewsModel>>> getCachedNews() async {
    try {
      final cachedNews = await localStorage.getCachedNews();
      if (cachedNews != null) {
        return Right(cachedNews);
      } else {
        return const Left(CacheFailure('No cached news found'));
      }
    } on CacheException catch (e) {
      return Left(CacheFailure(e.message));
    } catch (e) {
      return Left(CacheFailure('Failed to get cached news: $e'));
    }
  }

  @override
  Future<Either<Failure, void>> cacheNews(List<NewsModel> newsList) async {
    try {
      await localStorage.cacheNews(newsList);
      return const Right(null);
    } on CacheException catch (e) {
      return Left(CacheFailure(e.message));
    } catch (e) {
      return Left(CacheFailure('Failed to cache news: $e'));
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
          message = responseData['error']?.toString() ?? 
                    responseData['message']?.toString() ?? 
                    'Server error';
        }

        switch (statusCode) {
          case 400:
            return ValidationFailure(message);
          case 401:
            return UnauthorizedFailure(message);
          case 404:
            return NotFoundFailure(message);
          case 500:
          default:
            return ServerFailure(message);
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