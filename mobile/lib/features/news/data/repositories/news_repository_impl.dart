import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/error/failures.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/network/network_info.dart';
import '../../domain/entities/news.dart';
import '../../domain/repositories/news_repository.dart';
import '../datasources/news_remote_data_source.dart';
import '../datasources/news_local_data_source.dart';

@LazySingleton(as: NewsRepository)
class NewsRepositoryImpl implements NewsRepository {
  final NewsRemoteDataSource remoteDataSource;
  final NewsLocalDataSource localDataSource;
  final NetworkInfo networkInfo;

  NewsRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
    required this.networkInfo,
  });

  @override
  Future<Either<Failure, List<News>>> getNews({
    int page = 1,
    int limit = 10,
  }) async {
    if (await networkInfo.isConnected) {
      try {
        final result = await remoteDataSource.getNews(
          page: page,
          limit: limit,
        );
        
        // Cache the results
        await localDataSource.cacheNews(result);
        
        return Right(result);
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      } on NetworkException catch (e) {
        return Left(NetworkFailure(e.message));
      } catch (e) {
        return const Left(ServerFailure('An unexpected error occurred'));
      }
    } else {
      // Try to get cached news when offline
      try {
        final cachedNews = await localDataSource.getCachedNews();
        if (cachedNews.isNotEmpty) {
          return Right(cachedNews);
        } else {
          return const Left(NetworkFailure('No internet connection and no cached data available'));
        }
      } on CacheException catch (e) {
        return Left(CacheFailure(e.message));
      }
    }
  }

  @override
  Future<Either<Failure, News>> getNewsById(String id) async {
    if (await networkInfo.isConnected) {
      try {
        final result = await remoteDataSource.getNewsById(id);
        
        // Cache the individual news item
        await localDataSource.cacheNewsItem(result);
        
        return Right(result);
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      } on NetworkException catch (e) {
        return Left(NetworkFailure(e.message));
      } catch (e) {
        return const Left(ServerFailure('An unexpected error occurred'));
      }
    } else {
      // Try to get cached news when offline
      try {
        final cachedNews = await localDataSource.getCachedNewsById(id);
        if (cachedNews != null) {
          return Right(cachedNews);
        } else {
          return const Left(NetworkFailure('No internet connection and no cached data available for this news'));
        }
      } on CacheException catch (e) {
        return Left(CacheFailure(e.message));
      }
    }
  }

  @override
  Future<Either<Failure, void>> cacheNews(List<News> newsList) async {
    try {
      final newsModels = newsList.map((news) {
        // Convert News to NewsModel
        return news as dynamic; // This would need proper conversion
      }).toList();
      
      await localDataSource.cacheNews(newsModels);
      return const Right(null);
    } on CacheException catch (e) {
      return Left(CacheFailure(e.message));
    }
  }

  @override
  Future<Either<Failure, List<News>>> getCachedNews() async {
    try {
      final cachedNews = await localDataSource.getCachedNews();
      return Right(cachedNews);
    } on CacheException catch (e) {
      return Left(CacheFailure(e.message));
    }
  }
}