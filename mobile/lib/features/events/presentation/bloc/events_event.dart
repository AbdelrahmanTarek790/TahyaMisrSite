import 'package:freezed_annotation/freezed_annotation.dart';

part 'events_event.freezed.dart';

@freezed
class EventsEvent with _$EventsEvent {
  const factory EventsEvent.getEvents() = GetEvents;
  const factory EventsEvent.refreshEvents() = RefreshEvents;
  const factory EventsEvent.getEventById(String id) = GetEventById;
  const factory EventsEvent.registerForEvent(String eventId) = RegisterForEvent;
}