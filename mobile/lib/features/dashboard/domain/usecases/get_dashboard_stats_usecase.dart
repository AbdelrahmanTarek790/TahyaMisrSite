import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/dashboard_stats.dart';
import '../repositories/dashboard_repository.dart';

@injectable
class GetDashboardStatsUseCase implements UseCase<DashboardStats, NoParams> {
  final DashboardRepository repository;

  GetDashboardStatsUseCase(this.repository);

  @override
  Future<Either<Failure, DashboardStats>> call(NoParams params) async {
    return await repository.getDashboardStats();
  }
}