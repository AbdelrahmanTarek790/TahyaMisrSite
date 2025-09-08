import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/position.dart';
import '../repositories/position_repository.dart';

class CreatePositionUseCase implements UseCase<Position, CreatePositionParams> {
  final PositionRepository repository;

  CreatePositionUseCase(this.repository);

  @override
  Future<Either<Failure, Position>> call(CreatePositionParams params) async {
    return await repository.createPosition(params.positionData);
  }
}

class CreatePositionParams {
  final Map<String, dynamic> positionData;

  CreatePositionParams({required this.positionData});
}