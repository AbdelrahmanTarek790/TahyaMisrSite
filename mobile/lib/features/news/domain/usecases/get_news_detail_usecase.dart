import 'package:dartz/dartz.dart';

import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/news.dart';
import '../repositories/news_repository.dart';

class GetNewsDetailUseCase implements UseCase<News, GetNewsDetailParams> {
  final NewsRepository repository;

  GetNewsDetailUseCase(this.repository);

  @override
  Future<Either<Failure, News>> call(GetNewsDetailParams params) async {
    return await repository.getNewsById(params.id);
  }
}

class GetNewsDetailParams {
  final String id;

  GetNewsDetailParams({required this.id});
}
