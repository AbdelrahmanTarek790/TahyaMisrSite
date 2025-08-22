import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/network/network_info.dart';
import '../../domain/entities/position.dart';
import '../../domain/repositories/position_repository.dart';
import '../datasources/position_remote_data_source.dart';

class PositionRepositoryImpl implements PositionRepository {
  final PositionRemoteDataSource remoteDataSource;
  final NetworkInfo networkInfo;

  PositionRepositoryImpl({
    required this.remoteDataSource,
    required this.networkInfo,
  });

  @override
  Future<Either<Failure, List<Position>>> getPositions({String? governorate}) async {
    if (await networkInfo.isConnected) {
      try {
        final positions = await remoteDataSource.getPositions(governorate: governorate);
        return Right(positions);
      } catch (e) {
        return Left(ServerFailure(e.toString()));
      }
    } else {
      return Left(NetworkFailure());
    }
  }

  @override
  Future<Either<Failure, Position>> getPositionById(String id) async {
    if (await networkInfo.isConnected) {
      try {
        final position = await remoteDataSource.getPositionById(id);
        return Right(position);
      } catch (e) {
        return Left(ServerFailure(e.toString()));
      }
    } else {
      return Left(NetworkFailure());
    }
  }

  @override
  Future<Either<Failure, Position>> createPosition(Map<String, dynamic> positionData) async {
    if (await networkInfo.isConnected) {
      try {
        final position = await remoteDataSource.createPosition(positionData);
        return Right(position);
      } catch (e) {
        return Left(ServerFailure(e.toString()));
      }
    } else {
      return Left(NetworkFailure());
    }
  }

  @override
  Future<Either<Failure, Position>> updatePosition(String id, Map<String, dynamic> positionData) async {
    if (await networkInfo.isConnected) {
      try {
        final position = await remoteDataSource.updatePosition(id, positionData);
        return Right(position);
      } catch (e) {
        return Left(ServerFailure(e.toString()));
      }
    } else {
      return Left(NetworkFailure());
    }
  }

  @override
  Future<Either<Failure, void>> deletePosition(String id) async {
    if (await networkInfo.isConnected) {
      try {
        await remoteDataSource.deletePosition(id);
        return const Right(null);
      } catch (e) {
        return Left(ServerFailure(e.toString()));
      }
    } else {
      return Left(NetworkFailure());
    }
  }
}