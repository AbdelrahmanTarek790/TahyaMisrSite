import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/usecases/usecase.dart';
import '../../domain/usecases/get_events_usecase.dart';
import 'events_event.dart';
import 'events_state.dart';

@injectable
class EventsBloc extends Bloc<EventsEvent, EventsState> {
  final GetEventsUseCase getEventsUseCase;

  EventsBloc({
    required this.getEventsUseCase,
  }) : super(const EventsState.initial()) {
    on<GetEvents>(_onGetEvents);
    on<RefreshEvents>(_onRefreshEvents);
    on<GetEventById>(_onGetEventById);
    on<RegisterForEvent>(_onRegisterForEvent);
  }

  Future<void> _onGetEvents(
    GetEvents event,
    Emitter<EventsState> emit,
  ) async {
    emit(const EventsState.loading());

    final result = await getEventsUseCase(const EventsParams());

    result.fold(
      (failure) => emit(EventsState.error(message: failure.message)),
      (events) => emit(EventsState.loaded(events: events)),
    );
  }

  Future<void> _onRefreshEvents(
    RefreshEvents event,
    Emitter<EventsState> emit,
  ) async {
    add(const EventsEvent.getEvents());
  }

  Future<void> _onGetEventById(
    GetEventById event,
    Emitter<EventsState> emit,
  ) async {
    // This would need a separate usecase for getting single event
    // For now, just refresh the list
    add(const EventsEvent.getEvents());
  }

  Future<void> _onRegisterForEvent(
    RegisterForEvent event,
    Emitter<EventsState> emit,
  ) async {
    // This would need a separate usecase for event registration
    // For now, just show success message
  }
}