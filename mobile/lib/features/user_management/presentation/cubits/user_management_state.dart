/*
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
}*/
part of 'user_management_cubit.dart';

@immutable
sealed class UserManagementState {}

final class  UserManagementInitial extends UserManagementState {}

final class UserManagementLoading extends UserManagementState {}

final class UserManagementLoaded extends UserManagementState {
  final List<UserManagementModel> users;
  final int currentPage;
  final int totalPages;
  UserManagementLoaded({required this.users, required this.currentPage, required this.totalPages});
}

final class UserManagementError extends UserManagementState {
  final String message;

  UserManagementError({required this.message});
}

final class UserCreated extends UserManagementState {
  final UserManagementModel user;

  UserCreated({required this.user});
}

final class UserUpdated extends UserManagementState {
  final UserManagementModel user;

  UserUpdated({required this.user});
}

final class UserDeleted extends UserManagementState {
  final String userId;

  UserDeleted({required this.userId});
}
