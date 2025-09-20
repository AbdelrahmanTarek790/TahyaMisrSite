import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../domain/usecases/get_events_detail_usecase.dart';
import '../../domain/usecases/get_events_usecase.dart';
import 'events_event.dart';
import 'events_state.dart';

@injectable
class EventsBloc extends Bloc<EventsEvent, EventsState> {
  final GetEventsUseCase getEventsUseCase;

  final GetEventsDetailUseCase getEventsDetailUseCase;

  EventsBloc(
      {required this.getEventsUseCase, required this.getEventsDetailUseCase,})
      : super(const EventsState.initial()) {
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
    emit(const EventsState.loading());
    final result =
        await getEventsDetailUseCase(GetEventsDetailParams(id: event.id));

    result.fold(
      (failure) => emit(EventsState.error(message: failure.message)),
      (eventDetails) => emit(EventsState.loadedDetails(eventDetails:eventDetails)),
    );
  }

  Future<void> _onRegisterForEvent(
    RegisterForEvent event,
    Emitter<EventsState> emit,
  ) async {
  }
}
