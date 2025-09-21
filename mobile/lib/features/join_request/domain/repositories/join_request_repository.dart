import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/join_request.dart';
import '../../data/models/join_request_submission.dart';
import '../../data/models/join_request_action.dart';

abstract class JoinRequestRepository {
  Future<Either<Failure, JoinRequest>> createJoinRequest(JoinRequestSubmission request);
  Future<Either<Failure, Map<String, dynamic>>> getJoinRequests({
    required int page,
    required int limit,
    String? status,
  });
  Future<Either<Failure, JoinRequest>> getJoinRequestById(String id);
  Future<Either<Failure, JoinRequest>> approveJoinRequest(String id, JoinRequestAction action);
  Future<Either<Failure, JoinRequest>> denyJoinRequest(String id, JoinRequestAction action);
  Future<Either<Failure, void>> deleteJoinRequest(String id);
}