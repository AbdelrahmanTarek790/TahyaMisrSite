import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:tahya_misr_app/features/events/domain/usecases/register_event_usecase.dart';

import '../../domain/usecases/get_events_detail_usecase.dart';
import '../../domain/usecases/get_events_usecase.dart';
import '../bloc/events_state.dart';

@injectable
class EventsCubit extends Cubit<EventsState> {
  final GetEventsUseCase getEventsUseCase;
  final GetEventsDetailUseCase getEventsDetailUseCase;
  final RegisterEventUseCase registerEventUseCase;

  EventsCubit({
    required this.registerEventUseCase,
    required this.getEventsUseCase,
    required this.getEventsDetailUseCase,
  }) : super(const EventsState.initial());

  Future<void> getEvents() async {
    emit(const EventsState.loading());

    final result = await getEventsUseCase(const EventsParams());
    result.fold(
      (failure) => emit(EventsState.error(message: failure.message)),
      (events) => emit(EventsState.loaded(events: events)),
    );
  }

  Future<void> refreshEvents() async {
    getEvents();
  }

  Future<void> getEventById(String id) async {
    emit(const EventsState.loading());
    final result =
        await getEventsDetailUseCase(GetEventsDetailParams(id: id));

    result.fold(
      (failure) => emit(EventsState.error(message: failure.message)),
      (eventDetails) => emit(EventsState.loadedDetails(eventDetails: eventDetails)),
    );
  }

  Future<void> registerForEvent(String eventId) async {
    emit(const EventsState.loading());
    final result =
        await registerEventUseCase(RegisterEventParams(id: eventId));
    result.fold(
      (failure) => emit(EventsState.error(message: failure.message)),
      (eventDetails) => emit(const EventsState.registeredSuccessfully(message: 'تم التسجيل بنجاح')),
    );
  }
}