import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/join_request.dart';
import '../repositories/join_request_repository.dart';
import '../../data/models/join_request_action.dart';

class DenyJoinRequest implements UseCase<JoinRequest, DenyJoinRequestParams> {
  final JoinRequestRepository repository;

  DenyJoinRequest(this.repository);

  @override
  Future<Either<Failure, JoinRequest>> call(DenyJoinRequestParams params) async {
    return await repository.denyJoinRequest(params.id, params.action);
  }
}

class DenyJoinRequestParams {
  final String id;
  final JoinRequestAction action;

  DenyJoinRequestParams({
    required this.id,
    required this.action,
  });
}