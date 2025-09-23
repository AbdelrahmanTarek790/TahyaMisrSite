import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/join_request.dart';
import '../../data/models/create_join_request.dart';
import '../../data/models/join_request_action.dart';

abstract class JoinRequestRepository {
  Future<Either<Failure, void>> createJoinRequest(CreateJoinRequest request);
  Future<Either<Failure, List<JoinRequest>>> getJoinRequests({
    required int page,
    required int limit,
    String? status,
  });
  Future<Either<Failure, JoinRequest>> getJoinRequestById(String id);
  Future<Either<Failure, void>> approveJoinRequest(String id, JoinRequestAction action);
  Future<Either<Failure, void>> denyJoinRequest(String id, JoinRequestAction action);
  Future<Either<Failure, void>> deleteJoinRequest(String id);
}