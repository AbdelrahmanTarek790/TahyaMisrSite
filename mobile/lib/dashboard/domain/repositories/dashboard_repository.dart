import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/dashboard_stats.dart';
import '../entities/recent_activity.dart';

abstract class DashboardRepository {
  Future<Either<Failure, DashboardStats>> getDashboardStats();
  Future<Either<Failure, List<RecentActivity>>> getRecentActivity({
    int page = 1,
    int limit = 10,
  });
}