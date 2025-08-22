import '../../../../core/network/api_client.dart';
import '../../../../core/error/exceptions.dart';
import '../models/event_model.dart';

abstract class EventsRemoteDataSource {
  Future<List<EventModel>> getEvents({
    int page = 1,
    int limit = 10,
  });
  Future<EventModel> getEventById(String id);
  Future<String> registerForEvent(String eventId);
}

class EventsRemoteDataSourceImpl implements EventsRemoteDataSource {
  final ApiClient apiClient;

  EventsRemoteDataSourceImpl(this.apiClient);

  @override
  Future<List<EventModel>> getEvents({
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final response = await apiClient.getEvents(page, limit);
      
      if (response.success && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        final eventsList = data['events'] as List<dynamic>;
        
        return eventsList
            .map((json) => EventModel.fromJson(json as Map<String, dynamic>))
            .toList();
      } else {
        throw ServerException(
          response.error ?? 'Failed to fetch events',
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
  Future<EventModel> getEventById(String id) async {
    try {
      final response = await apiClient.getEventById(id);
      
      if (response.success && response.data != null) {
        return response.data!;
      } else {
        throw ServerException(
          response.error ?? 'Failed to fetch event',
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
  Future<String> registerForEvent(String eventId) async {
    try {
      final response = await apiClient.registerForEvent(eventId);
      
      if (response.success && response.data != null) {
        return response.data!;
      } else {
        throw ServerException(
          response.error ?? 'Failed to register for event',
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