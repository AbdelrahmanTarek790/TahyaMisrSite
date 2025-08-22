import '../../../../core/network/api_client.dart';
import '../../../../core/error/exceptions.dart';
import '../models/news_model.dart';

abstract class NewsRemoteDataSource {
  Future<List<NewsModel>> getNews({
    int page = 1,
    int limit = 10,
  });
  Future<NewsModel> getNewsById(String id);
}

class NewsRemoteDataSourceImpl implements NewsRemoteDataSource {
  final ApiClient apiClient;

  NewsRemoteDataSourceImpl(this.apiClient);

  @override
  Future<List<NewsModel>> getNews({
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final response = await apiClient.getNews(page, limit);
      
      if (response.success && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        final newsList = data['news'] as List<dynamic>;
        
        return newsList
            .map((json) => NewsModel.fromJson(json as Map<String, dynamic>))
            .toList();
      } else {
        throw ServerException(
          response.error ?? 'Failed to fetch news',
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
  Future<NewsModel> getNewsById(String id) async {
    try {
      final response = await apiClient.getNewsById(id);
      
      if (response.success && response.data != null) {
        return response.data!;
      } else {
        throw ServerException(
          response.error ?? 'Failed to fetch news',
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