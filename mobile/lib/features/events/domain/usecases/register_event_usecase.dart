import 'package:dartz/dartz.dart';

import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../repositories/event_repository.dart';

class RegisterEventUseCase implements UseCase<void, RegisterEventParams> {
  final EventRepository repository;

  RegisterEventUseCase(this.repository);

  @override
  Future<Either<Failure, void>> call(RegisterEventParams params) async {
    return await repository.registerForEvent(params.id);
  }
}

class RegisterEventParams {
  final String id;

  RegisterEventParams({required this.id});
}