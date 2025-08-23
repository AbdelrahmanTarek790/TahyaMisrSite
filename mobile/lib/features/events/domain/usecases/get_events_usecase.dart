import 'package:dartz/dartz.dart';

import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/event.dart';
import '../repositories/event_repository.dart';

class GetEventsUseCase implements UseCase<List<Event>, EventsParams> {
  final EventRepository repository;

  GetEventsUseCase(this.repository);

  @override
  Future<Either<Failure, List<Event>>> call(EventsParams params) async {
    return await repository.getEvents(
      page: params.page,
      limit: params.limit,
    );
  }
}

class EventsParams {
  final int page;
  final int limit;

  const EventsParams({
    this.page = 1,
    this.limit = 10,
  });
}