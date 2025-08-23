import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';
import 'package:equatable/equatable.dart';

import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/recent_activity.dart';
import '../repositories/dashboard_repository.dart';

class RecentActivityParams extends Equatable {
  final int page;
  final int limit;

  const RecentActivityParams({
    this.page = 1,
    this.limit = 10,
  });

  @override
  List<Object> get props => [page, limit];
}

@injectable
class GetRecentActivityUseCase implements UseCase<List<RecentActivity>, RecentActivityParams> {
  final DashboardRepository repository;

  GetRecentActivityUseCase(this.repository);

  @override
  Future<Either<Failure, List<RecentActivity>>> call(RecentActivityParams params) async {
    return await repository.getRecentActivity(
      page: params.page,
      limit: params.limit,
    );
  }
}