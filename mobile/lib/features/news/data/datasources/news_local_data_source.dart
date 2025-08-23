import 'dart:convert';
import 'package:hive/hive.dart';

import '../../../../core/error/exceptions.dart';
import '../models/news_model.dart';

abstract class NewsLocalDataSource {
  Future<List<NewsModel>> getCachedNews();
  Future<void> cacheNews(List<NewsModel> news);
  Future<NewsModel?> getCachedNewsById(String id);
  Future<void> cacheNewsItem(NewsModel news);
  Future<void> clearNewsCache();
}

class NewsLocalDataSourceImpl implements NewsLocalDataSource {
  final Box newsBox;
  
  static const String _newsKey = 'cached_news';
  static const String _newsPrefix = 'news_';

  NewsLocalDataSourceImpl(this.newsBox);

  @override
  Future<List<NewsModel>> getCachedNews() async {
    try {
      final String? newsJson = newsBox.get(_newsKey);
      if (newsJson != null) {
        final List<dynamic> newsList = jsonDecode(newsJson);
        return newsList
            .map((newsJson) => NewsModel.fromJson(newsJson))
            .toList();
      }
      return [];
    } catch (e) {
      throw CacheException('Failed to get cached news: $e');
    }
  }

  @override
  Future<void> cacheNews(List<NewsModel> news) async {
    try {
      final String newsJson = jsonEncode(
        news.map((newsItem) => newsItem.toJson()).toList(),
      );
      await newsBox.put(_newsKey, newsJson);
      
      // Also cache individual news items
      for (final newsItem in news) {
        await newsBox.put(
          '$_newsPrefix${newsItem.id}',
          jsonEncode(newsItem.toJson()),
        );
      }
    } catch (e) {
      throw CacheException('Failed to cache news: $e');
    }
  }

  @override
  Future<NewsModel?> getCachedNewsById(String id) async {
    try {
      final String? newsJson = newsBox.get('$_newsPrefix$id');
      if (newsJson != null) {
        return NewsModel.fromJson(jsonDecode(newsJson));
      }
      return null;
    } catch (e) {
      throw CacheException('Failed to get cached news: $e');
    }
  }

  @override
  Future<void> cacheNewsItem(NewsModel news) async {
    try {
      await newsBox.put(
        '$_newsPrefix${news.id}',
        jsonEncode(news.toJson()),
      );
    } catch (e) {
      throw CacheException('Failed to cache news item: $e');
    }
  }

  @override
  Future<void> clearNewsCache() async {
    try {
      await newsBox.delete(_newsKey);
      
      // Clear individual news cache entries
      final keys = newsBox.keys.where((key) => 
        key.toString().startsWith(_newsPrefix)
      ).toList();
      
      for (final key in keys) {
        await newsBox.delete(key);
      }
    } catch (e) {
      throw CacheException('Failed to clear news cache: $e');
    }
  }
}