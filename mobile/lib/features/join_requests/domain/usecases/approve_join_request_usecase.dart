import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../repositories/join_request_repository.dart';
import '../../data/models/join_request_action.dart';

@injectable
class ApproveJoinRequestUseCase implements UseCase<void, ApproveJoinRequestParams> {
  final JoinRequestRepository repository;

  const ApproveJoinRequestUseCase({required this.repository});

  @override
  Future<Either<Failure, void>> call(ApproveJoinRequestParams params) {
    return repository.approveJoinRequest(params.id, params.action);
  }
}

class ApproveJoinRequestParams extends Equatable {
  final String id;
  final JoinRequestAction action;

  const ApproveJoinRequestParams({
    required this.id,
    required this.action,
  });

  @override
  List<Object> get props => [id, action];
}