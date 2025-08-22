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
      // Since dashboard routes were deleted, we need to aggregate data from other endpoints
      // Get counts from individual endpoints
      final newsResponse = await apiClient.getNews(1, 1); // Just get the first page to get total count
      final eventsResponse = await apiClient.getEvents(1, 1);
      final mediaResponse = await apiClient.getMedia(1, 1);
      
      // For now, we'll provide basic stats based on what we can get
      // In a real implementation, you'd need dedicated endpoints for these counts
      return DashboardStatsModel(
        totalUsers: 100, // This would need a dedicated endpoint
        totalNews: newsResponse.data?['pagination']?['total'] ?? 0,
        totalEvents: eventsResponse.data?['pagination']?['total'] ?? 0,
        totalMedia: mediaResponse.data?['pagination']?['total'] ?? 0,
        activeUsers: 25, // This would need a dedicated endpoint
        pendingEvents: eventsResponse.data?['pagination']?['total'] ?? 0, // Simplified
      );
    } catch (e) {
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
      // Aggregate recent activity from news, events, and media
      final activities = <RecentActivityModel>[];
      
      // Get recent news
      final newsResponse = await apiClient.getNews(1, 5);
      if (newsResponse.success && newsResponse.data != null) {
        final newsList = newsResponse.data['news'] as List?;
        if (newsList != null) {
          for (var news in newsList) {
            activities.add(RecentActivityModel(
              id: news['_id'] ?? '',
              type: 'news',
              title: news['title'] ?? '',
              description: (news['content'] as String? ?? '').length > 100 
                ? '${(news['content'] as String).substring(0, 100)}...'
                : news['content'] ?? '',
              timestamp: DateTime.tryParse(news['createdAt'] ?? '') ?? DateTime.now(),
              imageUrl: news['image'],
            ));
          }
        }
      }
      
      // Get recent events
      final eventsResponse = await apiClient.getEvents(1, 5);
      if (eventsResponse.success && eventsResponse.data != null) {
        final eventsList = eventsResponse.data['events'] as List?;
        if (eventsList != null) {
          for (var event in eventsList) {
            activities.add(RecentActivityModel(
              id: event['_id'] ?? '',
              type: 'event',
              title: event['title'] ?? '',
              description: (event['description'] as String? ?? '').length > 100 
                ? '${(event['description'] as String).substring(0, 100)}...'
                : event['description'] ?? '',
              timestamp: DateTime.tryParse(event['createdAt'] ?? '') ?? DateTime.now(),
              imageUrl: event['image'],
            ));
          }
        }
      }
      
      // Get recent media
      final mediaResponse = await apiClient.getMedia(1, 5);
      if (mediaResponse.success && mediaResponse.data != null) {
        final mediaList = mediaResponse.data['media'] as List?;
        if (mediaList != null) {
          for (var media in mediaList) {
            activities.add(RecentActivityModel(
              id: media['_id'] ?? '',
              type: 'media',
              title: media['caption'] ?? 'Media Upload',
              description: (media['description'] as String? ?? '').length > 100 
                ? '${(media['description'] as String).substring(0, 100)}...'
                : media['description'] ?? '',
              timestamp: DateTime.tryParse(media['createdAt'] ?? '') ?? DateTime.now(),
              imageUrl: media['file'],
            ));
          }
        }
      }
      
      // Sort by timestamp and limit
      activities.sort((a, b) => b.timestamp.compareTo(a.timestamp));
      return activities.take(limit).toList();
      
    } catch (e) {
      throw ServerException(
        'Unexpected error occurred: ${e.toString()}',
      );
    }
  }
}