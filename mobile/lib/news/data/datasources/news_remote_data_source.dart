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
      
      // print('News API Response: ${response.toJson()}'); // Debug logging
      
      if (response.success && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        final newsList = data['news'] as List<dynamic>? ?? [];
        
        print('News list length: ${newsList.length}'); // Debug logging
        
        final newsModels = <NewsModel>[];
        for (final newsJson in newsList) {
          try {
            final newsModel = NewsModel.fromJson(newsJson as Map<String, dynamic>);
            newsModels.add(newsModel);
          } catch (e) {
            print('Error parsing news item: $e, Data: $newsJson'); // Debug logging
          }
        }
        
        return newsModels;
      } else {
        throw ServerException(
          response.error ?? 'Failed to fetch news',
        );
      }
    } catch (e) {
      print('News fetch error: $e'); // Debug logging
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
      
      // print('News by ID API Response: ${response.toJson()}'); // Debug logging
      
      if (response.success && response.data != null) {
        return NewsModel.fromJson(response.data as Map<String, dynamic>);
      } else {
        throw ServerException(
          response.error ?? 'Failed to fetch news',
        );
      }
    } catch (e) {
      print('News by ID fetch error: $e'); // Debug logging
      if (e is ServerException) {
        rethrow;
      }
      throw ServerException(
        'Unexpected error occurred: ${e.toString()}',
      );
    }
  }
}