import 'package:flutter_bloc/flutter_bloc.dart';
import '../../data/models/join_request_action.dart';
import '../../data/models/join_request_model.dart';
import '../../domain/usecases/get_join_requests.dart';
import '../../domain/usecases/approve_join_request.dart';
import '../../domain/usecases/deny_join_request.dart';
import 'join_request_management_state.dart';

class JoinRequestManagementCubit extends Cubit<JoinRequestManagementState> {
  final GetJoinRequests getJoinRequestsUseCase;
  final ApproveJoinRequest approveJoinRequestUseCase;
  final DenyJoinRequest denyJoinRequestUseCase;

  JoinRequestManagementCubit({
    required this.getJoinRequestsUseCase,
    required this.approveJoinRequestUseCase,
    required this.denyJoinRequestUseCase,
  }) : super(const JoinRequestManagementState.initial());

  Future<void> loadJoinRequests({
    int page = 1,
    int limit = 10,
    String? status,
  }) async {
    emit(const JoinRequestManagementState.loading());

    final result = await getJoinRequestsUseCase(
      GetJoinRequestsParams(
        page: page,
        limit: limit,
        status: status,
      ),
    );

    result.fold(
      (failure) => emit(JoinRequestManagementState.error(message: failure.message)),
      (data) {
        final joinRequestsData = data['joinRequests'] as List<dynamic>;
        final paginationData = data['pagination'] as Map<String, dynamic>;
        
        final joinRequests = joinRequestsData
            .map((json) => JoinRequestModel.fromJson(json))
            .toList();

        emit(JoinRequestManagementState.loaded(
          joinRequests: joinRequests,
          currentPage: paginationData['current'] ?? 1,
          totalPages: paginationData['total'] ?? 1,
          totalCount: paginationData['totalCount'] ?? 0,
          selectedStatus: status,
        ));
      },
    );
  }

  Future<void> approveRequest({
    required String requestId,
    required String notes,
    String? university,
    String? membershipExpiry,
  }) async {
    emit(JoinRequestManagementState.processing(requestId: requestId));

    final action = JoinRequestAction(
      notes: notes,
      university: university,
      membershipExpiry: membershipExpiry,
    );

    final result = await approveJoinRequestUseCase(
      ApproveJoinRequestParams(id: requestId, action: action),
    );

    result.fold(
      (failure) => emit(JoinRequestManagementState.error(message: failure.message)),
      (joinRequest) {
        emit(const JoinRequestManagementState.actionSuccess(
          message: 'تم الموافقة على الطلب بنجاح',
        ));
        // Reload the list after successful action
        _reloadCurrentPage();
      },
    );
  }

  Future<void> denyRequest({
    required String requestId,
    required String notes,
  }) async {
    emit(JoinRequestManagementState.processing(requestId: requestId));

    final action = JoinRequestAction(notes: notes);

    final result = await denyJoinRequestUseCase(
      DenyJoinRequestParams(id: requestId, action: action),
    );

    result.fold(
      (failure) => emit(JoinRequestManagementState.error(message: failure.message)),
      (joinRequest) {
        emit(const JoinRequestManagementState.actionSuccess(
          message: 'تم رفض الطلب بنجاح',
        ));
        // Reload the list after successful action
        _reloadCurrentPage();
      },
    );
  }

  void _reloadCurrentPage() {
    state.maybeWhen(
      loaded: (joinRequests, currentPage, totalPages, totalCount, selectedStatus) {
        loadJoinRequests(
          page: currentPage,
          status: selectedStatus,
        );
      },
      orElse: () {
        loadJoinRequests();
      },
    );
  }

  void filterByStatus(String? status) {
    loadJoinRequests(status: status);
  }

  void loadNextPage() {
    state.maybeWhen(
      loaded: (joinRequests, currentPage, totalPages, totalCount, selectedStatus) {
        if (currentPage < totalPages) {
          loadJoinRequests(
            page: currentPage + 1,
            status: selectedStatus,
          );
        }
      },
      orElse: () {},
    );
  }

  void loadPreviousPage() {
    state.maybeWhen(
      loaded: (joinRequests, currentPage, totalPages, totalCount, selectedStatus) {
        if (currentPage > 1) {
          loadJoinRequests(
            page: currentPage - 1,
            status: selectedStatus,
          );
        }
      },
      orElse: () {},
    );
  }
}