import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/join_request.dart';
import '../repositories/join_request_repository.dart';
import '../../data/models/join_request_submission.dart';

class CreateJoinRequest implements UseCase<JoinRequest, CreateJoinRequestParams> {
  final JoinRequestRepository repository;

  CreateJoinRequest(this.repository);

  @override
  Future<Either<Failure, JoinRequest>> call(CreateJoinRequestParams params) async {
    return await repository.createJoinRequest(params.request);
  }
}

class CreateJoinRequestParams {
  final JoinRequestSubmission request;

  CreateJoinRequestParams({required this.request});
}