part of 'events_cubit.dart';

@freezed
class EventsState with _$EventsState {
  const factory EventsState.initial() = _Initial;
  const factory EventsState.loading() = _Loading;
  const factory EventsState.loaded({
    required List<EventModel> events,
  }) = _Loaded;
  const factory EventsState.error({
    required String message,
  }) = _Error;

  const factory EventsState.loadedDetails({
    required EventModel eventDetails,
  }) = _LoadedDetails;

  const factory EventsState.registeredSuccessfully({
    required String message,
  }) = _RegisteredSuccessfully;

  const factory EventsState.eventCreated({
    required EventModel newEvent,
  }) = _EventCreated;

  const factory EventsState.eventDeleted({
    required String message,
  }) = _EventDeleted;
}