import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/error/failures.dart';
import '../../../../core/network/network_info.dart';
import '../models/join_request_model.dart';
import '../models/join_request_create_request.dart';
import '../models/join_request_response.dart';
import '../models/join_request_action_request.dart';
import '../services/join_request_api_service.dart';

abstract class JoinRequestRepository {
  Future<Either<Failure, JoinRequestModel>> createJoinRequest(JoinRequestCreateRequest request);
  Future<Either<Failure, JoinRequestResponse>> getJoinRequests({
    int? page,
    int? limit,
    String? status,
  });
  Future<Either<Failure, JoinRequestModel>> getJoinRequestById(String id);
  Future<Either<Failure, JoinRequestModel>> approveJoinRequest(String id, JoinRequestActionRequest request);
  Future<Either<Failure, JoinRequestModel>> denyJoinRequest(String id, JoinRequestActionRequest request);
  Future<Either<Failure, Unit>> deleteJoinRequest(String id);
}

@Injectable(as: JoinRequestRepository)
class JoinRequestRepositoryImpl implements JoinRequestRepository {
  final JoinRequestApiService apiService;
  final NetworkInfo networkInfo;

  JoinRequestRepositoryImpl({
    required this.apiService,
    required this.networkInfo,
  });

  @override
  Future<Either<Failure, JoinRequestModel>> createJoinRequest(JoinRequestCreateRequest request) async {
    if (await networkInfo.isConnected) {
      try {
        final result = await apiService.createJoinRequest(request);
        return Right(result);
      } catch (e) {
        return Left(ServerFailure(message: e.toString()));
      }
    } else {
      return Left(NetworkFailure(message: 'No internet connection'));
    }
  }

  @override
  Future<Either<Failure, JoinRequestResponse>> getJoinRequests({
    int? page,
    int? limit,
    String? status,
  }) async {
    if (await networkInfo.isConnected) {
      try {
        final result = await apiService.getJoinRequests(
          page: page,
          limit: limit,
          status: status,
        );
        return Right(result);
      } catch (e) {
        return Left(ServerFailure(message: e.toString()));
      }
    } else {
      return Left(NetworkFailure(message: 'No internet connection'));
    }
  }

  @override
  Future<Either<Failure, JoinRequestModel>> getJoinRequestById(String id) async {
    if (await networkInfo.isConnected) {
      try {
        final result = await apiService.getJoinRequestById(id);
        return Right(result);
      } catch (e) {
        return Left(ServerFailure(message: e.toString()));
      }
    } else {
      return Left(NetworkFailure(message: 'No internet connection'));
    }
  }

  @override
  Future<Either<Failure, JoinRequestModel>> approveJoinRequest(String id, JoinRequestActionRequest request) async {
    if (await networkInfo.isConnected) {
      try {
        final result = await apiService.approveJoinRequest(id, request);
        return Right(result);
      } catch (e) {
        return Left(ServerFailure(message: e.toString()));
      }
    } else {
      return Left(NetworkFailure(message: 'No internet connection'));
    }
  }

  @override
  Future<Either<Failure, JoinRequestModel>> denyJoinRequest(String id, JoinRequestActionRequest request) async {
    if (await networkInfo.isConnected) {
      try {
        final result = await apiService.denyJoinRequest(id, request);
        return Right(result);
      } catch (e) {
        return Left(ServerFailure(message: e.toString()));
      }
    } else {
      return Left(NetworkFailure(message: 'No internet connection'));
    }
  }

  @override
  Future<Either<Failure, Unit>> deleteJoinRequest(String id) async {
    if (await networkInfo.isConnected) {
      try {
        await apiService.deleteJoinRequest(id);
        return const Right(unit);
      } catch (e) {
        return Left(ServerFailure(message: e.toString()));
      }
    } else {
      return Left(NetworkFailure(message: 'No internet connection'));
    }
  }
}