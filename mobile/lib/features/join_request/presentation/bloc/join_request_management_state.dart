import 'package:freezed_annotation/freezed_annotation.dart';
import '../../domain/entities/join_request.dart';

part 'join_request_management_state.freezed.dart';

@freezed
class JoinRequestManagementState with _$JoinRequestManagementState {
  const factory JoinRequestManagementState.initial() = Initial;
  
  const factory JoinRequestManagementState.loading() = Loading;
  
  const factory JoinRequestManagementState.loaded({
    required List<JoinRequest> joinRequests,
    required int currentPage,
    required int totalPages,
    required int totalCount,
    String? selectedStatus,
  }) = Loaded;
  
  const factory JoinRequestManagementState.processing({
    required String requestId,
  }) = Processing;
  
  const factory JoinRequestManagementState.actionSuccess({
    required String message,
  }) = ActionSuccess;
  
  const factory JoinRequestManagementState.error({
    required String message,
  }) = Error;
}