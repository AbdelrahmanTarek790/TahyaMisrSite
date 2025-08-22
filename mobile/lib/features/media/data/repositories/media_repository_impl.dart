import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/error/failures.dart';
import '../../../../core/error/exceptions.dart';
import '../../domain/entities/media.dart';
import '../../domain/repositories/media_repository.dart';
import '../datasources/media_remote_data_source.dart';

@LazySingleton(as: MediaRepository)
class MediaRepositoryImpl implements MediaRepository {
  final MediaRemoteDataSource remoteDataSource;

  MediaRepositoryImpl({
    required this.remoteDataSource,
  });

  @override
  Future<Either<Failure, List<Media>>> getMedia({
    required int page,
    required int limit,
  }) async {
    try {
      final result = await remoteDataSource.getMedia(
        page: page,
        limit: limit,
      );
      return Right(result);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return const Left(ServerFailure('An unexpected error occurred'));
    }
  }

  @override
  Future<Either<Failure, Media>> getMediaById(String id) async {
    try {
      final result = await remoteDataSource.getMediaById(id);
      return Right(result);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return const Left(ServerFailure('An unexpected error occurred'));
    }
  }

  @override
  Future<Either<Failure, List<Media>>> getCachedMedia() async {
    // TODO: Implement caching if needed
    return const Left(CacheFailure('Caching not implemented'));
  }

  @override
  Future<Either<Failure, void>> cacheMedia(List<Media> mediaList) async {
    // TODO: Implement caching if needed
    return const Left(CacheFailure('Caching not implemented'));
  }
}