import '../../../../core/network/api_client.dart';
import '../../../../core/error/exceptions.dart';
import '../models/position_model.dart';

class PositionsApiService {
  final ApiClient apiClient;

  PositionsApiService(this.apiClient);

  Future<List<PositionModel>> getPositions({String? governorate}) async {
    try {
      final response = await apiClient.getPositions(governorate);
      if (response.success && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        final positionsList = data['positions'] as List<dynamic>? ?? [];
        return positionsList.map((json) => PositionModel.fromJson(json as Map<String, dynamic>)).toList();
      } else {
        throw ServerException(response.error ?? 'Failed to fetch positions');
      }
    } catch (e) {
      if (e is ServerException) rethrow;
      throw ServerException('Unexpected error occurred: $e');
    }
  }

  Future<PositionModel> getPositionById(String id) async {
    try {
      final response = await apiClient.getPositionById(id);
      if (response.success && response.data != null) {
        return PositionModel.fromJson(response.data as Map<String, dynamic>);
      } else {
        throw ServerException(response.error ?? 'Failed to fetch position');
      }
    } catch (e) {
      if (e is ServerException) rethrow;
      throw ServerException('Unexpected error occurred: $e');
    }
  }

  Future<PositionModel> createPosition(Map<String, dynamic> positionData) async {
    try {
      final response = await apiClient.createPosition(positionData);
      if (response.success && response.data != null) {
        return PositionModel.fromJson(response.data as Map<String, dynamic>);
      } else {
        throw ServerException(response.error ?? 'Failed to create position');
      }
    } catch (e) {
      if (e is ServerException) rethrow;
      throw ServerException('Unexpected error occurred: $e');
    }
  }

  Future<PositionModel> updatePosition(String id, Map<String, dynamic> positionData) async {
    try {
      final response = await apiClient.updatePosition(id, positionData);
      if (response.success && response.data != null) {
        return PositionModel.fromJson(response.data as Map<String, dynamic>);
      } else {
        throw ServerException(response.error ?? 'Failed to update position');
      }
    } catch (e) {
      if (e is ServerException) rethrow;
      throw ServerException('Unexpected error occurred: $e');
    }
  }

  Future<void> deletePosition(String id) async {
    try {
      final response = await apiClient.deletePosition(id);
      if (!response.success) {
        throw ServerException(response.error ?? 'Failed to delete position');
      }
    } catch (e) {
      if (e is ServerException) rethrow;
      throw ServerException('Unexpected error occurred: $e');
    }
  }
}