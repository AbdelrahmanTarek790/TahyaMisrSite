import 'dart:convert';
import 'package:hive/hive.dart';

import '../../../../core/error/exceptions.dart';
import '../models/event_model.dart';

abstract class EventsLocalDataSource {
  Future<List<EventModel>> getCachedEvents();
  Future<void> cacheEvents(List<EventModel> events);
  Future<EventModel?> getCachedEventById(String id);
  Future<void> cacheEvent(EventModel event);
  Future<void> clearEventCache();
}

class EventsLocalDataSourceImpl implements EventsLocalDataSource {
  final Box eventsBox;
  
  static const String _eventsKey = 'cached_events';
  static const String _eventPrefix = 'event_';

  EventsLocalDataSourceImpl(this.eventsBox);

  @override
  Future<List<EventModel>> getCachedEvents() async {
    try {
      final String? eventsJson = eventsBox.get(_eventsKey);
      if (eventsJson != null) {
        final List<dynamic> eventsList = jsonDecode(eventsJson);
        return eventsList
            .map((eventJson) => EventModel.fromJson(eventJson))
            .toList();
      }
      return [];
    } catch (e) {
      throw CacheException('Failed to get cached events: $e');
    }
  }

  @override
  Future<void> cacheEvents(List<EventModel> events) async {
    try {
      final String eventsJson = jsonEncode(
        events.map((event) => event.toJson()).toList(),
      );
      await eventsBox.put(_eventsKey, eventsJson);
      
      // Also cache individual events
      for (final event in events) {
        await eventsBox.put(
          '$_eventPrefix${event.id}',
          jsonEncode(event.toJson()),
        );
      }
    } catch (e) {
      throw CacheException('Failed to cache events: $e');
    }
  }

  @override
  Future<EventModel?> getCachedEventById(String id) async {
    try {
      final String? eventJson = eventsBox.get('$_eventPrefix$id');
      if (eventJson != null) {
        return EventModel.fromJson(jsonDecode(eventJson));
      }
      return null;
    } catch (e) {
      throw CacheException('Failed to get cached event: $e');
    }
  }

  @override
  Future<void> cacheEvent(EventModel event) async {
    try {
      await eventsBox.put(
        '$_eventPrefix${event.id}',
        jsonEncode(event.toJson()),
      );
    } catch (e) {
      throw CacheException('Failed to cache event: $e');
    }
  }

  @override
  Future<void> clearEventCache() async {
    try {
      await eventsBox.delete(_eventsKey);
      
      // Clear individual event cache entries
      final keys = eventsBox.keys.where((key) => 
        key.toString().startsWith(_eventPrefix)
      ).toList();
      
      for (final key in keys) {
        await eventsBox.delete(key);
      }
    } catch (e) {
      throw CacheException('Failed to clear event cache: $e');
    }
  }
}