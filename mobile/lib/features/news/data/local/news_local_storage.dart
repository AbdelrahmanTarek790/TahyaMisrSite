import 'dart:convert';
import 'package:hive/hive.dart';

import '../../../../core/constants/app_constants.dart';
import '../../../../core/error/exceptions.dart';
import '../models/news_model.dart';

class NewsLocalStorage {
  final Box newsBox;

  NewsLocalStorage(this.newsBox);

  Future<void> cacheNews(List<NewsModel> newsList) async {
    try {
      final newsJsonList = newsList.map((news) => news.toJson()).toList();
      await newsBox.put(AppConstants.newsKey, jsonEncode(newsJsonList));
    } catch (e) {
      throw CacheException('Failed to cache news: $e');
    }
  }

  Future<List<NewsModel>?> getCachedNews() async {
    try {
      final newsJsonString = newsBox.get(AppConstants.newsKey);
      if (newsJsonString != null) {
        final newsJsonList = jsonDecode(newsJsonString) as List<dynamic>;
        return newsJsonList
            .map((json) => NewsModel.fromJson(json as Map<String, dynamic>))
            .toList();
      }
      return null;
    } catch (e) {
      throw CacheException('Failed to get cached news: $e');
    }
  }

  Future<void> clearCachedNews() async {
    try {
      await newsBox.delete(AppConstants.newsKey);
    } catch (e) {
      throw CacheException('Failed to clear cached news: $e');
    }
  }

  Future<void> cacheNewsDetail(String id, NewsModel news) async {
    try {
      await newsBox.put('${AppConstants.newsDetailKey}_$id', jsonEncode(news.toJson()));
    } catch (e) {
      throw CacheException('Failed to cache news detail: $e');
    }
  }

  Future<NewsModel?> getCachedNewsDetail(String id) async {
    try {
      final newsJsonString = newsBox.get('${AppConstants.newsDetailKey}_$id');
      if (newsJsonString != null) {
        final newsJson = jsonDecode(newsJsonString) as Map<String, dynamic>;
        return NewsModel.fromJson(newsJson);
      }
      return null;
    } catch (e) {
      throw CacheException('Failed to get cached news detail: $e');
    }
  }
}