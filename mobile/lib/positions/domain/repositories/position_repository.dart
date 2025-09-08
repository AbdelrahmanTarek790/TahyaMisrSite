import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/position.dart';

abstract class PositionRepository {
  Future<Either<Failure, List<Position>>> getPositions({String? governorate});
  Future<Either<Failure, Position>> getPositionById(String id);
  Future<Either<Failure, Position>> createPosition(Map<String, dynamic> positionData);
  Future<Either<Failure, Position>> updatePosition(String id, Map<String, dynamic> positionData);
  Future<Either<Failure, void>> deletePosition(String id);
}