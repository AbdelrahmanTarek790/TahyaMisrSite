import '../../../../core/network/api_client.dart';
import '../../../../core/error/exceptions.dart';
import '../models/media_model.dart';

class MediaApiService {
  final ApiClient apiClient;

  MediaApiService(this.apiClient);

  Future<List<MediaModel>> getMedia({
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final response = await apiClient.getMedia(page, limit);
      
      if (response.success && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        final mediaList = data['media'] as List<dynamic>? ?? [];
        
        final mediaModels = <MediaModel>[];
        for (final mediaJson in mediaList) {
          try {
            final mediaModel = MediaModel.fromJson(mediaJson as Map<String, dynamic>);
            mediaModels.add(mediaModel);
          } catch (e) {
            print('Error parsing media item: $e');
          }
        }
        
        return mediaModels;
      } else {
        throw ServerException(response.error ?? 'Failed to fetch media');
      }
    } catch (e) {
      if (e is ServerException) rethrow;
      throw ServerException('Unexpected error occurred: $e');
    }
  }
}