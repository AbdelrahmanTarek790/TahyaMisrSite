import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:injectable/injectable.dart';
import '../../data/models/position_model.dart';
import '../../data/repositories/positions_repository.dart';

part 'positions_state.dart';

@injectable
class PositionsCubit extends Cubit<PositionsState> {
  final PositionsRepository positionsRepository;

  PositionsCubit({required this.positionsRepository})
      : super(PositionsInitial());

  Future<void> getPositions({
    String? name,
    bool? isActive,
    bool? isGlobal,
  }) async {
    print(name);
    print(isActive);
    print(isGlobal);
    emit(PositionsLoading());
    final result = await positionsRepository.getPositions(
      name: name,
      isActive: isActive,
      isGlobal: isGlobal,
    );
    result.fold(
      (failure) => emit(PositionsError(message: failure.message)),
      (positions) => emit(PositionsLoaded(positions: positions)),
    );
  }

  Future<void> getPositionById(String id) async {
    emit(PositionsLoading());
    final result = await positionsRepository.getPositionById(id);
    result.fold(
      (failure) => emit(PositionsError(message: failure.message)),
      (position) => emit(PositionDetails(position: position)),
    );
  }

  Future<void> createPosition(Map<String, dynamic> positionData) async {
    emit(PositionsLoading());
    final result = await positionsRepository.createPosition(positionData);
    result.fold(
      (failure) => emit(PositionsError(message: failure.message)),
      (position) => emit(PositionCreated(position: position)),
    );
  }

  Future<void> updatePosition(
      String id, Map<String, dynamic> positionData) async {
    emit(PositionsLoading());
    final result = await positionsRepository.updatePosition(id, positionData);
    result.fold(
      (failure) => emit(PositionsError(message: failure.message)),
      (position) => emit(PositionUpdated(position: position)),
    );
  }

  Future<void> deletePosition(String id) async {
    emit(PositionsLoading());
    final result = await positionsRepository.deletePosition(id);
    result.fold(
      (failure) => emit(PositionsError(message: failure.message)),
      (_) => emit(PositionDeleted()),
    );
  }

  Future<void> refreshPositions({
    String? name,
    bool? isActive,
    bool? isGlobal,
  }) async {
    await getPositions(
      name: name,
      isActive: isActive,
      isGlobal: isGlobal,
    );
  }
}
