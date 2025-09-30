import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:injectable/injectable.dart';

import '../../data/models/join_request_model.dart';
import '../../data/models/join_request_response.dart';
import '../../data/models/join_request_action_request.dart';
import '../../data/repositories/join_request_repository.dart';

part 'join_request_state.dart';
part 'join_request_cubit.freezed.dart';

@injectable
class JoinRequestCubit extends Cubit<JoinRequestState> {
  final JoinRequestRepository repository;

  JoinRequestCubit({required this.repository}) : super(const JoinRequestState.initial());

  Future<void> createJoinRequest({
    required String name,
    required String email,
    required String phone,
    required String nationalId,
    required String governorate,
    required String role,
    String? position,
    String? membershipNumber,
    String? notes,
  }) async {
    emit(const JoinRequestState.loading());
    final result = await repository.createJoinRequest(
        name: name,
        email: email,
        phone: phone,
        nationalId: nationalId,
        governorate: governorate,
        role: role,
        position: position,
        membershipNumber: membershipNumber,
        notes: notes,
    );
    result.fold(
      (failure) => emit(JoinRequestState.error(message: failure.message)),
      (joinRequest) => emit(const JoinRequestState.created(),),
    );
  }

  Future<void> loadJoinRequests({
    int? page,
    int? limit,
    String? status,
  }) async {
    emit(const JoinRequestState.loading());

    final result = await repository.getJoinRequests(
      page: page,
      limit: limit,
      status: status,
    );

    result.fold(
      (failure) => emit(JoinRequestState.error(message: failure.message)),
      (response) => emit(JoinRequestState.loaded(
        joinRequests: response.joinRequests,
        pagination: response.pagination,
      )),
    );
  }

  Future<void> loadJoinRequestById(String id) async {
    emit(const JoinRequestState.loading());

    final result = await repository.getJoinRequestById(id);

    result.fold(
      (failure) => emit(JoinRequestState.error(message: failure.message)),
      (joinRequest) => emit(JoinRequestState.detailLoaded(joinRequest: joinRequest)),
    );
  }

  Future<void> approveJoinRequest(String id, String notes) async {
    emit(const JoinRequestState.processing());

    final request = JoinRequestActionRequest(
      notes: notes,
      university: 'غير محدد', // Default value as in web client
      membershipExpiry: DateTime.now().add(const Duration(days: 365)), // 1 year from now
    );

    final result = await repository.approveJoinRequest(id, request);

    result.fold(
      (failure) => emit(JoinRequestState.error(message: failure.message)),
      (joinRequest) => emit(const JoinRequestState.actionCompleted(
        action: 'approved',
      ),),
    );
  }

  Future<void> denyJoinRequest(String id, String notes) async {
    emit(const JoinRequestState.processing());

    final request = JoinRequestActionRequest(notes: notes);

    final result = await repository.denyJoinRequest(id, request);

    result.fold(
      (failure) => emit(JoinRequestState.error(message: failure.message)),
      (joinRequest) => emit(const JoinRequestState.actionCompleted(
        action: 'denied',
      ),),
    );
  }

  Future<void> deleteJoinRequest(String id) async {
    emit(const JoinRequestState.processing());

    final result = await repository.deleteJoinRequest(id);

    result.fold(
      (failure) => emit(JoinRequestState.error(message: failure.message)),
      (_) => emit(const JoinRequestState.deleted()),
    );
  }

  void resetState() {
    emit(const JoinRequestState.initial());
  }
}