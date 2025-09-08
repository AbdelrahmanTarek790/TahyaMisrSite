import 'package:flutter_test/flutter_test.dart';
import 'package:dartz/dartz.dart';
import 'package:mockito/mockito.dart';
import 'package:mockito/annotations.dart';

import 'package:tahya_misr_app/features/events/domain/repositories/event_repository.dart';
import 'package:tahya_misr_app/features/events/domain/usecases/register_for_event_usecase.dart';
import 'package:tahya_misr_app/core/error/failures.dart';

// Generate mocks with: flutter packages pub run build_runner build
@GenerateMocks([EventRepository])
import 'register_for_event_usecase_test.mocks.dart';

void main() {
  late RegisterForEventUseCase usecase;
  late MockEventRepository mockEventRepository;

  setUp(() {
    mockEventRepository = MockEventRepository();
    usecase = RegisterForEventUseCase(mockEventRepository);
  });

  const testEventId = '123';
  const testParams = RegisterForEventParams(eventId: testEventId);

  test(
    'should register for event when repository returns success',
    () async {
      // arrange
      when(mockEventRepository.registerForEvent(any))
          .thenAnswer((_) async => const Right(null));

      // act
      final result = await usecase(testParams);

      // assert
      expect(result, const Right(null));
      verify(mockEventRepository.registerForEvent(testEventId));
      verifyNoMoreInteractions(mockEventRepository);
    },
  );

  test(
    'should return server failure when repository fails',
    () async {
      // arrange
      const failure = ServerFailure('Server Error');
      when(mockEventRepository.registerForEvent(any))
          .thenAnswer((_) async => const Left(failure));

      // act
      final result = await usecase(testParams);

      // assert
      expect(result, const Left(failure));
      verify(mockEventRepository.registerForEvent(testEventId));
      verifyNoMoreInteractions(mockEventRepository);
    },
  );
}