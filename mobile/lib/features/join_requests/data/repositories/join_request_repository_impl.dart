import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/network/api_client.dart';
import '../../domain/entities/join_request.dart';
import '../../domain/repositories/join_request_repository.dart';
import '../models/create_join_request.dart';
import '../models/join_request_action.dart';
import '../models/join_request_model.dart';

@LazySingleton(as: JoinRequestRepository)
class JoinRequestRepositoryImpl implements JoinRequestRepository {
  final ApiClient apiClient;

  const JoinRequestRepositoryImpl({required this.apiClient});

  @override
  Future<Either<Failure, void>> createJoinRequest(CreateJoinRequest request) async {
    try {
      await apiClient.createJoinRequest(request);
      return const Right(null);
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<JoinRequest>>> getJoinRequests({
    required int page,
    required int limit,
    String? status,
  }) async {
    try {
      final response = await apiClient.getJoinRequests(page, limit, status);
      
      final joinRequestsData = response.data['joinRequests'] as List<dynamic>? ?? [];
      final joinRequests = joinRequestsData
          .map((json) => JoinRequestModel.fromJson(json as Map<String, dynamic>))
          .toList();
      
      return Right(joinRequests);
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, JoinRequest>> getJoinRequestById(String id) async {
    try {
      final response = await apiClient.getJoinRequestById(id);
      final joinRequest = JoinRequestModel.fromJson(response.data['joinRequest'] as Map<String, dynamic>);
      return Right(joinRequest);
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> approveJoinRequest(String id, JoinRequestAction action) async {
    try {
      await apiClient.approveJoinRequest(id, action);
      return const Right(null);
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> denyJoinRequest(String id, JoinRequestAction action) async {
    try {
      await apiClient.denyJoinRequest(id, action);
      return const Right(null);
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> deleteJoinRequest(String id) async {
    try {
      await apiClient.deleteJoinRequest(id);
      return const Right(null);
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}