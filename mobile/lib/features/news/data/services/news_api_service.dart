import 'dart:io';

import 'package:dio/dio.dart';
import 'package:http_parser/http_parser.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/error/exceptions.dart';
import '../models/news_model.dart';

class NewsApiService {
  final ApiClient apiClient;

  NewsApiService(this.apiClient);

  Future<List<NewsModel>> getNews({
    int page = 1,
    int limit = 10,
  }) async
  {
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


  Future<NewsModel> createNews({
    required String title,
    required String content,
    required String imagePath,
  }) async {
    try {
      final file = File(imagePath);

      final allowedExtensions = ['jpg', 'jpeg', 'png'];
      final ext = file.path.split('.').last.toLowerCase();

      if (!allowedExtensions.contains(ext)) {
        throw const ServerException('Only image files are allowed');
      }

      final multipartFile = await MultipartFile.fromFile(
        file.path,
        filename: file.path.split('/').last,
        contentType: MediaType('image', ext),
      );

      // FormData
      final formData = FormData.fromMap({
        'title': title,
        'content': content,
        'image': multipartFile,
      });
      final result = await apiClient.createNews(formData);
      return result.data as NewsModel ;
    } catch (e) {
      throw ServerException('Unexpected error occurred: ${e.toString()}');
    }
  }

  Future<NewsModel> updateNews({
    required String newsId,
    required String title,
    required String content,
    String? imagePath,
  }) async {
    try {
      final FormData formData  ;
      if(imagePath != null){
        final file = File(imagePath);

        final allowedExtensions = ['jpg', 'jpeg', 'png'];
        final ext = file.path.split('.').last.toLowerCase();

        if (!allowedExtensions.contains(ext)) {
          throw const ServerException('Only image files are allowed');
        }

        final multipartFile = await MultipartFile.fromFile(
          file.path,
          filename: file.path.split('/').last,
          contentType: MediaType('image', ext),
        );

        // FormData
        formData = FormData.fromMap({
          'title': title,
          'content': content,
          'image': multipartFile,
        });
        final result = await apiClient.updateNews(newsId, formData);
        return result.data as NewsModel ;
      }
      formData = FormData.fromMap({
        'title': title,
        'content': content,
      });
      final result = await apiClient.updateNews(newsId, formData);
      return result.data as NewsModel ;
    } catch (e) {
      throw ServerException('Unexpected error occurred: ${e.toString()}');
    }
  }
  Future<void> deleteNews(String newsId) async {
    try {
      await apiClient.deleteNews(newsId);
    } catch (e) {
      throw ServerException('Unexpected error occurred: ${e.toString()}');
    }
  }
}