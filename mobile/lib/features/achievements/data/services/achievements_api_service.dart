import 'dart:io';

import 'package:dio/dio.dart';
import 'package:http_parser/http_parser.dart';

import '../../../../core/network/api_client.dart';
import '../../../../core/error/exceptions.dart';
import '../models/achievement_model.dart';

class AchievementsApiService {
  final ApiClient apiClient;

  AchievementsApiService(this.apiClient);

  Future<List<AchievementModel>> getAchievements({bool? isActive}) async {
    try {
      final response = await apiClient.getAchievements(isActive);

      if (response.success && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        final achievementsList = data['data'] as List<dynamic>? ?? [];
        print('Achievements list length: ${achievementsList.length}');

        final achievementModels = <AchievementModel>[];
        for (final achievementJson in achievementsList) {
          try {
            final achievementModel =
                AchievementModel.fromJson(achievementJson as Map<String, dynamic>);
            achievementModels.add(achievementModel);
          } catch (e) {
            print('Error parsing achievement item: $e, Data: $achievementJson');
          }
        }

        return achievementModels;
      } else {
        throw ServerException(
          response.error ?? 'Failed to fetch achievements',
        );
      }
    } catch (e) {
      print('Achievements fetch error: $e');
      if (e is ServerException) {
        rethrow;
      }
      throw ServerException(
        'Unexpected error occurred: ${e.toString()}',
      );
    }
  }

  Future<AchievementModel> getAchievementById(String id) async {
    try {
      final response = await apiClient.getAchievementById(id);
      if (response.success && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        final achievementData = data['data'] as Map<String, dynamic>;
        return AchievementModel.fromJson(achievementData);
      } else {
        throw ServerException(
          response.error ?? 'Failed to fetch achievement',
        );
      }
    } catch (e) {
      print('Achievement by ID fetch error: $e');
      if (e is ServerException) {
        rethrow;
      }
      throw ServerException(
        'Unexpected error occurred: ${e.toString()}',
      );
    }
  }

  Future<AchievementModel> createAchievement({
    required String title,
    required String description,
    List<String>? highlights,
    File? imageFile,
    String? color,
    String? icon,
    int? order,
    bool? isActive,
  }) async {
    try {
      final formData = FormData();

      formData.fields.add(MapEntry('title', title));
      formData.fields.add(MapEntry('description', description));

      if (highlights != null && highlights.isNotEmpty) {
        // Convert highlights list to JSON string
        formData.fields.add(MapEntry('highlights', highlights.join(',')));
      }

      if (color != null) {
        formData.fields.add(MapEntry('color', color));
      }

      if (icon != null) {
        formData.fields.add(MapEntry('icon', icon));
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

      final response = await apiClient.createAchievement(formData);

      if (response.success && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        final achievementData = data['data'] as Map<String, dynamic>;
        return AchievementModel.fromJson(achievementData);
      } else {
        throw ServerException(
          response.error ?? 'Failed to create achievement',
        );
      }
    } catch (e) {
      print('Create achievement error: $e');
      if (e is ServerException) {
        rethrow;
      }
      throw ServerException(
        'Unexpected error occurred: ${e.toString()}',
      );
    }
  }

  Future<AchievementModel> updateAchievement({
    required String id,
    String? title,
    String? description,
    List<String>? highlights,
    File? imageFile,
    String? color,
    String? icon,
    int? order,
    bool? isActive,
  }) async {
    try {
      final formData = FormData();

      if (title != null) {
        formData.fields.add(MapEntry('title', title));
      }

      if (description != null) {
        formData.fields.add(MapEntry('description', description));
      }

      if (highlights != null) {
        formData.fields.add(MapEntry('highlights', highlights.join(',')));
      }

      if (color != null) {
        formData.fields.add(MapEntry('color', color));
      }

      if (icon != null) {
        formData.fields.add(MapEntry('icon', icon));
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

      final response = await apiClient.updateAchievement(id, formData);

      if (response.success && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        final achievementData = data['data'] as Map<String, dynamic>;
        return AchievementModel.fromJson(achievementData);
      } else {
        throw ServerException(
          response.error ?? 'Failed to update achievement',
        );
      }
    } catch (e) {
      print('Update achievement error: $e');
      if (e is ServerException) {
        rethrow;
      }
      throw ServerException(
        'Unexpected error occurred: ${e.toString()}',
      );
    }
  }

  Future<void> deleteAchievement(String id) async {
    try {
      final response = await apiClient.deleteAchievement(id);

      if (!response.success) {
        throw ServerException(
          response.error ?? 'Failed to delete achievement',
        );
      }
    } catch (e) {
      print('Delete achievement error: $e');
      if (e is ServerException) {
        rethrow;
      }
      throw ServerException(
        'Unexpected error occurred: ${e.toString()}',
      );
    }
  }

  Future<AchievementModel> toggleAchievementStatus(String id) async {
    try {
      final response = await apiClient.toggleAchievementStatus(id);

      if (response.success && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        final achievementData = data['data'] as Map<String, dynamic>;
        return AchievementModel.fromJson(achievementData);
      } else {
        throw ServerException(
          response.error ?? 'Failed to toggle achievement status',
        );
      }
    } catch (e) {
      print('Toggle achievement status error: $e');
      if (e is ServerException) {
        rethrow;
      }
      throw ServerException(
        'Unexpected error occurred: ${e.toString()}',
      );
    }
  }

  Future<void> reorderAchievements(
      List<Map<String, dynamic>> achievements) async {
    try {
      final response = await apiClient.reorderAchievements({
        'achievements': achievements,
      });

      if (!response.success) {
        throw ServerException(
          response.error ?? 'Failed to reorder achievements',
        );
      }
    } catch (e) {
      print('Reorder achievements error: $e');
      if (e is ServerException) {
        rethrow;
      }
      throw ServerException(
        'Unexpected error occurred: ${e.toString()}',
      );
    }
  }
}
