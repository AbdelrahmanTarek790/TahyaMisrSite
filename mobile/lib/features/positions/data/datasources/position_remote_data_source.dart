import '../../../../core/network/api_client.dart';
import '../models/position_model.dart';

abstract class PositionRemoteDataSource {
  Future<List<PositionModel>> getPositions({String? governorate});
  Future<PositionModel> getPositionById(String id);
  Future<PositionModel> createPosition(Map<String, dynamic> positionData);
  Future<PositionModel> updatePosition(String id, Map<String, dynamic> positionData);
  Future<void> deletePosition(String id);
}

class PositionRemoteDataSourceImpl implements PositionRemoteDataSource {
  final ApiClient apiClient;

  PositionRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<List<PositionModel>> getPositions({String? governorate}) async {
    try {
      final response = await apiClient.getPositions(governorate);
      
      if (response.success && response.data != null) {
        final List<dynamic> positionsJson = response.data is List 
            ? response.data 
            : (response.data as Map<String, dynamic>)['positions'] ?? [];
        
        return positionsJson
            .map((json) => PositionModel.fromJson(json as Map<String, dynamic>))
            .toList();
      } else {
        throw Exception(response.error ?? 'Failed to fetch positions');
      }
    } catch (e) {
      print('Error fetching positions: $e');
      throw Exception('Failed to fetch positions: $e');
    }
  }

  @override
  Future<PositionModel> getPositionById(String id) async {
    try {
      final response = await apiClient.getPositionById(id);
      
      if (response.success && response.data != null) {
        return PositionModel.fromJson(response.data as Map<String, dynamic>);
      } else {
        throw Exception(response.error ?? 'Failed to fetch position');
      }
    } catch (e) {
      print('Error fetching position: $e');
      throw Exception('Failed to fetch position: $e');
    }
  }

  @override
  Future<PositionModel> createPosition(Map<String, dynamic> positionData) async {
    try {
      final response = await apiClient.createPosition(positionData);
      
      if (response.success && response.data != null) {
        return PositionModel.fromJson(response.data as Map<String, dynamic>);
      } else {
        throw Exception(response.error ?? 'Failed to create position');
      }
    } catch (e) {
      print('Error creating position: $e');
      throw Exception('Failed to create position: $e');
    }
  }

  @override
  Future<PositionModel> updatePosition(String id, Map<String, dynamic> positionData) async {
    try {
      final response = await apiClient.updatePosition(id, positionData);
      
      if (response.success && response.data != null) {
        return PositionModel.fromJson(response.data as Map<String, dynamic>);
      } else {
        throw Exception(response.error ?? 'Failed to update position');
      }
    } catch (e) {
      print('Error updating position: $e');
      throw Exception('Failed to update position: $e');
    }
  }

  @override
  Future<void> deletePosition(String id) async {
    try {
      final response = await apiClient.deletePosition(id);
      
      if (!response.success) {
        throw Exception(response.error ?? 'Failed to delete position');
      }
    } catch (e) {
      print('Error deleting position: $e');
      throw Exception('Failed to delete position: $e');
    }
  }
}