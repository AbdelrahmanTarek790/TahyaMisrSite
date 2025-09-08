import '../../../../core/network/api_client.dart';
import '../../../../core/error/exceptions.dart';
import '../models/media_model.dart';

abstract class MediaRemoteDataSource {
  Future<List<MediaModel>> getMedia({
    int page = 1,
    int limit = 10,
  });
  Future<MediaModel> getMediaById(String id);
}

class MediaRemoteDataSourceImpl implements MediaRemoteDataSource {
  final ApiClient apiClient;

  MediaRemoteDataSourceImpl(this.apiClient);

  @override
  Future<List<MediaModel>> getMedia({
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final response = await apiClient.getMedia(page, limit);
      
      if (response.success && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        final mediaList = data['media'] as List<dynamic>;
        
        return mediaList
            .map((json) => MediaModel.fromJson(json as Map<String, dynamic>))
            .toList();
      } else {
        throw ServerException(
          response.error ?? 'Failed to fetch media',
        );
      }
    } catch (e) {
      if (e is ServerException) {
        rethrow;
      }
      throw ServerException(
        'Unexpected error occurred: ${e.toString()}',
      );
    }
  }

  @override
  Future<MediaModel> getMediaById(String id) async {
    try {
      final response = await apiClient.getMediaById(id);
      
      if (response.success && response.data != null) {
        return response.data!;
      } else {
        throw ServerException(
          response.error ?? 'Failed to fetch media',
        );
      }
    } catch (e) {
      if (e is ServerException) {
        rethrow;
      }
      throw ServerException(
        'Unexpected error occurred: ${e.toString()}',
      );
    }
  }
}