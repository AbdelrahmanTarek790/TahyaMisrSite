import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../repositories/position_repository.dart';

class DeletePositionUseCase implements UseCase<void, DeletePositionParams> {
  final PositionRepository repository;

  DeletePositionUseCase(this.repository);

  @override
  Future<Either<Failure, void>> call(DeletePositionParams params) async {
    return await repository.deletePosition(params.id);
  }
}

class DeletePositionParams {
  final String id;

  DeletePositionParams({required this.id});
}