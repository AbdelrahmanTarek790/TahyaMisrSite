import 'package:freezed_annotation/freezed_annotation.dart';
import '../../data/models/create_join_request.dart';
import '../../data/models/join_request_action.dart';

part 'join_request_event.freezed.dart';

@freezed
class JoinRequestEvent with _$JoinRequestEvent {
  const factory JoinRequestEvent.createJoinRequest({
    required CreateJoinRequest request,
  }) = CreateJoinRequestEvent;

  const factory JoinRequestEvent.getJoinRequests({
    required int page,
    required int limit,
    String? status,
  }) = GetJoinRequestsEvent;

  const factory JoinRequestEvent.getJoinRequestById({
    required String id,
  }) = GetJoinRequestByIdEvent;

  const factory JoinRequestEvent.approveJoinRequest({
    required String id,
    required JoinRequestAction action,
  }) = ApproveJoinRequestEvent;

  const factory JoinRequestEvent.denyJoinRequest({
    required String id,
    required JoinRequestAction action,
  }) = DenyJoinRequestEvent;

  const factory JoinRequestEvent.deleteJoinRequest({
    required String id,
  }) = DeleteJoinRequestEvent;

  const factory JoinRequestEvent.resetState() = ResetStateEvent;
}