import 'package:hive/hive.dart';
import '../models/achievement_model.dart';

class AchievementsLocalStorage {
  final Box achievementsBox;

  AchievementsLocalStorage(this.achievementsBox);

  Future<void> cacheAchievements(List<AchievementModel> achievements) async {
    try {
      final achievementsJson = achievements.map((a) => a.toJson()).toList();
      await achievementsBox.put('achievements', achievementsJson);
      await achievementsBox.put('achievements_timestamp', DateTime.now().toIso8601String());
      print('Cached ${achievements.length} achievements');
    } catch (e) {
      print('Error caching achievements: $e');
    }
  }

  Future<List<AchievementModel>?> getCachedAchievements() async {
    try {
      final cachedData = achievementsBox.get('achievements');
      if (cachedData == null) return null;

      final achievementsList = (cachedData as List)
          .map((json) => AchievementModel.fromJson(Map<String, dynamic>.from(json as Map)))
          .toList();
      
      print('Retrieved ${achievementsList.length} cached achievements');
      return achievementsList;
    } catch (e) {
      print('Error retrieving cached achievements: $e');
      return null;
    }
  }

  Future<void> cacheAchievement(AchievementModel achievement) async {
    try {
      await achievementsBox.put('achievement_${achievement.id}', achievement.toJson());
      print('Cached achievement: ${achievement.title}');
    } catch (e) {
      print('Error caching achievement: $e');
    }
  }

  Future<AchievementModel?> getCachedAchievement(String id) async {
    try {
      final cachedData = achievementsBox.get('achievement_$id');
      if (cachedData == null) return null;

      return AchievementModel.fromJson(Map<String, dynamic>.from(cachedData as Map));
    } catch (e) {
      print('Error retrieving cached achievement: $e');
      return null;
    }
  }

  Future<void> clearCache() async {
    try {
      await achievementsBox.clear();
      print('Achievements cache cleared');
    } catch (e) {
      print('Error clearing achievements cache: $e');
    }
  }

  bool isCacheValid({Duration maxAge = const Duration(hours: 1)}) {
    try {
      final timestamp = achievementsBox.get('achievements_timestamp');
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
