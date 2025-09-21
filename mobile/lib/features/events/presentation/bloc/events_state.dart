import 'package:freezed_annotation/freezed_annotation.dart';
import '../../domain/entities/event.dart';

part 'events_state.freezed.dart';

@freezed
class EventsState with _$EventsState {
  const factory EventsState.initial() = _Initial;
  const factory EventsState.loading() = _Loading;
  const factory EventsState.loaded({
    required List<Event> events,
  }) = _Loaded;
  const factory EventsState.error({
    required String message,
  }) = _Error;

  const factory EventsState.loadedDetails({
    required Event eventDetails,
  }) = _LoadedDetails;

  const factory EventsState.registeredSuccessfully({
    required String message,
  }) = _RegisteredSuccessfully;
}