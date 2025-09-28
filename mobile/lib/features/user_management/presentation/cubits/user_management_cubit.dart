import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:injectable/injectable.dart';
import '../../data/models/user_management_model.dart';
import '../../data/repositories/user_management_repository.dart';

part 'user_management_state.dart';


@injectable
class UserManagementCubit extends Cubit<UserManagementState> {
  UserManagementCubit(this.userManagementRepository)
      : super(UserManagementInitial());
  final UserManagementRepository userManagementRepository;

  Future<void> fetchUsers({
    required int page,
    required int limit,
    String? search,
    String? role,
  }) async {
    emit(UserManagementLoading());
    final result = await userManagementRepository.getUsers(
      page: page,
      limit: limit,
      search: search,
      role: role,
    );
    result.fold(
      (failure) => emit(UserManagementError(
        message: failure.message,
      ),),
      (users) => emit(
        UserManagementLoaded(
          users: users,
          currentPage: page,
          totalPages: (users.length / limit).ceil(),
        ),
      ),
    );
  }

  Future<void> fetchUserById(String id) async {
    emit(UserManagementLoading());
    final result = await userManagementRepository.getUserById(id);
    result.fold(
      (failure) => emit(UserManagementError(message: failure.message)),
      (user) => emit(UserCreated(user: user)),
    );
  }

  Future<void> createUser(Map<String, dynamic> userData) async {
    emit(UserManagementLoading());
    final result = await userManagementRepository.createUser(userData);
    result.fold(
      (failure) => emit(UserManagementError(message: failure.message)),
      (user) => emit(UserCreated(user: user)),
    );
  }

  Future<void> updateUser(String id, Map<String, dynamic> userData) async {
    print('update user in cubit');
    emit(UserManagementLoading());
    final result = await userManagementRepository.updateUser(id, userData);
    result.fold(
      (failure) {
        print('failure in cubit: ${failure.message}');
        emit(UserManagementError(message: failure.message));
      },
      (user) => emit(UserUpdated(user: user)),
    );
  }

  Future<void> deleteUser(String id) async {
    emit(UserManagementLoading());
    final result = await userManagementRepository.deleteUser(id);
    result.fold(
      (failure) => emit(UserManagementError(message: failure.message)),
      (_) => emit(UserDeleted(userId: id)),
    );
  }
}
