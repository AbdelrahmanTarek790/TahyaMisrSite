import 'package:dartz/dartz.dart';

import '../../../core/error/failures.dart';
import '../../../core/usecases/usecase.dart';
import '../entities/news.dart';
import '../repositories/news_repository.dart';

class GetNewsUseCase implements UseCase<List<News>, GetNewsParams> {
  final NewsRepository repository;

  GetNewsUseCase(this.repository);

  @override
  Future<Either<Failure, List<News>>> call(GetNewsParams params) async {
    return await repository.getNews(
      page: params.page,
      limit: params.limit,
    );
  }
}

class GetNewsParams {
  final int page;
  final int limit;

  GetNewsParams({
    required this.page,
    required this.limit,
  });
}