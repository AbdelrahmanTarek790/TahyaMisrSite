import 'package:dartz/dartz.dart';

import '../../../core/error/failures.dart';
import '../entities/news.dart';

abstract class NewsRepository {
  Future<Either<Failure, List<News>>> getNews({
    required int page,
    required int limit,
  });

  Future<Either<Failure, News>> getNewsById(String id);

  Future<Either<Failure, List<News>>> getCachedNews();

  Future<Either<Failure, void>> cacheNews(List<News> newsList);
}