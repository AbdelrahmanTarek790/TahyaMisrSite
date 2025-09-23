part of 'user_management_cubit.dart';

@freezed
class UserManagementState with _$UserManagementState {
  const factory UserManagementState.initial() = _Initial;
  const factory UserManagementState.loading() = _Loading;
  const factory UserManagementState.loaded({
    required List<UserManagementModel> users,
  }) = _Loaded;
  const factory UserManagementState.error({
    required String message,
  }) = _Error;
}