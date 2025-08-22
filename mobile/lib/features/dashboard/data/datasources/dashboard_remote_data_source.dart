import '../../../../core/network/api_client.dart';
import '../../../../core/error/exceptions.dart';
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
    try {
      final response = await apiClient.getDashboardStats();
      
      if (response.success && response.data != null) {
        return response.data!;
      } else {
        throw ServerException(
           response.error ?? 'Failed to fetch dashboard stats',
        );
      }
    } catch (e) {
      if (e is ServerException) {
        rethrow;
      }
      throw ServerException(
       'Unexpected error occurred: ${e.toString()}',
      );
    }
  }

  @override
  Future<List<RecentActivityModel>> getRecentActivity({
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final response = await apiClient.getRecentActivity(page, limit);
      
      if (response.success && response.data != null) {
        return response.data as List<RecentActivityModel>;
      } else {
        throw ServerException(
          response.error ?? 'Failed to fetch recent activity',
        );
      }
    } catch (e) {
      if (e is ServerException) {
        rethrow;
      }
      throw ServerException(
        'Unexpected error occurred: ${e.toString()}',
      );
    }
  }
}