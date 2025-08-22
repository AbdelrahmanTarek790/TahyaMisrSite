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
        final eventsList = data['events'] as List<dynamic>? ?? [];
        
        print('Events list length: ${eventsList.length}'); // Debug logging
        
        final eventModels = <EventModel>[];
        for (final eventJson in eventsList) {
          try {
            final eventModel = EventModel.fromJson(eventJson as Map<String, dynamic>);
            eventModels.add(eventModel);
          } catch (e) {
            print('Error parsing event item: $e, Data: $eventJson'); // Debug logging
          }
        }
        
        return eventModels;
      } else {
        throw ServerException(
          response.error ?? 'Failed to fetch events',
        );
      }
    } catch (e) {
      print('Events fetch error: $e'); // Debug logging
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
        return EventModel.fromJson(response.data as Map<String, dynamic>);
      } else {
        throw ServerException(
          response.error ?? 'Failed to fetch event',
        );
      }
    } catch (e) {
      print('Event by ID fetch error: $e'); // Debug logging
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
      

      if (response.success) {
        return response.data?.toString() ?? 'Registration successful';
      } else {
        throw ServerException(
          response.error ?? 'Failed to register for event',
        );
      }
    } catch (e) {
      print('Event registration error: $e'); // Debug logging
      if (e is ServerException) {
        rethrow;
      }
      throw ServerException(
        'Unexpected error occurred: ${e.toString()}',
      );
    }
  }
}