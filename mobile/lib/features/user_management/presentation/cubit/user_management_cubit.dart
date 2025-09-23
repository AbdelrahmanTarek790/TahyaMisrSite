import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../domain/usecases/get_users.dart';
import '../../domain/usecases/get_user_by_id.dart';
import '../../domain/usecases/create_user.dart';
import '../../domain/usecases/update_user.dart';
import '../../domain/usecases/delete_user.dart';
import '../bloc/user_management_state.dart';

@injectable
class UserManagementCubit extends Cubit<UserManagementState> {
  final GetUsers getUsers;
  final GetUserById getUserById;
  final CreateUser createUser;
  final UpdateUser updateUser;
  final DeleteUser deleteUser;

  UserManagementCubit({
    required this.getUsers,
    required this.getUserById,
    required this.createUser,
    required this.updateUser,
    required this.deleteUser,
  }) : super(UserManagementInitial());

  Future<void> getUsers({
    int page = 1,
    int limit = 10,
    String? search,
    String? role,
  }) async {
    try {
      emit(UserManagementLoading());
      
      final result = await getUsers(GetUsersParams(
        page: page,
        limit: limit,
        search: search,
        role: role,
      ));

      result.fold(
        (failure) => emit(UserManagementError(message: failure.message)),
        (response) => emit(UsersLoaded(
          users: response.users,
          totalUsers: response.total,
          currentPage: response.currentPage,
          totalPages: response.totalPages,
        )),
      );
    } catch (e) {
      emit(UserManagementError(message: 'خطأ في جلب البيانات: ${e.toString()}'));
    }
  }

  Future<void> getUserById(String userId) async {
    try {
      emit(UserManagementLoading());
      
      final result = await getUserById(GetUserByIdParams(userId: userId));

      result.fold(
        (failure) => emit(UserManagementError(message: failure.message)),
        (user) => emit(UserLoaded(user: user)),
      );
    } catch (e) {
      emit(UserManagementError(message: 'خطأ في جلب بيانات المستخدم: ${e.toString()}'));
    }
  }

  Future<void> createUser(Map<String, dynamic> userData) async {
    try {
      emit(UserManagementLoading());
      
      final result = await createUser(CreateUserParams(userData: userData));

      result.fold(
        (failure) => emit(UserManagementError(message: failure.message)),
        (user) {
          emit(UserCreated(message: 'تم إنشاء المستخدم بنجاح'));
          // Refresh the users list
          getUsers();
        },
      );
    } catch (e) {
      emit(UserManagementError(message: 'خطأ في إنشاء المستخدم: ${e.toString()}'));
    }
  }

  Future<void> updateUser(String userId, Map<String, dynamic> userData) async {
    try {
      emit(UserManagementLoading());
      
      final result = await updateUser(UpdateUserParams(
        userId: userId,
        userData: userData,
      ));

      result.fold(
        (failure) => emit(UserManagementError(message: failure.message)),
        (user) {
          emit(UserUpdated(message: 'تم تحديث المستخدم بنجاح'));
          // Refresh the users list
          getUsers();
        },
      );
    } catch (e) {
      emit(UserManagementError(message: 'خطأ في تحديث المستخدم: ${e.toString()}'));
    }
  }

  Future<void> deleteUser(String userId) async {
    try {
      emit(UserManagementLoading());
      
      final result = await deleteUser(DeleteUserParams(userId: userId));

      result.fold(
        (failure) => emit(UserManagementError(message: failure.message)),
        (_) {
          emit(UserDeleted(message: 'تم حذف المستخدم بنجاح'));
          // Refresh the users list
          getUsers();
        },
      );
    } catch (e) {
      emit(UserManagementError(message: 'خطأ في حذف المستخدم: ${e.toString()}'));
    }
  }
}