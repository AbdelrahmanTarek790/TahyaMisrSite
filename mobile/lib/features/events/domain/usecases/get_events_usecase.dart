import 'package:dartz/dartz.dart';

import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/event.dart';
import '../../data/datasources/events_remote_data_source.dart';

class GetEventsUseCase implements UseCase<List<Event>, EventsParams> {
  final EventsRemoteDataSource dataSource;

  GetEventsUseCase(this.dataSource);

  @override
  Future<Either<Failure, List<Event>>> call(EventsParams params) async {
    try {
      final result = await dataSource.getEvents(
        page: params.page,
        limit: params.limit,
      );
      return Right(result);
    } catch (e) {
      return Left(ServerFailure('Failed to fetch events: ${e.toString()}'));
    }
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