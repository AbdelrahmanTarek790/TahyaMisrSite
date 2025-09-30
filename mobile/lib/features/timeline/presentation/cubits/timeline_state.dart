part of 'timeline_cubit.dart';

abstract class TimelineState extends Equatable {
  const TimelineState();

  @override
  List<Object?> get props => [];
}

class TimelineInitial extends TimelineState {}

class TimelineLoading extends TimelineState {}

class TimelineLoaded extends TimelineState {
  final List<TimelineModel> timeline;

  const TimelineLoaded({required this.timeline});

  @override
  List<Object?> get props => [timeline];
}

class TimelineError extends TimelineState {
  final String message;

  const TimelineError({required this.message});

  @override
  List<Object?> get props => [message];
}

class TimelineLoadedDetails extends TimelineState {
  final TimelineModel timelineDetails;

  const TimelineLoadedDetails({required this.timelineDetails});

  @override
  List<Object?> get props => [timelineDetails];
}
