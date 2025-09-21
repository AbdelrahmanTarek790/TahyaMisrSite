import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/error/exceptions.dart';
import '../../domain/repositories/join_request_repository.dart';
import '../../domain/entities/join_request.dart';
import '../models/join_request_submission.dart';
import '../models/join_request_action.dart';
import '../datasources/join_request_remote_data_source.dart';
import '../../../../core/network/network_info.dart';

class JoinRequestRepositoryImpl implements JoinRequestRepository {
  final JoinRequestRemoteDataSource remoteDataSource;
  final NetworkInfo networkInfo;

  JoinRequestRepositoryImpl({
    required this.remoteDataSource,
    required this.networkInfo,
  });

  @override
  Future<Either<Failure, JoinRequest>> createJoinRequest(JoinRequestSubmission request) async {
    if (await networkInfo.isConnected) {
      try {
        final joinRequest = await remoteDataSource.createJoinRequest(request);
        return Right(joinRequest);
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      } on Exception catch (e) {
        return Left(ServerFailure(e.toString()));
      }
    } else {
      return const Left(NetworkFailure('No internet connection'));
    }
  }

  @override
  Future<Either<Failure, Map<String, dynamic>>> getJoinRequests({
    required int page,
    required int limit,
    String? status,
  }) async {
    if (await networkInfo.isConnected) {
      try {
        final result = await remoteDataSource.getJoinRequests(
          page: page,
          limit: limit,
          status: status,
        );
        return Right(result);
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      } on Exception catch (e) {
        return Left(ServerFailure(e.toString()));
      }
    } else {
      return const Left(NetworkFailure('No internet connection'));
    }
  }

  @override
  Future<Either<Failure, JoinRequest>> getJoinRequestById(String id) async {
    if (await networkInfo.isConnected) {
      try {
        final joinRequest = await remoteDataSource.getJoinRequestById(id);
        return Right(joinRequest);
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      } on Exception catch (e) {
        return Left(ServerFailure(e.toString()));
      }
    } else {
      return const Left(NetworkFailure('No internet connection'));
    }
  }

  @override
  Future<Either<Failure, JoinRequest>> approveJoinRequest(String id, JoinRequestAction action) async {
    if (await networkInfo.isConnected) {
      try {
        final joinRequest = await remoteDataSource.approveJoinRequest(id, action);
        return Right(joinRequest);
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      } on Exception catch (e) {
        return Left(ServerFailure(e.toString()));
      }
    } else {
      return const Left(NetworkFailure('No internet connection'));
    }
  }

  @override
  Future<Either<Failure, JoinRequest>> denyJoinRequest(String id, JoinRequestAction action) async {
    if (await networkInfo.isConnected) {
      try {
        final joinRequest = await remoteDataSource.denyJoinRequest(id, action);
        return Right(joinRequest);
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      } on Exception catch (e) {
        return Left(ServerFailure(e.toString()));
      }
    } else {
      return const Left(NetworkFailure('No internet connection'));
    }
  }

  @override
  Future<Either<Failure, void>> deleteJoinRequest(String id) async {
    if (await networkInfo.isConnected) {
      try {
        await remoteDataSource.deleteJoinRequest(id);
        return const Right(null);
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      } on Exception catch (e) {
        return Left(ServerFailure(e.toString()));
      }
    } else {
      return const Left(NetworkFailure('No internet connection'));
    }
  }
}