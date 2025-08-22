import 'package:dartz/dartz.dart';

import '../../../../core/error/failures.dart';
import '../entities/media.dart';

abstract class MediaRepository {
  Future<Either<Failure, List<Media>>> getMedia({
    required int page,
    required int limit,
  });

  Future<Either<Failure, Media>> getMediaById(String id);

  Future<Either<Failure, List<Media>>> getCachedMedia();

  Future<Either<Failure, void>> cacheMedia(List<Media> mediaList);
}