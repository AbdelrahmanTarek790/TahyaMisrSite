/*
part of 'positions_cubit.dart';

@freezed
class PositionsState with _$PositionsState {
  const factory PositionsState.initial() = _Initial;
  const factory PositionsState.loading() = _Loading;
  const factory PositionsState.loaded({
    required List<PositionModel> positions,
  }) = _Loaded;
  const factory PositionsState.positionDetails({
    required PositionModel position,
  }) = _PositionDetails;
  const factory PositionsState.positionCreated({
    required PositionModel position,
  }) = _PositionCreated;
  const factory PositionsState.positionUpdated({
    required PositionModel position,
  }) = _PositionUpdated;
  const factory PositionsState.positionDeleted() = _PositionDeleted;
  const factory PositionsState.error({
    required String message,
  }) = _Error;

}*/
part of 'positions_cubit.dart';

@immutable
sealed class PositionsState {}

final class  PositionsInitial extends PositionsState {}

final class  PositionsLoading extends PositionsState {}

final class  PositionsLoaded extends PositionsState {
  final List<PositionModel> positions;

  PositionsLoaded({required this.positions});
}

final class  PositionDetails extends PositionsState {
  final PositionModel position;

  PositionDetails({required this.position});
}

final class  PositionCreated extends PositionsState {
  final PositionModel position;

  PositionCreated({required this.position});
}

final class  PositionUpdated extends PositionsState {
  final PositionModel position;

  PositionUpdated({required this.position});
}

final class  PositionDeleted extends PositionsState {}

final class  PositionsError extends PositionsState {
  final String message;

  PositionsError({required this.message});
}

