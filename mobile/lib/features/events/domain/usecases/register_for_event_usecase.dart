import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../repositories/event_repository.dart';

class RegisterForEventParams {
  final String eventId;

  const RegisterForEventParams({required this.eventId});
}

@lazySingleton
class RegisterForEventUseCase implements UseCase<void, RegisterForEventParams> {
  final EventRepository repository;

  RegisterForEventUseCase(this.repository);

  @override
  Future<Either<Failure, void>> call(RegisterForEventParams params) async {
    return await repository.registerForEvent(params.eventId);
  }
}