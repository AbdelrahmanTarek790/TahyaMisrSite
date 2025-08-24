import 'package:flutter_bloc/flutter_bloc.dart';
import '../../data/models/position_model.dart';
import '../../domain/usecases/get_positions_usecase.dart';
import '../../domain/usecases/create_position_usecase.dart';
import '../../domain/usecases/update_position_usecase.dart';
import '../../domain/usecases/delete_position_usecase.dart';
import 'positions_event.dart';
import 'positions_state.dart';

class PositionsBloc extends Bloc<PositionsEvent, PositionsState> {
  final GetPositionsUseCase getPositionsUseCase;
  final CreatePositionUseCase createPositionUseCase;
  final UpdatePositionUseCase updatePositionUseCase;
  final DeletePositionUseCase deletePositionUseCase;

  PositionsBloc({
    required this.getPositionsUseCase,
    required this.createPositionUseCase,
    required this.updatePositionUseCase,
    required this.deletePositionUseCase,
  }) : super(PositionsInitial()) {
    on<GetPositionsEvent>(_onGetPositions);
    on<CreatePositionEvent>(_onCreatePosition);
    on<UpdatePositionEvent>(_onUpdatePosition);
    on<DeletePositionEvent>(_onDeletePosition);
  }

  Future<void> _onGetPositions(
    GetPositionsEvent event,
    Emitter<PositionsState> emit,
  ) async {
    try {
      emit(PositionsLoading());
      
      final result = await getPositionsUseCase(GetPositionsParams(
        governorate: event.governorate,
      ),);

      result.fold(
        (failure) => emit(PositionsError(message: failure.message)),
        (positions) {
          // Convert entities to models
          final positionModels = positions.map((position) {
            if (position is PositionModel) {
              return position;
            } else {
              // Convert Position entity to PositionModel
              return PositionModel(
                id: position.id,
                name: position.name,
                description: position.description,
                isActive: position.isActive,
                isGlobal: position.isGlobal,
                governorate: position.governorate,
                createdBy: position.createdBy,
                createdAt: position.createdAt,
                updatedAt: position.updatedAt,
              );
            }
          }).toList();
          emit(PositionsLoaded(positions: positionModels));
        },
      );
    } catch (e) {
      emit(PositionsError(message: 'Unexpected error occurred: ${e.toString()}'));
    }
  }

  Future<void> _onCreatePosition(
    CreatePositionEvent event,
    Emitter<PositionsState> emit,
  ) async {
    try {
      emit(PositionsLoading());
      
      final result = await createPositionUseCase(CreatePositionParams(
        positionData: event.positionData,
      ),);

      result.fold(
        (failure) => emit(PositionsError(message: failure.message)),
        (position) {
          // Convert entity to model if needed
          final positionModel = position is PositionModel 
              ? position 
              : PositionModel(
                  id: position.id,
                  name: position.name,
                  description: position.description,
                  isActive: position.isActive,
                  isGlobal: position.isGlobal,
                  governorate: position.governorate,
                  createdBy: position.createdBy,
                  createdAt: position.createdAt,
                  updatedAt: position.updatedAt,
                );
          emit(PositionCreated(position: positionModel));
        },
      );
    } catch (e) {
      emit(PositionsError(message: 'Unexpected error occurred: ${e.toString()}'));
    }
  }

  Future<void> _onUpdatePosition(
    UpdatePositionEvent event,
    Emitter<PositionsState> emit,
  ) async {
    try {
      emit(PositionsLoading());
      
      final result = await updatePositionUseCase(UpdatePositionParams(
        id: event.positionId,
        positionData: event.positionData,
      ),);

      result.fold(
        (failure) => emit(PositionsError(message: failure.message)),
        (position) {
          // Convert entity to model if needed
          final positionModel = position is PositionModel 
              ? position 
              : PositionModel(
                  id: position.id,
                  name: position.name,
                  description: position.description,
                  isActive: position.isActive,
                  isGlobal: position.isGlobal,
                  governorate: position.governorate,
                  createdBy: position.createdBy,
                  createdAt: position.createdAt,
                  updatedAt: position.updatedAt,
                );
          emit(PositionUpdated(position: positionModel));
        },
      );
    } catch (e) {
      emit(PositionsError(message: 'Unexpected error occurred: ${e.toString()}'));
    }
  }

  Future<void> _onDeletePosition(
    DeletePositionEvent event,
    Emitter<PositionsState> emit,
  ) async {
    try {
      emit(PositionsLoading());
      
      final result = await deletePositionUseCase(DeletePositionParams(
        id: event.positionId,
      ),);

      result.fold(
        (failure) => emit(PositionsError(message: failure.message)),
        (success) => emit(PositionDeleted(positionId: event.positionId)),
      );
    } catch (e) {
      emit(PositionsError(message: 'Unexpected error occurred: ${e.toString()}'));
    }
  }
}