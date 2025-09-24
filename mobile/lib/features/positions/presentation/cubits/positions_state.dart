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
}