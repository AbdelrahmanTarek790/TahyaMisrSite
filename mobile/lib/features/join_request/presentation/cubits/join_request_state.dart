part of 'join_request_cubit.dart';

@freezed
class JoinRequestState with _$JoinRequestState {
  const factory JoinRequestState.initial() = Initial;
  
  const factory JoinRequestState.loading() = Loading;
  
  const factory JoinRequestState.processing() = Processing;
  
  const factory JoinRequestState.created() = Created;
  
  const factory JoinRequestState.loaded({
    required List<JoinRequestModel> joinRequests,
    required Pagination pagination,
  }) = Loaded;
  
  const factory JoinRequestState.detailLoaded({
    required JoinRequestModel joinRequest,
  }) = DetailLoaded;
  
  const factory JoinRequestState.actionCompleted({
    required String action,
  }) = ActionCompleted;
  
  const factory JoinRequestState.deleted() = Deleted;
  
  const factory JoinRequestState.error({
    required String message,
  }) = Error;
}