import 'package:flutter_mediaCubit.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:injectable/injectable.dart';
import '../../data/models/position_model.dart';
import '../../data/repositories/positions_repository.dart';

part 'positions_state.dart';
part 'positions_cubit.freezed.dart';

@injectable
class PositionsCubit extends Cubit<PositionsState> {
  final PositionsRepository positionsRepository;

  PositionsCubit({required this.positionsRepository}) : super(const PositionsState.initial());

  Future<void> getPositions({String? governorate}) async {
    emit(const PositionsState.loading());
    final result = await positionsRepository.getPositions(governorate: governorate);
    result.fold(
      (failure) => emit(PositionsState.error(message: failure.message)),
      (positions) => emit(PositionsState.loaded(positions: positions)),
    );
  }

  Future<void> getPositionById(String id) async {
    emit(const PositionsState.loading());
    final result = await positionsRepository.getPositionById(id);
    result.fold(
      (failure) => emit(PositionsState.error(message: failure.message)),
      (position) => emit(PositionsState.positionDetails(position: position)),
    );
  }

  Future<void> createPosition(Map<String, dynamic> positionData) async {
    emit(const PositionsState.loading());
    final result = await positionsRepository.createPosition(positionData);
    result.fold(
      (failure) => emit(PositionsState.error(message: failure.message)),
      (position) => emit(PositionsState.positionCreated(position: position)),
    );
  }

  Future<void> updatePosition(String id, Map<String, dynamic> positionData) async {
    emit(const PositionsState.loading());
    final result = await positionsRepository.updatePosition(id, positionData);
    result.fold(
      (failure) => emit(PositionsState.error(message: failure.message)),
      (position) => emit(PositionsState.positionUpdated(position: position)),
    );
  }

  Future<void> deletePosition(String id) async {
    emit(const PositionsState.loading());
    final result = await positionsRepository.deletePosition(id);
    result.fold(
      (failure) => emit(PositionsState.error(message: failure.message)),
      (_) => emit(const PositionsState.positionDeleted()),
    );
  }

  Future<void> refreshPositions({String? governorate}) async {
    await getPositions(governorate: governorate);
  }
}