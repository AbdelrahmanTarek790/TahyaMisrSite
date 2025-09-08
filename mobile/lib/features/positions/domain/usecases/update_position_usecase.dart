import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/position.dart';
import '../repositories/position_repository.dart';

class UpdatePositionUseCase implements UseCase<Position, UpdatePositionParams> {
  final PositionRepository repository;

  UpdatePositionUseCase(this.repository);

  @override
  Future<Either<Failure, Position>> call(UpdatePositionParams params) async {
    return await repository.updatePosition(params.id, params.positionData);
  }
}

class UpdatePositionParams {
  final String id;
  final Map<String, dynamic> positionData;

  UpdatePositionParams({required this.id, required this.positionData});
}