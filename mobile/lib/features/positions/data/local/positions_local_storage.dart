import 'dart:convert';
import 'package:hive/hive.dart';
import '../../../../core/error/exceptions.dart';
import '../models/position_model.dart';

class PositionsLocalStorage {
  final Box positionsBox;

  PositionsLocalStorage(this.positionsBox);

  Future<void> cachePositions(List<PositionModel> positions) async {
    try {
      final positionsJsonList = positions.map((position) => position.toJson()).toList();
      await positionsBox.put('positions', jsonEncode(positionsJsonList));
    } catch (e) {
      throw CacheException('Failed to cache positions: $e');
    }
  }

  Future<List<PositionModel>?> getCachedPositions() async {
    try {
      final positionsJsonString = positionsBox.get('positions');
      if (positionsJsonString != null) {
        final positionsJsonList = jsonDecode(positionsJsonString) as List<dynamic>;
        return positionsJsonList
            .map((json) => PositionModel.fromJson(json as Map<String, dynamic>))
            .toList();
      }
      return null;
    } catch (e) {
      throw CacheException('Failed to get cached positions: $e');
    }
  }
}