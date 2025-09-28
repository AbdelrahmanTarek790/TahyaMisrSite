import '../../../../core/network/api_client.dart';
import '../../../../core/error/exceptions.dart';
import '../models/dashboard_stats_model.dart';
import '../models/recent_activity_model.dart';

class DashboardApiService {
  final ApiClient apiClient;

  DashboardApiService(this.apiClient);

  Future<DashboardStatsModel> getDashboardStats() async {
    try {
      // Since dashboard routes were deleted, we need to aggregate data from other endpoints
      final newsResponse = await apiClient.getNews(1, 1);
      final eventsResponse = await apiClient.getEvents(1, 1);
      final mediaResponse = await apiClient.getMedia(1, 1);
      
      return DashboardStatsModel(
        totalUsers: 100, // This would need a dedicated endpoint
        totalNews: newsResponse.data?['pagination']?['total'] ?? 0,
        totalEvents: eventsResponse.data?['pagination']?['total'] ?? 0,
        totalMedia: mediaResponse.data?['pagination']?['total'] ?? 0,
        activeUsers: 25, // This would need a dedicated endpoint
        pendingEvents: eventsResponse.data?['pagination']?['total'] ?? 0,
      );
    } catch (e) {
      throw ServerException('Unexpected error occurred: ${e.toString()}');
    }
  }

  Future<List<RecentActivityModel>> getRecentActivity({int page = 1, int limit = 10}) async {
    try {
      final activities = <RecentActivityModel>[];
      
      // Get recent news
      final newsResponse = await apiClient.getNews(1, 5);
      if (newsResponse.success && newsResponse.data != null) {
        final newsList = newsResponse.data['news'] as List?;
        if (newsList != null) {
          for (final news in newsList) {
            activities.add(RecentActivityModel(
              id: news['_id'] ?? '',
              type: 'news',
              title: news['title'] ?? '',
              description: (news['content'] as String? ?? '').length > 100 
                ? '${(news['content'] as String).substring(0, 100)}...'
                : news['content'] ?? '',
              timestamp: DateTime.tryParse(news['createdAt'] ?? '') ?? DateTime.now(),
              imageUrl: news['image'],
            ),);
          }
        }
      }
      
      // Get recent events
      final eventsResponse = await apiClient.getEvents(1, 5);
      if (eventsResponse.success && eventsResponse.data != null) {
        final eventsList = eventsResponse.data['events'] as List?;
        if (eventsList != null) {
          for (final event in eventsList) {
            activities.add(RecentActivityModel(
              id: event['_id'] ?? '',
              type: 'event',
              title: event['title'] ?? '',
              description: (event['description'] as String? ?? '').length > 100 
                ? '${(event['description'] as String).substring(0, 100)}...'
                : event['description'] ?? '',
              timestamp: DateTime.tryParse(event['createdAt'] ?? '') ?? DateTime.now(),
              imageUrl: event['image'],
            ),);
          }
        }
      }
      
      activities.sort((a, b) => b.timestamp.compareTo(a.timestamp));
      return activities.take(limit).toList();
      
    } catch (e) {
      throw ServerException('Unexpected error occurred: ${e.toString()}');
    }
  }

}