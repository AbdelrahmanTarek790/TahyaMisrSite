import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';

import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/network/network_info.dart';
import '../models/event_model.dart';
import '../services/events_api_service.dart';
import '../local/events_local_storage.dart';

abstract class EventsRepository {
  Future<Either<Failure, List<EventModel>>> getEvents({
    required int page,
    required int limit,
  });

  Future<Either<Failure, EventModel>> getEventById(String id);

  Future<Either<Failure, void>> registerForEvent(String eventId);

  Future<Either<Failure, List<EventModel>>> getCachedEvents();

  Future<Either<Failure, void>> cacheEvents(List<EventModel> eventsList);

  Future<Either<Failure, EventModel>> createEvents({
    required String title,
    required String description,
    required DateTime date,
    required String location,
    required String imagePath,
  });
}

class EventsRepositoryImpl implements EventsRepository {
  final EventsApiService apiService;
  final EventsLocalStorage localStorage;
  final NetworkInfo networkInfo;

  EventsRepositoryImpl({
    required this.apiService,
    required this.localStorage,
    required this.networkInfo,
  });

  @override
  Future<Either<Failure, List<EventModel>>> getEvents({
    required int page,
    required int limit,
  }) async {
    if (await networkInfo.isConnected) {
      try {
        final eventsList = await apiService.getEvents(page: page, limit: limit);
        
        // Cache the events list
        await localStorage.cacheEvents(eventsList);
        
        return Right(eventsList);
      } on DioException catch (e) {
        return Left(_handleDioError(e));
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      } catch (e) {
        return Left(ServerFailure('Unexpected error occurred: $e'));
      }
    } else {
      // Try to get cached events when offline
      try {
        final cachedEvents = await localStorage.getCachedEvents();
        if (cachedEvents != null && cachedEvents.isNotEmpty) {
          return Right(cachedEvents);
        } else {
          return const Left(NetworkFailure('No internet connection and no cached data'));
        }
      } catch (e) {
        return const Left(NetworkFailure('No internet connection'));
      }
    }
  }

  @override
  Future<Either<Failure, EventModel>> getEventById(String id) async {
    if (await networkInfo.isConnected) {
      try {
        final event = await apiService.getEventById(id);
        
        // Cache the event detail
        await localStorage.cacheEventDetail(id, event);
        
        return Right(event);
      } on DioException catch (e) {
        return Left(_handleDioError(e));
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      } catch (e) {
        return Left(ServerFailure('Unexpected error occurred: $e'));
      }
    } else {
      // Try to get cached event detail when offline
      try {
        final cachedEvent = await localStorage.getCachedEventDetail(id);
        if (cachedEvent != null) {
          return Right(cachedEvent);
        } else {
          return const Left(NetworkFailure('No internet connection and no cached data'));
        }
      } catch (e) {
        return const Left(NetworkFailure('No internet connection'));
      }
    }
  }

  @override
  Future<Either<Failure, void>> registerForEvent(String eventId) async {
    if (await networkInfo.isConnected) {
      try {
        await apiService.registerForEvent(eventId);
        return const Right(null);
      } on DioException catch (e) {
        return Left(_handleDioError(e));
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      } catch (e) {
        return Left(ServerFailure('Unexpected error occurred: $e'));
      }
    } else {
      return const Left(NetworkFailure('No internet connection'));
    }
  }

  @override
  Future<Either<Failure, List<EventModel>>> getCachedEvents() async {
    try {
      final cachedEvents = await localStorage.getCachedEvents();
      if (cachedEvents != null) {
        return Right(cachedEvents);
      } else {
        return const Left(CacheFailure('No cached events found'));
      }
    } on CacheException catch (e) {
      return Left(CacheFailure(e.message));
    } catch (e) {
      return Left(CacheFailure('Failed to get cached events: $e'));
    }
  }

  @override
  Future<Either<Failure, void>> cacheEvents(List<EventModel> eventsList) async {
    try {
      await localStorage.cacheEvents(eventsList);
      return const Right(null);
    } on CacheException catch (e) {
      return Left(CacheFailure(e.message));
    } catch (e) {
      return Left(CacheFailure('Failed to cache events: $e'));
    }
  }

  @override
  Future<Either<Failure, EventModel>> createEvents({
    required String title,
    required String description,
    required DateTime date,
    required String location,
    required String imagePath,
  }) async {
    if (await networkInfo.isConnected) {
      try {
        final newEvent = await apiService.createEvent(
          title: title,
          description: description,
          date: date,
          location: location,
          imagePath: imagePath,
        );
        return Right(newEvent);
      } on DioException catch (e) {
        return Left(_handleDioError(e));
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      } catch (e) {
        return Left(ServerFailure('Unexpected error occurred: $e'));
      }
    } else {
      return const Left(NetworkFailure('No internet connection'));
    }
  }


  Failure _handleDioError(DioException e) {
    switch (e.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return const NetworkFailure('Connection timeout');
      case DioExceptionType.badResponse:
        final statusCode = e.response?.statusCode;
        final responseData = e.response?.data;
        
        String message = 'Server error';
        if (responseData is Map<String, dynamic>) {
          message = responseData['error']?.toString() ?? 
                    responseData['message']?.toString() ?? 
                    'Server error';
        }

        switch (statusCode) {
          case 400:
            return ValidationFailure(message);
          case 401:
            return UnauthorizedFailure(message);
          case 404:
            return NotFoundFailure(message);
          case 500:
          default:
            return ServerFailure(message);
        }
      case DioExceptionType.connectionError:
        return const NetworkFailure('No internet connection');
      case DioExceptionType.cancel:
        return const ServerFailure('Request cancelled');
      default:
        return ServerFailure('Unexpected error: ${e.message}');
    }
  }
}