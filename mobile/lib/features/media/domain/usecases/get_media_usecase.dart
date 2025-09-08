import 'package:dartz/dartz.dart';

import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/media.dart';
import '../repositories/media_repository.dart';

class GetMediaUseCase implements UseCase<List<Media>, MediaParams> {
  final MediaRepository repository;

  GetMediaUseCase(this.repository);

  @override
  Future<Either<Failure, List<Media>>> call(MediaParams params) async {
    return await repository.getMedia(
      page: params.page,
      limit: params.limit,
    );
  }
}

class MediaParams {
  final int page;
  final int limit;

  const MediaParams({
    this.page = 1,
    this.limit = 10,
  });
}