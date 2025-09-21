import 'package:flutter_bloc/flutter_bloc.dart';
import '../../data/models/join_request_submission.dart';
import '../../domain/usecases/create_join_request.dart';
import 'join_request_state.dart';

class JoinRequestCubit extends Cubit<JoinRequestState> {
  final CreateJoinRequest createJoinRequestUseCase;

  JoinRequestCubit({
    required this.createJoinRequestUseCase,
  }) : super(const JoinRequestState.initial());

  Future<void> submitJoinRequest({
    required String name,
    required String email,
    required String phone,
    required String nationalID,
    required String governorate,
    String? position,
    String? membershipNumber,
    required String role,
    String? notes,
  }) async {
    emit(const JoinRequestState.loading());

    final request = JoinRequestSubmission(
      name: name,
      email: email,
      phone: phone,
      nationalID: nationalID,
      governorate: governorate,
      position: position,
      membershipNumber: membershipNumber,
      role: role,
      notes: notes,
    );

    final result = await createJoinRequestUseCase(
      CreateJoinRequestParams(request: request),
    );

    result.fold(
      (failure) => emit(JoinRequestState.error(message: failure.message)),
      (joinRequest) => emit(const JoinRequestState.success(
        message: 'تم إرسال طلب الانضمام بنجاح',
      )),
    );
  }

  void reset() {
    emit(const JoinRequestState.initial());
  }
}