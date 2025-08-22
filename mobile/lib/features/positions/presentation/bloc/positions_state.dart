import 'package:equatable/equatable.dart';
import '../../data/models/position_model.dart';

abstract class PositionsState extends Equatable {
  const PositionsState();

  @override
  List<Object?> get props => [];
}

class PositionsInitial extends PositionsState {}

class PositionsLoading extends PositionsState {}

class PositionsLoaded extends PositionsState {
  final List<PositionModel> positions;

  const PositionsLoaded({required this.positions});

  @override
  List<Object?> get props => [positions];
}

class PositionCreated extends PositionsState {
  final PositionModel position;

  const PositionCreated({required this.position});

  @override
  List<Object?> get props => [position];
}

class PositionUpdated extends PositionsState {
  final PositionModel position;

  const PositionUpdated({required this.position});

  @override
  List<Object?> get props => [position];
}

class PositionDeleted extends PositionsState {
  final String positionId;

  const PositionDeleted({required this.positionId});

  @override
  List<Object?> get props => [positionId];
}

class PositionsError extends PositionsState {
  final String message;

  const PositionsError({required this.message});

  @override
  List<Object?> get props => [message];
}