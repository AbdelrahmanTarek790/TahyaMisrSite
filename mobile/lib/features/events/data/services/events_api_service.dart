import 'dart:io';

import 'package:dio/dio.dart';

import '../../../../core/network/api_client.dart';
import '../../../../core/error/exceptions.dart';
import '../models/event_model.dart';
import 'package:http_parser/http_parser.dart';

class EventsApiService {
  final ApiClient apiClient;

  EventsApiService(this.apiClient);

  Future<List<EventModel>> getEvents({
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final response = await apiClient.getEvents(page, limit);

      if (response.success && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        final eventsList = data['events'] as List<dynamic>? ?? [];
        print('Events list length: ${eventsList.length}');
        
        final eventModels = <EventModel>[];
        for (final eventJson in eventsList) {
          try {
            final eventModel = EventModel.fromJson(eventJson as Map<String, dynamic>);
            eventModels.add(eventModel);
          } catch (e) {
            print('Error parsing event item: $e, Data: $eventJson');
          }
        }
        
        return eventModels;
      } else {
        throw ServerException(
          response.error ?? 'Failed to fetch events',
        );
      }
    } catch (e) {
      print('Events fetch error: $e');
      if (e is ServerException) {
        rethrow;
      }
      throw ServerException(
        'Unexpected error occurred: ${e.toString()}',
      );
    }
  }

  Future<EventModel> getEventById(String id) async {
    try {
      final response = await apiClient.getEventById(id);
      if (response.success && response.data != null) {
        return response.data as EventModel;
      } else {
        throw ServerException(
          response.error ?? 'Failed to fetch event',
        );
      }
    } catch (e) {
      print('Event by ID fetch error: $e');
      if (e is ServerException) {
        rethrow;
      }
      throw ServerException(
        'Unexpected error occurred: ${e.toString()}',
      );
    }
  }

  Future<void> registerForEvent(String eventId) async {
    try {
      await apiClient.registerForEvent(eventId).then(
        (value) {
          print('Registered for event successfully');
        },
        onError: (error, stackTrace) {
          print('Error registering for event: $error');
          throw ServerException('Failed to register for event: $error');
        },
      );
    } catch (e) {
      print('Event registration error: $e');
      if (e is ServerException) {
        rethrow;
      }
      throw ServerException(
        'Unexpected error occurred: ${e.toString()}',
      );
    }
  }

  Future<EventModel> createEvent({
    required String title,
    required String description,
    required DateTime date,
    required String location,
    required String imagePath,
  }) async {
    try {
      final file = File(imagePath);

      final allowedExtensions = ['jpg', 'jpeg', 'png'];
      final ext = file.path.split('.').last.toLowerCase();

      if (!allowedExtensions.contains(ext)) {
        throw const ServerException('Only image files are allowed');
      }

      final multipartFile = await MultipartFile.fromFile(
        file.path,
        filename: file.path.split('/').last,
        contentType: MediaType('image', ext),
      );

      // FormData
      final formData = FormData.fromMap({
        'title': title,
        'description': description,
        'date': date.toIso8601String(),
        'location': location,
        'image': multipartFile,
      });
      final result = await apiClient.createEvent(formData);
      return result.data as EventModel ;
    } catch (e) {
      throw ServerException('Unexpected error occurred: ${e.toString()}');
    }
  }

  Future<void> deleteEvent(String eventId) async {
    try {
      await apiClient.deleteEvent(eventId);
    } catch (e) {
      throw ServerException('Unexpected error occurred: ${e.toString()}');
    }
  }
}