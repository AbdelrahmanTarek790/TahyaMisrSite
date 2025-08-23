import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/error/failures.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/network/network_info.dart';
import '../../domain/entities/event.dart';
import '../../domain/repositories/event_repository.dart';
import '../datasources/events_remote_data_source.dart';
import '../datasources/events_local_data_source.dart';
import '../models/event_model.dart';

@LazySingleton(as: EventRepository)
class EventRepositoryImpl implements EventRepository {
  final EventsRemoteDataSource remoteDataSource;
  final EventsLocalDataSource localDataSource;
  final NetworkInfo networkInfo;

  EventRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
    required this.networkInfo,
  });

  @override
  Future<Either<Failure, List<Event>>> getEvents({
    int page = 1,
    int limit = 10,
  }) async {
    if (await networkInfo.isConnected) {
      try {
        final result = await remoteDataSource.getEvents(
          page: page,
          limit: limit,
        );
        
        // Cache the results
        await localDataSource.cacheEvents(result);
        
        return Right(result);
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      } on NetworkException catch (e) {
        return Left(NetworkFailure(e.message));
      } catch (e) {
        return const Left(ServerFailure('An unexpected error occurred'));
      }
    } else {
      // Try to get cached events when offline
      try {
        final cachedEvents = await localDataSource.getCachedEvents();
        if (cachedEvents.isNotEmpty) {
          return Right(cachedEvents);
        } else {
          return const Left(NetworkFailure('No internet connection and no cached data available'));
        }
      } on CacheException catch (e) {
        return Left(CacheFailure(e.message));
      }
    }
  }

  @override
  Future<Either<Failure, Event>> getEventById(String id) async {
    if (await networkInfo.isConnected) {
      try {
        final result = await remoteDataSource.getEventById(id);
        
        // Cache the individual event
        await localDataSource.cacheEvent(result);
        
        return Right(result);
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      } on NetworkException catch (e) {
        return Left(NetworkFailure(e.message));
      } catch (e) {
        return const Left(ServerFailure('An unexpected error occurred'));
      }
    } else {
      // Try to get cached event when offline
      try {
        final cachedEvent = await localDataSource.getCachedEventById(id);
        if (cachedEvent != null) {
          return Right(cachedEvent);
        } else {
          return const Left(NetworkFailure('No internet connection and no cached data available for this event'));
        }
      } on CacheException catch (e) {
        return Left(CacheFailure(e.message));
      }
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
    try {
      final cachedEvents = await localDataSource.getCachedEvents();
      return Right(cachedEvents);
    } on CacheException catch (e) {
      return Left(CacheFailure(e.message));
    }
  }

  @override
  Future<Either<Failure, void>> cacheEvents(List<Event> eventsList) async {
    try {
      // EventModel extends Event, so we need to convert back to EventModel for caching
      final eventModels = eventsList.whereType<EventModel>().toList();
      
      await localDataSource.cacheEvents(eventModels);
      return const Right(null);
    } on CacheException catch (e) {
      return Left(CacheFailure(e.message));
    }
  }
}