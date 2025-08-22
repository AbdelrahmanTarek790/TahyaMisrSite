import 'package:dartz/dartz.dart';

import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/media.dart';
import '../../data/datasources/media_remote_data_source.dart';

class GetMediaUseCase implements UseCase<List<Media>, MediaParams> {
  final MediaRemoteDataSource dataSource;

  GetMediaUseCase(this.dataSource);

  @override
  Future<Either<Failure, List<Media>>> call(MediaParams params) async {
    try {
      final result = await dataSource.getMedia(
        page: params.page,
        limit: params.limit,
      );
      return Right(result);
    } catch (e) {
      return Left(ServerFailure('Failed to fetch media: ${e.toString()}'));
    }
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