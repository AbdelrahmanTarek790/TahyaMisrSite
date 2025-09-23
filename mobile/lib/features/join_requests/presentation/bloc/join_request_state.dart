import 'package:freezed_annotation/freezed_annotation.dart';
import '../../domain/entities/join_request.dart';

part 'join_request_state.freezed.dart';

@freezed
class JoinRequestState with _$JoinRequestState {
  const factory JoinRequestState.initial() = Initial;
  
  const factory JoinRequestState.loading() = Loading;
  
  const factory JoinRequestState.joinRequestsLoaded({
    required List<JoinRequest> joinRequests,
    required int currentPage,
    required bool hasMore,
  }) = JoinRequestsLoaded;
  
  const factory JoinRequestState.joinRequestLoaded({
    required JoinRequest joinRequest,
  }) = JoinRequestLoaded;
  
  const factory JoinRequestState.actionCompleted({
    required String message,
  }) = ActionCompleted;
  
  const factory JoinRequestState.error({
    required String message,
  }) = Error;
}