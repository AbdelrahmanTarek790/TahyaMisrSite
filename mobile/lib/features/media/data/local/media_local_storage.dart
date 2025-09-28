import 'dart:convert';
import 'package:hive/hive.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/error/exceptions.dart';
import '../models/media_model.dart';

class MediaLocalStorage {
  final Box mediaBox;

  MediaLocalStorage(this.mediaBox);

  Future<void> cacheMedia(List<MediaModel> mediaList) async {
    try {
      final mediaJsonList = mediaList.map((media) => media.toJson()).toList();
      await mediaBox.put(AppConstants.mediaKey, jsonEncode(mediaJsonList));
    } catch (e) {
      throw CacheException('Failed to cache media: $e');
    }
  }

  Future<List<MediaModel>?> getCachedMedia() async {
    try {
      final mediaJsonString = mediaBox.get(AppConstants.mediaKey);
      if (mediaJsonString != null) {
        final mediaJsonList = jsonDecode(mediaJsonString) as List<dynamic>;
        return mediaJsonList
            .map((json) => MediaModel.fromJson(json as Map<String, dynamic>))
            .toList();
      }
      return null;
    } catch (e) {
      throw CacheException('Failed to get cached media: $e');
    }
  }
}