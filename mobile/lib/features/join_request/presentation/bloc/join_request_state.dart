import 'package:freezed_annotation/freezed_annotation.dart';
import '../../domain/entities/join_request.dart';

part 'join_request_state.freezed.dart';

@freezed
class JoinRequestState with _$JoinRequestState {
  const factory JoinRequestState.initial() = Initial;
  
  const factory JoinRequestState.loading() = Loading;
  
  const factory JoinRequestState.success({
    required String message,
  }) = Success;
  
  const factory JoinRequestState.error({
    required String message,
  }) = Error;
}