import 'package:dartz/dartz.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../models/timeline_model.dart';
import '../services/timeline_api_service.dart';

class TimelineRepository {
  final TimelineApiService apiService;

  TimelineRepository(this.apiService);

  Future<Either<Failure, List<TimelineModel>>> getTimeline({
    int page = 1,
    int limit = 100,
  }) async {
    try {
      final timeline = await apiService.getTimeline(page: page, limit: limit);
      return Right(timeline);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure('Unexpected error: ${e.toString()}'));
    }
  }

  Future<Either<Failure, TimelineModel>> getTimelineById(String id) async {
    try {
      final timeline = await apiService.getTimelineById(id);
      return Right(timeline);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure('Unexpected error: ${e.toString()}'));
    }
  }


  Future<Either<Failure, TimelineModel>> createTimelineEntry(Map<String, dynamic> body) async {
    try {
      final timeline = await apiService.createTimelineEntry(body);
      return Right(timeline);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure('Unexpected error: ${e.toString()}'));
    }
  }

  Future<Either<Failure, TimelineModel>> updateTimelineEntry(String id, Map<String, dynamic> body) async {
    try {
      final timeline = await apiService.updateTimelineEntry(id, body);
      return Right(timeline);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure('Unexpected error: ${e.toString()}'));
    }
  }

  Future<Either<Failure,dynamic>> deleteTimelineById(String id) async {
    try {
      apiService.deleteTimelineEntry(id);
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } catch (e) {
      return Left(ServerFailure('Unexpected error: ${e.toString()}'));
    }
  }
}
