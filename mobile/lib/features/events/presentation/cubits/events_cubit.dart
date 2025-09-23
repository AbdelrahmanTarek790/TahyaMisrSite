import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:injectable/injectable.dart';

import '../../data/models/event_model.dart';
import '../../data/repositories/events_repository.dart';

part 'events_state.dart';
part 'events_cubit.freezed.dart';

@injectable
class EventsCubit extends Cubit<EventsState> {
  final EventsRepository eventsRepository;

  EventsCubit({required this.eventsRepository}) : super(const EventsState.initial());

  Future<void> getEvents({int page = 1, int limit = 10}) async {
    emit(const EventsState.loading());

    final result = await eventsRepository.getEvents(page: page, limit: limit);

    result.fold(
      (failure) => emit(EventsState.error(message: failure.message)),
      (events) => emit(EventsState.loaded(events: events)),
    );
  }

  Future<void> refreshEvents() async {
    await getEvents();
  }

  Future<void> getEventById(String id) async {
    emit(const EventsState.loading());
    
    final result = await eventsRepository.getEventById(id);
    
    result.fold(
      (failure) => emit(EventsState.error(message: failure.message)),
      (eventDetails) => emit(EventsState.loadedDetails(eventDetails: eventDetails)),
    );
  }

  Future<void> registerForEvent(String eventId) async {
    emit(const EventsState.loading());
    
    final result = await eventsRepository.registerForEvent(eventId);
    
    result.fold(
      (failure) => emit(EventsState.error(message: failure.message)),
      (_) => emit(const EventsState.registeredSuccessfully(message: 'Successfully registered for event')),
    );
  }

  Future<void> getCachedEvents() async {
    final result = await eventsRepository.getCachedEvents();
    
    result.fold(
      (failure) => emit(EventsState.error(message: failure.message)),
      (events) => emit(EventsState.loaded(events: events)),
    );
  }
}