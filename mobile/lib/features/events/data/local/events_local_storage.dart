import 'dart:convert';
import 'package:hive/hive.dart';

import '../../../../core/constants/app_constants.dart';
import '../../../../core/error/exceptions.dart';
import '../models/event_model.dart';

class EventsLocalStorage {
  final Box eventsBox;

  EventsLocalStorage(this.eventsBox);

  Future<void> cacheEvents(List<EventModel> eventsList) async {
    try {
      final eventsJsonList = eventsList.map((event) => event.toJson()).toList();
      await eventsBox.put(AppConstants.eventsKey, jsonEncode(eventsJsonList));
    } catch (e) {
      throw CacheException('Failed to cache events: $e');
    }
  }

  Future<List<EventModel>?> getCachedEvents() async {
    try {
      final eventsJsonString = eventsBox.get(AppConstants.eventsKey);
      if (eventsJsonString != null) {
        final eventsJsonList = jsonDecode(eventsJsonString) as List<dynamic>;
        return eventsJsonList
            .map((json) => EventModel.fromJson(json as Map<String, dynamic>))
            .toList();
      }
      return null;
    } catch (e) {
      throw CacheException('Failed to get cached events: $e');
    }
  }

  Future<void> clearCachedEvents() async {
    try {
      await eventsBox.delete(AppConstants.eventsKey);
    } catch (e) {
      throw CacheException('Failed to clear cached events: $e');
    }
  }

  Future<void> cacheEventDetail(String id, EventModel event) async {
    try {
      await eventsBox.put('event_detail_$id', jsonEncode(event.toJson()));
    } catch (e) {
      throw CacheException('Failed to cache event detail: $e');
    }
  }

  Future<EventModel?> getCachedEventDetail(String id) async {
    try {
      final eventJsonString = eventsBox.get('event_detail_$id');
      if (eventJsonString != null) {
        final eventJson = jsonDecode(eventJsonString) as Map<String, dynamic>;
        return EventModel.fromJson(eventJson);
      }
      return null;
    } catch (e) {
      throw CacheException('Failed to get cached event detail: $e');
    }
  }
}