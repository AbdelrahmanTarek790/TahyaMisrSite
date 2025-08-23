import 'package:equatable/equatable.dart';
import '../../../auth/data/models/user_model.dart';

abstract class UserManagementState extends Equatable {
  const UserManagementState();

  @override
  List<Object?> get props => [];
}

class UserManagementInitial extends UserManagementState {}

class UserManagementLoading extends UserManagementState {}

class UsersLoaded extends UserManagementState {
  final List<UserModel> users;
  final int totalUsers;
  final int currentPage;
  final int totalPages;

  const UsersLoaded({
    required this.users,
    required this.totalUsers,
    required this.currentPage,
    required this.totalPages,
  });

  @override
  List<Object?> get props => [users, totalUsers, currentPage, totalPages];
}

class UserCreated extends UserManagementState {
  final UserModel user;

  const UserCreated({required this.user});

  @override
  List<Object?> get props => [user];
}

class UserUpdated extends UserManagementState {
  final UserModel user;

  const UserUpdated({required this.user});

  @override
  List<Object?> get props => [user];
}

class UserDeleted extends UserManagementState {
  final String userId;

  const UserDeleted({required this.userId});

  @override
  List<Object?> get props => [userId];
}

class UserManagementError extends UserManagementState {
  final String message;

  const UserManagementError({required this.message});

  @override
  List<Object?> get props => [message];
}