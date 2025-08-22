import 'package:dartz/dartz.dart';

import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/news.dart';
import '../repositories/news_repository.dart';

class GetNewsUseCase implements UseCase<List<News>, NewsParams> {
  final NewsRepository repository;

  GetNewsUseCase(this.repository);

  @override
  Future<Either<Failure, List<News>>> call(NewsParams params) async {
    return await repository.getNews(
      page: params.page,
      limit: params.limit,
    );
  }
}

class NewsParams {
  final int page;
  final int limit;

  const NewsParams({
    this.page = 1,
    this.limit = 10,
  });
}
