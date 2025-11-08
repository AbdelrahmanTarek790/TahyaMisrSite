import 'dart:io';

import 'package:bloc/bloc.dart';
import 'package:logger/logger.dart';

import '../../data/repositories/achievements_repository.dart';
import 'achievements_state.dart';

class AchievementsCubit extends Cubit<AchievementsState> {
  final AchievementsRepository repository;
  final Logger logger;

  AchievementsCubit({
    required this.repository,
    required this.logger,
  }) : super(const AchievementsState.initial());

  Future<void> getAchievements({bool? isActive, bool forceRefresh = false}) async {
    emit(const AchievementsState.loading());

    final result = await repository.getAchievements(
      isActive: isActive,
      forceRefresh: forceRefresh,
    );

    result.fold(
      (failure) {
        logger.e('Failed to load achievements: ${failure.message}');
        emit(AchievementsState.error(failure.message));
      },
      (achievements) {
        logger.i('Loaded ${achievements.length} achievements');
        emit(AchievementsState.loaded(achievements));
      },
    );
  }

  Future<void> refreshAchievements({bool? isActive}) async {
    await getAchievements(isActive: isActive, forceRefresh: true);
  }

  Future<void> getAchievementById(String id) async {
    emit(const AchievementsState.loading());

    final result = await repository.getAchievementById(id);

    result.fold(
      (failure) {
        logger.e('Failed to load achievement: ${failure.message}');
        emit(AchievementsState.error(failure.message));
      },
      (achievement) {
        logger.i('Loaded achievement: ${achievement.title}');
        emit(AchievementsState.loadedDetails(achievement));
      },
    );
  }

  Future<bool> createAchievement({
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
      final result = await repository.createAchievement(
        title: title,
        description: description,
        highlights: highlights,
        imageFile: imageFile,
        color: color,
        icon: icon,
        order: order,
        isActive: isActive,
      );

      return result.fold(
        (failure) {
          logger.e('Failed to create achievement: ${failure.message}');
          return false;
        },
        (achievement) {
          logger.i('Created achievement: ${achievement.title}');
          return true;
        },
      );
    } catch (e) {
      logger.e('Error creating achievement: $e');
      return false;
    }
  }

  Future<bool> updateAchievement({
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
      final result = await repository.updateAchievement(
        id: id,
        title: title,
        description: description,
        highlights: highlights,
        imageFile: imageFile,
        color: color,
        icon: icon,
        order: order,
        isActive: isActive,
      );

      return result.fold(
        (failure) {
          logger.e('Failed to update achievement: ${failure.message}');
          return false;
        },
        (achievement) {
          logger.i('Updated achievement: ${achievement.title}');
          return true;
        },
      );
    } catch (e) {
      logger.e('Error updating achievement: $e');
      return false;
    }
  }

  Future<bool> deleteAchievement(String id) async {
    try {
      final result = await repository.deleteAchievement(id);

      return result.fold(
        (failure) {
          logger.e('Failed to delete achievement: ${failure.message}');
          return false;
        },
        (_) {
          logger.i('Deleted achievement: $id');
          return true;
        },
      );
    } catch (e) {
      logger.e('Error deleting achievement: $e');
      return false;
    }
  }

  Future<bool> toggleAchievementStatus(String id) async {
    try {
      final result = await repository.toggleAchievementStatus(id);

      return result.fold(
        (failure) {
          logger.e('Failed to toggle achievement status: ${failure.message}');
          return false;
        },
        (achievement) {
          logger.i('Toggled achievement status: ${achievement.title} - ${achievement.isActive}');
          return true;
        },
      );
    } catch (e) {
      logger.e('Error toggling achievement status: $e');
      return false;
    }
  }

  Future<bool> reorderAchievements(List<Map<String, dynamic>> achievements) async {
    try {
      final result = await repository.reorderAchievements(achievements);

      return result.fold(
        (failure) {
          logger.e('Failed to reorder achievements: ${failure.message}');
          return false;
        },
        (_) {
          logger.i('Reordered achievements successfully');
          return true;
        },
      );
    } catch (e) {
      logger.e('Error reordering achievements: $e');
      return false;
    }
  }
}
