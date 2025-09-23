import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../repositories/join_request_repository.dart';

@injectable
class DeleteJoinRequestUseCase implements UseCase<void, DeleteJoinRequestParams> {
  final JoinRequestRepository repository;

  const DeleteJoinRequestUseCase({required this.repository});

  @override
  Future<Either<Failure, void>> call(DeleteJoinRequestParams params) {
    return repository.deleteJoinRequest(params.id);
  }
}

class DeleteJoinRequestParams extends Equatable {
  final String id;

  const DeleteJoinRequestParams({required this.id});

  @override
  List<Object> get props => [id];
}