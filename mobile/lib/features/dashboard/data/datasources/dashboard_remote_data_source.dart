import '../../../../core/network/api_client.dart';
import '../models/dashboard_stats_model.dart';
import '../models/recent_activity_model.dart';

abstract class DashboardRemoteDataSource {
  Future<DashboardStatsModel> getDashboardStats();
  Future<List<RecentActivityModel>> getRecentActivity({
    int page = 1,
    int limit = 10,
  });
}

class DashboardRemoteDataSourceImpl implements DashboardRemoteDataSource {
  final ApiClient apiClient;

  DashboardRemoteDataSourceImpl(this.apiClient);

  @override
  Future<DashboardStatsModel> getDashboardStats() async {
    return await apiClient.getDashboardStats();
  }

  @override
  Future<List<RecentActivityModel>> getRecentActivity({
    int page = 1,
    int limit = 10,
  }) async {
    return await apiClient.getRecentActivity(page, limit);
  }
}