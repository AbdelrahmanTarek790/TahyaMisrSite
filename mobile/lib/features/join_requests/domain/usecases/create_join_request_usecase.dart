import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../repositories/join_request_repository.dart';
import '../../data/models/create_join_request.dart';

@injectable
class CreateJoinRequestUseCase implements UseCase<void, CreateJoinRequestParams> {
  final JoinRequestRepository repository;

  const CreateJoinRequestUseCase({required this.repository});

  @override
  Future<Either<Failure, void>> call(CreateJoinRequestParams params) {
    return repository.createJoinRequest(params.request);
  }
}

class CreateJoinRequestParams extends Equatable {
  final CreateJoinRequest request;

  const CreateJoinRequestParams({required this.request});

  @override
  List<Object> get props => [request];
}