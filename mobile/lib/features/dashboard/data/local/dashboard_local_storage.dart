import 'dart:convert';
import 'package:hive/hive.dart';
import '../../../../core/error/exceptions.dart';
import '../models/dashboard_stats_model.dart';
import '../models/recent_activity_model.dart';

class DashboardLocalStorage {
  final Box dashboardBox;

  DashboardLocalStorage(this.dashboardBox);

  Future<void> cacheDashboardStats(DashboardStatsModel stats) async {
    try {
      await dashboardBox.put('dashboard_stats', jsonEncode(stats.toJson()));
    } catch (e) {
      throw CacheException('Failed to cache dashboard stats: $e');
    }
  }

  Future<DashboardStatsModel?> getCachedDashboardStats() async {
    try {
      final statsJsonString = dashboardBox.get('dashboard_stats');
      if (statsJsonString != null) {
        final statsJson = jsonDecode(statsJsonString) as Map<String, dynamic>;
        return DashboardStatsModel.fromJson(statsJson);
      }
      return null;
    } catch (e) {
      throw CacheException('Failed to get cached dashboard stats: $e');
    }
  }

  Future<void> cacheRecentActivity(List<RecentActivityModel> activities) async {
    try {
      final activitiesJsonList = activities.map((activity) => activity.toJson()).toList();
      await dashboardBox.put('recent_activities', jsonEncode(activitiesJsonList));
    } catch (e) {
      throw CacheException('Failed to cache recent activities: $e');
    }
  }

  Future<List<RecentActivityModel>?> getCachedRecentActivity() async {
    try {
      final activitiesJsonString = dashboardBox.get('recent_activities');
      if (activitiesJsonString != null) {
        final activitiesJsonList = jsonDecode(activitiesJsonString) as List<dynamic>;
        return activitiesJsonList
            .map((json) => RecentActivityModel.fromJson(json as Map<String, dynamic>))
            .toList();
      }
      return null;
    } catch (e) {
      throw CacheException('Failed to get cached recent activities: $e');
    }
  }
}