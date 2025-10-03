import '../../../../core/network/api_client.dart';
import '../../../../core/error/exceptions.dart';
import '../models/timeline_model.dart';

class TimelineApiService {
  final ApiClient apiClient;

  TimelineApiService(this.apiClient);

  Future<List<TimelineModel>> getTimeline({
    int page = 1,
    int limit = 100,
  }) async {
    try {
      final response = await apiClient.getTimeline(page, limit);

      if (response.success && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        final timelineList = data['timeline'] as List<dynamic>? ?? [];

        print('Timeline list length: ${timelineList.length}');

        final timelineModels = <TimelineModel>[];
        for (final timelineJson in timelineList) {
          try {
            final timelineModel =
                TimelineModel.fromJson(timelineJson as Map<String, dynamic>);
            timelineModels.add(timelineModel);
          } catch (e) {
            print('Error parsing timeline item: $e, Data: $timelineJson');
          }
        }

        return timelineModels;
      } else {
        throw ServerException(
          response.error ?? 'Failed to fetch timeline',
        );
      }
    } catch (e) {
      print('Timeline fetch error: $e');
      if (e is ServerException) {
        rethrow;
      }
      throw ServerException(
        'Unexpected error occurred: ${e.toString()}',
      );
    }
  }

  Future<TimelineModel> getTimelineById(String id) async {
    try {
      final response = await apiClient.getTimelineById(id);
      if (response.success && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        final timelineData = data['timeline'] as Map<String, dynamic>;
        final timelineModel = TimelineModel.fromJson(timelineData);
        return timelineModel;
      } else {
        throw ServerException(
          response.error ?? 'Failed to fetch timeline',
        );
      }
    } catch (e) {
      print('Timeline by ID fetch error: $e');
      if (e is ServerException) {
        rethrow;
      }
      throw ServerException(
        'Unexpected error occurred: ${e.toString()}',
      );
    }
  }


  Future<TimelineModel> createTimelineEntry(Map<String, dynamic> body) async {
    try {
      final response = await apiClient.createTimelineEntry(body);
      if (response.success && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        final timelineData = data['timeline'] as Map<String, dynamic>;
        final timelineModel = TimelineModel.fromJson(timelineData);
        return timelineModel;
      } else {
        throw ServerException(
          response.error ?? 'Failed to create timeline entry',
        );
      }
    } catch (e) {
      print('Create timeline entry error: $e');
      if (e is ServerException) {
        rethrow;
      }
      throw ServerException(
        'Unexpected error occurred: ${e.toString()}',
      );
    }
  }

  Future<TimelineModel> updateTimelineEntry(String id, Map<String, dynamic> body) async {
    try {
      final response = await apiClient.updateTimelineEntry(id, body);
      if (response.success && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        final timelineData = data['timeline'] as Map<String, dynamic>;
        final timelineModel = TimelineModel.fromJson(timelineData);
        return timelineModel;
      } else {
        throw ServerException(
          response.error ?? 'Failed to update timeline entry',
        );
      }
    } catch (e) {
      print('Update timeline entry error: $e');
      if (e is ServerException) {
        rethrow;
      }
      throw ServerException(
        'Unexpected error occurred: ${e.toString()}',
      );
    }
  }

  Future<void> deleteTimelineEntry(String id) async {
    try {
      final response = await apiClient.deleteTimelineEntry(id);
      if (response.success) {
        return;
      } else {
        throw ServerException(
          response.error ?? 'Failed to delete timeline entry',
        );
      }
    } catch (e) {
      print('Delete timeline entry error: $e');
      if (e is ServerException) {
        rethrow;
      }
      throw ServerException(
        'Unexpected error occurred: ${e.toString()}',
      );
    }
  }
}
