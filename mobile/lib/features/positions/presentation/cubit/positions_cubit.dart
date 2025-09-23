import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../domain/usecases/get_positions_usecase.dart';
import '../../domain/usecases/create_position_usecase.dart';
import '../../domain/usecases/update_position_usecase.dart';
import '../../domain/usecases/delete_position_usecase.dart';
import '../bloc/positions_state.dart';
import '../../data/models/position_model.dart';

@injectable
class PositionsCubit extends Cubit<PositionsState> {
  final GetPositionsUseCase getPositionsUseCase;
  final CreatePositionUseCase createPositionUseCase;
  final UpdatePositionUseCase updatePositionUseCase;
  final DeletePositionUseCase deletePositionUseCase;

  PositionsCubit({
    required this.getPositionsUseCase,
    required this.createPositionUseCase,
    required this.updatePositionUseCase,
    required this.deletePositionUseCase,
  }) : super(PositionsInitial());

  Future<void> getPositions({String? governorate}) async {
    try {
      emit(PositionsLoading());
      
      final result = await getPositionsUseCase(GetPositionsParams(
        governorate: governorate,
      ));

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
      emit(PositionsError(message: 'خطأ في جلب البيانات: ${e.toString()}'));
    }
  }

  Future<void> createPosition(Map<String, dynamic> positionData) async {
    try {
      emit(PositionsLoading());
      
      final result = await createPositionUseCase(CreatePositionParams(
        positionData: positionData,
      ));

      result.fold(
        (failure) => emit(PositionsError(message: failure.message)),
        (position) {
          emit(PositionCreated(message: 'تم إنشاء المنصب بنجاح'));
          // Refresh the list
          getPositions();
        },
      );
    } catch (e) {
      emit(PositionsError(message: 'خطأ في إنشاء المنصب: ${e.toString()}'));
    }
  }

  Future<void> updatePosition(String positionId, Map<String, dynamic> positionData) async {
    try {
      emit(PositionsLoading());
      
      final result = await updatePositionUseCase(UpdatePositionParams(
        positionId: positionId,
        positionData: positionData,
      ));

      result.fold(
        (failure) => emit(PositionsError(message: failure.message)),
        (position) {
          emit(PositionUpdated(message: 'تم تحديث المنصب بنجاح'));
          // Refresh the list
          getPositions();
        },
      );
    } catch (e) {
      emit(PositionsError(message: 'خطأ في تحديث المنصب: ${e.toString()}'));
    }
  }

  Future<void> deletePosition(String positionId) async {
    try {
      emit(PositionsLoading());
      
      final result = await deletePositionUseCase(DeletePositionParams(
        positionId: positionId,
      ));

      result.fold(
        (failure) => emit(PositionsError(message: failure.message)),
        (_) {
          emit(PositionDeleted(message: 'تم حذف المنصب بنجاح'));
          // Refresh the list
          getPositions();
        },
      );
    } catch (e) {
      emit(PositionsError(message: 'خطأ في حذف المنصب: ${e.toString()}'));
    }
  }
}