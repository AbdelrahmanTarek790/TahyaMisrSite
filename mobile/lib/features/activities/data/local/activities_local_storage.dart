import 'package:hive/hive.dart';
import '../models/activity_model.dart';

class ActivitiesLocalStorage {
  final Box activitiesBox;

  ActivitiesLocalStorage(this.activitiesBox);

  Future<void> cacheActivities(List<ActivityModel> activities) async {
    try {
      final activitiesJson = activities.map((a) => a.toJson()).toList();
      await activitiesBox.put('activities', activitiesJson);
      await activitiesBox.put('activities_timestamp', DateTime.now().toIso8601String());
      print('Cached ${activities.length} activities');
    } catch (e) {
      print('Error caching activities: $e');
    }
  }

  Future<List<ActivityModel>?> getCachedActivities() async {
    try {
      final cachedData = activitiesBox.get('activities');
      if (cachedData == null) return null;

      final activitiesList = (cachedData as List)
          .map((json) => ActivityModel.fromJson(Map<String, dynamic>.from(json as Map)))
          .toList();
      
      print('Retrieved ${activitiesList.length} cached activities');
      return activitiesList;
    } catch (e) {
      print('Error retrieving cached activities: $e');
      return null;
    }
  }

  Future<void> cacheActivity(ActivityModel activity) async {
    try {
      await activitiesBox.put('activity_${activity.id}', activity.toJson());
      print('Cached activity: ${activity.title}');
    } catch (e) {
      print('Error caching activity: $e');
    }
  }

  Future<ActivityModel?> getCachedActivity(String id) async {
    try {
      final cachedData = activitiesBox.get('activity_$id');
      if (cachedData == null) return null;

      return ActivityModel.fromJson(Map<String, dynamic>.from(cachedData as Map));
    } catch (e) {
      print('Error retrieving cached activity: $e');
      return null;
    }
  }

  Future<void> clearCache() async {
    try {
      await activitiesBox.clear();
      print('Activities cache cleared');
    } catch (e) {
      print('Error clearing activities cache: $e');
    }
  }

  bool isCacheValid({Duration maxAge = const Duration(hours: 1)}) {
    try {
      final timestamp = activitiesBox.get('activities_timestamp');
      if (timestamp == null) return false;

      final cacheTime = DateTime.parse(timestamp as String);
      final now = DateTime.now();
      return now.difference(cacheTime) < maxAge;
    } catch (e) {
      print('Error checking cache validity: $e');
      return false;
    }
  }
}
