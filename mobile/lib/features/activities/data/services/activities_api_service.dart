import 'dart:io';

import 'package:dio/dio.dart';
import 'package:http_parser/http_parser.dart';

import '../../../../core/network/api_client.dart';
import '../../../../core/error/exceptions.dart';
import '../models/activity_model.dart';

class ActivitiesApiService {
  final ApiClient apiClient;

  ActivitiesApiService(this.apiClient);

  Future<List<ActivityModel>> getActivities({bool? isActive}) async {
    try {
      final response = await apiClient.getActivities(isActive);

      if (response.success && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        final activitiesList = data['data'] as List<dynamic>? ?? [];
        print('Activities list length: ${activitiesList.length}');

        final activityModels = <ActivityModel>[];
        for (final activityJson in activitiesList) {
          try {
            final activityModel =
                ActivityModel.fromJson(activityJson as Map<String, dynamic>);
            activityModels.add(activityModel);
          } catch (e) {
            print('Error parsing activity item: $e, Data: $activityJson');
          }
        }

        return activityModels;
      } else {
        throw ServerException(
          response.error ?? 'Failed to fetch activities',
        );
      }
    } catch (e) {
      print('Activities fetch error: $e');
      if (e is ServerException) {
        rethrow;
      }
      throw ServerException(
        'Unexpected error occurred: ${e.toString()}',
      );
    }
  }

  Future<ActivityModel> getActivityById(String id) async {
    try {
      final response = await apiClient.getActivityById(id);
      if (response.success && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        final activityData = data['data'] as Map<String, dynamic>;
        return ActivityModel.fromJson(activityData);
      } else {
        throw ServerException(
          response.error ?? 'Failed to fetch activity',
        );
      }
    } catch (e) {
      print('Activity by ID fetch error: $e');
      if (e is ServerException) {
        rethrow;
      }
      throw ServerException(
        'Unexpected error occurred: ${e.toString()}',
      );
    }
  }

  Future<ActivityModel> createActivity({
    required String title,
    File? imageFile,
    String? color,
    int? order,
    bool? isActive,
  }) async {
    try {
      final formData = FormData();

      formData.fields.add(MapEntry('title', title));

      if (color != null) {
        formData.fields.add(MapEntry('color', color));
      }

      if (order != null) {
        formData.fields.add(MapEntry('order', order.toString()));
      }

      if (isActive != null) {
        formData.fields.add(MapEntry('isActive', isActive.toString()));
      }

      if (imageFile != null) {
        final fileName = imageFile.path.split('/').last;
        formData.files.add(
          MapEntry(
            'image',
            await MultipartFile.fromFile(
              imageFile.path,
              filename: fileName,
              contentType: MediaType('image', fileName.split('.').last),
            ),
          ),
        );
      }

      final response = await apiClient.createActivity(formData);

      if (response.success && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        final activityData = data['data'] as Map<String, dynamic>;
        return ActivityModel.fromJson(activityData);
      } else {
        throw ServerException(
          response.error ?? 'Failed to create activity',
        );
      }
    } catch (e) {
      print('Create activity error: $e');
      if (e is ServerException) {
        rethrow;
      }
      throw ServerException(
        'Unexpected error occurred: ${e.toString()}',
      );
    }
  }

  Future<ActivityModel> updateActivity({
    required String id,
    String? title,
    File? imageFile,
    String? color,
    int? order,
    bool? isActive,
  }) async {
    try {
      final formData = FormData();

      if (title != null) {
        formData.fields.add(MapEntry('title', title));
      }

      if (color != null) {
        formData.fields.add(MapEntry('color', color));
      }

      if (order != null) {
        formData.fields.add(MapEntry('order', order.toString()));
      }

      if (isActive != null) {
        formData.fields.add(MapEntry('isActive', isActive.toString()));
      }

      if (imageFile != null) {
        final fileName = imageFile.path.split('/').last;
        formData.files.add(
          MapEntry(
            'image',
            await MultipartFile.fromFile(
              imageFile.path,
              filename: fileName,
              contentType: MediaType('image', fileName.split('.').last),
            ),
          ),
        );
      }

      final response = await apiClient.updateActivity(id, formData);

      if (response.success && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        final activityData = data['data'] as Map<String, dynamic>;
        return ActivityModel.fromJson(activityData);
      } else {
        throw ServerException(
          response.error ?? 'Failed to update activity',
        );
      }
    } catch (e) {
      print('Update activity error: $e');
      if (e is ServerException) {
        rethrow;
      }
      throw ServerException(
        'Unexpected error occurred: ${e.toString()}',
      );
    }
  }

  Future<void> deleteActivity(String id) async {
    try {
      final response = await apiClient.deleteActivity(id);

      if (!response.success) {
        throw ServerException(
          response.error ?? 'Failed to delete activity',
        );
      }
    } catch (e) {
      print('Delete activity error: $e');
      if (e is ServerException) {
        rethrow;
      }
      throw ServerException(
        'Unexpected error occurred: ${e.toString()}',
      );
    }
  }

  Future<ActivityModel> toggleActivityStatus(String id) async {
    try {
      final response = await apiClient.toggleActivityStatus(id);

      if (response.success && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        final activityData = data['data'] as Map<String, dynamic>;
        return ActivityModel.fromJson(activityData);
      } else {
        throw ServerException(
          response.error ?? 'Failed to toggle activity status',
        );
      }
    } catch (e) {
      print('Toggle activity status error: $e');
      if (e is ServerException) {
        rethrow;
      }
      throw ServerException(
        'Unexpected error occurred: ${e.toString()}',
      );
    }
  }

  Future<void> reorderActivities(
      List<Map<String, dynamic>> activities) async {
    try {
      final response = await apiClient.reorderActivities({
        'activities': activities,
      });

      if (!response.success) {
        throw ServerException(
          response.error ?? 'Failed to reorder activities',
        );
      }
    } catch (e) {
      print('Reorder activities error: $e');
      if (e is ServerException) {
        rethrow;
      }
      throw ServerException(
        'Unexpected error occurred: ${e.toString()}',
      );
    }
  }
}
