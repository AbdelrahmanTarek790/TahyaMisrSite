import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/error/failures.dart';
import '../../../../core/error/exceptions.dart';
import '../../domain/entities/event.dart';
import '../../domain/repositories/event_repository.dart';
import '../datasources/events_remote_data_source.dart';

@LazySingleton(as: EventRepository)
class EventRepositoryImpl implements EventRepository {
  final EventsRemoteDataSource remoteDataSource;

  EventRepositoryImpl({
    required this.remoteDataSource,
  });

  @override
  Future<Either<Failure, List<Event>>> getEvents({
    int page = 1,
    int limit = 10,
  }) async
  {
    try {
      final result = await remoteDataSource.getEvents(
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
  Future<Either<Failure, Event>> getEventById(String id) async {
    try {
      final result = await remoteDataSource.getEventById(id);
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
  Future<Either<Failure, void>> registerForEvent(String eventId) async {
    try {
      await remoteDataSource.registerForEvent(eventId);
      return const Right(null);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return const Left(ServerFailure('An unexpected error occurred'));
    }
  }

  @override
  Future<Either<Failure, List<Event>>> getCachedEvents() async {
    // TODO: Implement caching if needed
    return const Left(CacheFailure('Caching not implemented'));
  }

  @override
  Future<Either<Failure, void>> cacheEvents(List<Event> eventsList) async {
    // TODO: Implement caching if needed
    return const Left(CacheFailure('Caching not implemented'));
  }
}