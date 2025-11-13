import 'dart:io';

import 'package:bloc/bloc.dart';
import 'package:logger/logger.dart';

import '../../data/repositories/activities_repository.dart';
import 'activities_state.dart';

class ActivitiesCubit extends Cubit<ActivitiesState> {
  final ActivitiesRepository repository;
  final Logger logger;

  ActivitiesCubit({
    required this.repository,
    required this.logger,
  }) : super(const ActivitiesState.initial());

  Future<void> getActivities({bool? isActive, bool forceRefresh = false}) async {
    emit(const ActivitiesState.loading());

    final result = await repository.getActivities(
      isActive: isActive,
      forceRefresh: forceRefresh,
    );

    result.fold(
      (failure) {
        logger.e('Failed to load activities: ${failure.message}');
        emit(ActivitiesState.error(failure.message));
      },
      (activities) {
        logger.i('Loaded ${activities.length} activities');
        emit(ActivitiesState.loaded(activities));
      },
    );
  }

  Future<void> refreshActivities({bool? isActive}) async {
    await getActivities(isActive: isActive, forceRefresh: true);
  }

  Future<void> getActivityById(String id) async {
    emit(const ActivitiesState.loading());

    final result = await repository.getActivityById(id);

    result.fold(
      (failure) {
        logger.e('Failed to load activity: ${failure.message}');
        emit(ActivitiesState.error(failure.message));
      },
      (activity) {
        logger.i('Loaded activity: ${activity.title}');
        emit(ActivitiesState.loadedDetails(activity));
      },
    );
  }

  Future<bool> createActivity({
    required String title,
    File? imageFile,
    String? color,
    int? order,
    bool? isActive,
  }) async {
    try {
      final result = await repository.createActivity(
        title: title,
        imageFile: imageFile,
        color: color,
        order: order,
        isActive: isActive,
      );

      return result.fold(
        (failure) {
          logger.e('Failed to create activity: ${failure.message}');
          return false;
        },
        (activity) {
          logger.i('Created activity: ${activity.title}');
          return true;
        },
      );
    } catch (e) {
      logger.e('Error creating activity: $e');
      return false;
    }
  }

  Future<bool> updateActivity({
    required String id,
    String? title,
    File? imageFile,
    String? color,
    int? order,
    bool? isActive,
  }) async {
    try {
      final result = await repository.updateActivity(
        id: id,
        title: title,
        imageFile: imageFile,
        color: color,
        order: order,
        isActive: isActive,
      );

      return result.fold(
        (failure) {
          logger.e('Failed to update activity: ${failure.message}');
          return false;
        },
        (activity) {
          logger.i('Updated activity: ${activity.title}');
          return true;
        },
      );
    } catch (e) {
      logger.e('Error updating activity: $e');
      return false;
    }
  }

  Future<bool> deleteActivity(String id) async {
    try {
      final result = await repository.deleteActivity(id);

      return result.fold(
        (failure) {
          logger.e('Failed to delete activity: ${failure.message}');
          return false;
        },
        (_) {
          logger.i('Deleted activity: $id');
          return true;
        },
      );
    } catch (e) {
      logger.e('Error deleting activity: $e');
      return false;
    }
  }

  Future<bool> toggleActivityStatus(String id) async {
    try {
      final result = await repository.toggleActivityStatus(id);

      return result.fold(
        (failure) {
          logger.e('Failed to toggle activity status: ${failure.message}');
          return false;
        },
        (activity) {
          logger.i('Toggled activity status: ${activity.title} - ${activity.isActive}');
          return true;
        },
      );
    } catch (e) {
      logger.e('Error toggling activity status: $e');
      return false;
    }
  }

  Future<bool> reorderActivities(List<Map<String, dynamic>> activities) async {
    try {
      final result = await repository.reorderActivities(activities);

      return result.fold(
        (failure) {
          logger.e('Failed to reorder activities: ${failure.message}');
          return false;
        },
        (_) {
          logger.i('Reordered activities successfully');
          return true;
        },
      );
    } catch (e) {
      logger.e('Error reordering activities: $e');
      return false;
    }
  }
}
