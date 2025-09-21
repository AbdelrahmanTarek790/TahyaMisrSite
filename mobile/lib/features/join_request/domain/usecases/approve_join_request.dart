import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/join_request.dart';
import '../repositories/join_request_repository.dart';
import '../../data/models/join_request_action.dart';

class ApproveJoinRequest implements UseCase<JoinRequest, ApproveJoinRequestParams> {
  final JoinRequestRepository repository;

  ApproveJoinRequest(this.repository);

  @override
  Future<Either<Failure, JoinRequest>> call(ApproveJoinRequestParams params) async {
    return await repository.approveJoinRequest(params.id, params.action);
  }
}

class ApproveJoinRequestParams {
  final String id;
  final JoinRequestAction action;

  ApproveJoinRequestParams({
    required this.id,
    required this.action,
  });
}