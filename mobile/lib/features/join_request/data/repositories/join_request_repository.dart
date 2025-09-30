import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/error/failures.dart';
import '../../../../core/network/network_info.dart';
import '../models/join_request_model.dart';

import '../models/join_request_response.dart';
import '../models/join_request_action_request.dart';
import '../services/join_request_api_service.dart';

abstract class JoinRequestRepository {
  Future<Either<Failure, void>> createJoinRequest({
    required String name,
    required String email,
    required String phone,
    required String nationalId,
    required String governorate,
    required String role,
    String? position,
    String? membershipNumber,
    String? notes,
  });
  Future<Either<Failure, JoinRequestResponse>> getJoinRequests({
    int? page,
    int? limit,
    String? status,
  });
  Future<Either<Failure, JoinRequestModel>> getJoinRequestById(String id);
  Future<Either<Failure, void>> approveJoinRequest(String id, JoinRequestActionRequest request);
  Future<Either<Failure, void>> denyJoinRequest(String id, JoinRequestActionRequest request);
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
  Future<Either<Failure, void>> createJoinRequest({
    required String name,
    required String email,
    required String phone,
    required String nationalId,
    required String governorate,
    required String role,
    String? position,
    String? membershipNumber,
    String? notes,
  }) async {
    if (await networkInfo.isConnected) {
      try {
        final result = await apiService.createJoinRequest(
          name: name,
          email: email,
          phone: phone,
          nationalId: nationalId,
          governorate: governorate,
          role: role,
          position: position,
          membershipNumber: membershipNumber,
          notes: notes,
        );
        return Right(result);
      } catch (e) {
        print('Error in createJoinRequest: $e');
        return Left(ServerFailure(e.toString()));
      }
    } else {
      return const Left(NetworkFailure('No internet connection'));
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
        return Left(ServerFailure(e.toString()));
      }
    } else {
      return const Left(NetworkFailure('No internet connection'));
    }
  }

  @override
  Future<Either<Failure, JoinRequestModel>> getJoinRequestById(String id) async {
    if (await networkInfo.isConnected) {
      try {
        final result = await apiService.getJoinRequestById(id);
        return Right(result);
      } catch (e) {
        return Left(ServerFailure(e.toString()));
      }
    } else {
      return const Left(NetworkFailure('No internet connection'));
    }
  }

  @override
  Future<Either<Failure, void>> approveJoinRequest(String id, JoinRequestActionRequest request) async {
    if (await networkInfo.isConnected) {
      try {
        final result = await apiService.approveJoinRequest(id, request);
        return Right(result);
      } catch (e) {
        return Left(ServerFailure(e.toString()));
      }
    } else {
      return const Left(NetworkFailure('No internet connection'));
    }
  }

  @override
  Future<Either<Failure, void>> denyJoinRequest(String id, JoinRequestActionRequest request) async {
    if (await networkInfo.isConnected) {
      try {
        final result = await apiService.denyJoinRequest(id, request);
        return Right(result);
      } catch (e) {
        return Left(ServerFailure( e.toString()));
      }
    } else {
      return const Left(NetworkFailure('No internet connection'));
    }
  }

  @override
  Future<Either<Failure, Unit>> deleteJoinRequest(String id) async {
    if (await networkInfo.isConnected) {
      try {
        await apiService.deleteJoinRequest(id);
        return const Right(unit);
      } catch (e) {
        return Left(ServerFailure(e.toString()));
      }
    } else {
      return const Left(NetworkFailure('No internet connection'));
    }
  }
}