import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/position.dart';
import '../repositories/position_repository.dart';

class GetPositionsUseCase implements UseCase<List<Position>, GetPositionsParams> {
  final PositionRepository repository;

  GetPositionsUseCase(this.repository);

  @override
  Future<Either<Failure, List<Position>>> call(GetPositionsParams params) async {
    return await repository.getPositions(governorate: params.governorate);
  }
}

class GetPositionsParams {
  final String? governorate;

  GetPositionsParams({this.governorate});
}