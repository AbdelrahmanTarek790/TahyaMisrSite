import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';

import '../../data/models/timeline_model.dart';
import '../../data/repositories/timeline_repository.dart';

part 'timeline_state.dart';

class TimelineCubit extends Cubit<TimelineState> {
  final TimelineRepository timelineRepository;

  TimelineCubit({required this.timelineRepository})
      : super(TimelineInitial());

  Future<void> getTimeline({int page = 1, int limit = 100}) async {
    emit(TimelineLoading());

    final result = await timelineRepository.getTimeline(page: page, limit: limit);

    result.fold(
      (failure) => emit(TimelineError(message: failure.message)),
      (timeline) => emit(TimelineLoaded(timeline: timeline)),
    );
  }

  Future<void> refreshTimeline() async {
    await getTimeline();
  }

  Future<void> getTimelineById(String id) async {
    emit(TimelineLoading());

    final result = await timelineRepository.getTimelineById(id);

    result.fold(
      (failure) => emit(TimelineError(message: failure.message)),
      (timelineDetails) =>
          emit(TimelineLoadedDetails(timelineDetails: timelineDetails)),
    );
  }
}
