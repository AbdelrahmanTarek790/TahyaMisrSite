import 'package:dartz/dartz.dart';

import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/event.dart';
import '../repositories/event_repository.dart';


class GetEventsDetailUseCase implements UseCase<Event, GetEventsDetailParams> {
  final EventRepository repository;

  GetEventsDetailUseCase(this.repository);

  @override
  Future<Either<Failure, Event>> call(GetEventsDetailParams params) async {
    return await repository.getEventById(params.id);
  }
}

class GetEventsDetailParams {
  final String id;

  GetEventsDetailParams({required this.id});
}
