import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/join_request.dart';
import '../repositories/join_request_repository.dart';

@injectable
class GetJoinRequestsUseCase implements UseCase<List<JoinRequest>, GetJoinRequestsParams> {
  final JoinRequestRepository repository;

  const GetJoinRequestsUseCase({required this.repository});

  @override
  Future<Either<Failure, List<JoinRequest>>> call(GetJoinRequestsParams params) {
    return repository.getJoinRequests(
      page: params.page,
      limit: params.limit,
      status: params.status,
    );
  }
}

class GetJoinRequestsParams extends Equatable {
  final int page;
  final int limit;
  final String? status;

  const GetJoinRequestsParams({
    required this.page,
    required this.limit,
    this.status,
  });

  @override
  List<Object?> get props => [page, limit, status];
}