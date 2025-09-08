import 'package:equatable/equatable.dart';

abstract class UserManagementEvent extends Equatable {
  const UserManagementEvent();

  @override
  List<Object?> get props => [];
}

class GetUsersEvent extends UserManagementEvent {
  final int page;
  final int limit;
  final String? search;
  final String? role;

  const GetUsersEvent({
    this.page = 1,
    this.limit = 10,
    this.search,
    this.role,
  });

  @override
  List<Object?> get props => [page, limit, search, role];
}

class GetUserByIdEvent extends UserManagementEvent {
  final String userId;

  const GetUserByIdEvent({required this.userId});

  @override
  List<Object?> get props => [userId];
}

class CreateUserEvent extends UserManagementEvent {
  final Map<String, dynamic> userData;

  const CreateUserEvent({required this.userData});

  @override
  List<Object?> get props => [userData];
}

class UpdateUserEvent extends UserManagementEvent {
  final String userId;
  final Map<String, dynamic> userData;

  const UpdateUserEvent({
    required this.userId,
    required this.userData,
  });

  @override
  List<Object?> get props => [userId, userData];
}

class DeleteUserEvent extends UserManagementEvent {
  final String userId;

  const DeleteUserEvent({required this.userId});

  @override
  List<Object?> get props => [userId];
}