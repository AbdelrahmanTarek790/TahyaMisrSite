import '../../../../core/network/api_client.dart';
import '../../../../core/error/exceptions.dart';
import '../models/news_model.dart';

class NewsApiService {
  final ApiClient apiClient;

  NewsApiService(this.apiClient);

  Future<List<NewsModel>> getNews({
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final response = await apiClient.getNews(page, limit);
      
      if (response.success && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        final newsList = data['news'] as List<dynamic>? ?? [];
        
        print('News list length: ${newsList.length}');
        
        final newsModels = <NewsModel>[];
        for (final newsJson in newsList) {
          try {
            final newsModel = NewsModel.fromJson(newsJson as Map<String, dynamic>);
            newsModels.add(newsModel);
          } catch (e) {
            print('Error parsing news item: $e, Data: $newsJson');
          }
        }
        
        return newsModels;
      } else {
        throw ServerException(
          response.error ?? 'Failed to fetch news',
        );
      }
    } catch (e) {
      print('News fetch error: $e');
      if (e is ServerException) {
        rethrow;
      }
      throw ServerException(
        'Unexpected error occurred: ${e.toString()}',
      );
    }
  }

  Future<NewsModel> getNewsById(String id) async {
    try {
      final response = await apiClient.getNewsById(id);
      if (response.success && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        final newsModel = NewsModel.fromJson(data);
        return newsModel;
      } else {
        throw ServerException(
          response.error ?? 'Failed to fetch news',
        );
      }
    } catch (e) {
      print('NewsDetails by ID fetch error: $e');
      if (e is ServerException) {
        rethrow;
      }
      throw ServerException(
        'Unexpected error occurred: ${e.toString()}',
      );
    }
  }
}