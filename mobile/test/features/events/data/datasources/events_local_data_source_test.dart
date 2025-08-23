import 'dart:convert';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:mockito/annotations.dart';
import 'package:hive/hive.dart';

import 'package:tahya_misr_app/features/events/data/datasources/events_local_data_source.dart';
import 'package:tahya_misr_app/features/events/data/models/event_model.dart';
import 'package:tahya_misr_app/core/error/exceptions.dart';

@GenerateMocks([Box])
import 'events_local_data_source_test.mocks.dart';

void main() {
  late EventsLocalDataSourceImpl dataSource;
  late MockBox mockBox;

  setUp(() {
    mockBox = MockBox();
    dataSource = EventsLocalDataSourceImpl(mockBox);
  });

  final testEventModel = EventModel(
    id: '1',
    title: 'Test Event',
    description: 'Test Description',
    eventDate: DateTime(2024, 1, 1),
    location: 'Test Location',
    createdAt: DateTime(2024, 1, 1),
    updatedAt: DateTime(2024, 1, 1),
    registeredUsers: [],
  );

  group('getCachedEvents', () {
    test(
      'should return cached events when data exists',
      () async {
        // arrange
        final jsonList = [testEventModel.toJson()];
        final encodedData = jsonEncode(jsonList);
        when(mockBox.get('cached_events')).thenReturn(encodedData);

        // act
        final result = await dataSource.getCachedEvents();

        // assert
        expect(result, isA<List<EventModel>>());
        expect(result.length, 1);
        expect(result.first.id, testEventModel.id);
      },
    );

    test(
      'should return empty list when no cached data exists',
      () async {
        // arrange
        when(mockBox.get('cached_events')).thenReturn(null);

        // act
        final result = await dataSource.getCachedEvents();

        // assert
        expect(result, isEmpty);
      },
    );

    test(
      'should throw CacheException when getting cached events fails',
      () async {
        // arrange
        when(mockBox.get('cached_events')).thenThrow(Exception('Cache error'));

        // act & assert
        expect(
          () => dataSource.getCachedEvents(),
          throwsA(isA<CacheException>()),
        );
      },
    );
  });

  group('cacheEvents', () {
    test(
      'should cache events successfully',
      () async {
        // arrange
        final events = [testEventModel];
        
        // act
        await dataSource.cacheEvents(events);

        // assert
        verify(mockBox.put('cached_events', any)).called(1);
        verify(mockBox.put('event_${testEventModel.id}', any)).called(1);
      },
    );

    test(
      'should throw CacheException when caching fails',
      () async {
        // arrange
        final events = [testEventModel];
        when(mockBox.put(any, any)).thenThrow(Exception('Cache error'));

        // act & assert
        expect(
          () => dataSource.cacheEvents(events),
          throwsA(isA<CacheException>()),
        );
      },
    );
  });
}