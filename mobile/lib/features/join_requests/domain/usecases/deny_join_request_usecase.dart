import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../repositories/join_request_repository.dart';
import '../../data/models/join_request_action.dart';

@injectable
class DenyJoinRequestUseCase implements UseCase<void, DenyJoinRequestParams> {
  final JoinRequestRepository repository;

  const DenyJoinRequestUseCase({required this.repository});

  @override
  Future<Either<Failure, void>> call(DenyJoinRequestParams params) {
    return repository.denyJoinRequest(params.id, params.action);
  }
}

class DenyJoinRequestParams extends Equatable {
  final String id;
  final JoinRequestAction action;

  const DenyJoinRequestParams({
    required this.id,
    required this.action,
  });

  @override
  List<Object> get props => [id, action];
}