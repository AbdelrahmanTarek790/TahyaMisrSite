import 'package:dartz/dartz.dart';

import '../../../../core/error/failures.dart';
import '../entities/event.dart';

abstract class EventRepository {
  Future<Either<Failure, List<Event>>> getEvents({
    required int page,
    required int limit,
  });

  Future<Either<Failure, Event>> getEventById(String id);

  Future<Either<Failure, void>> registerForEvent(String eventId);

  Future<Either<Failure, List<Event>>> getCachedEvents();

  Future<Either<Failure, void>> cacheEvents(List<Event> eventsList);
}