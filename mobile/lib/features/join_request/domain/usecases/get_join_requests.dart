import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../repositories/join_request_repository.dart';

class GetJoinRequests implements UseCase<Map<String, dynamic>, GetJoinRequestsParams> {
  final JoinRequestRepository repository;

  GetJoinRequests(this.repository);

  @override
  Future<Either<Failure, Map<String, dynamic>>> call(GetJoinRequestsParams params) async {
    return await repository.getJoinRequests(
      page: params.page,
      limit: params.limit,
      status: params.status,
    );
  }
}

class GetJoinRequestsParams {
  final int page;
  final int limit;
  final String? status;

  GetJoinRequestsParams({
    required this.page,
    required this.limit,
    this.status,
  });
}