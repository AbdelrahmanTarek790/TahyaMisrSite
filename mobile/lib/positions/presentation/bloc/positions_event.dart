import 'package:equatable/equatable.dart';

abstract class PositionsEvent extends Equatable {
  const PositionsEvent();

  @override
  List<Object?> get props => [];
}

class GetPositionsEvent extends PositionsEvent {
  final String? governorate;

  const GetPositionsEvent({this.governorate});

  @override
  List<Object?> get props => [governorate];
}

class GetPositionByIdEvent extends PositionsEvent {
  final String positionId;

  const GetPositionByIdEvent({required this.positionId});

  @override
  List<Object?> get props => [positionId];
}

class CreatePositionEvent extends PositionsEvent {
  final Map<String, dynamic> positionData;

  const CreatePositionEvent({required this.positionData});

  @override
  List<Object?> get props => [positionData];
}

class UpdatePositionEvent extends PositionsEvent {
  final String positionId;
  final Map<String, dynamic> positionData;

  const UpdatePositionEvent({
    required this.positionId,
    required this.positionData,
  });

  @override
  List<Object?> get props => [positionId, positionData];
}

class DeletePositionEvent extends PositionsEvent {
  final String positionId;

  const DeletePositionEvent({required this.positionId});

  @override
  List<Object?> get props => [positionId];
}