import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/usecases/get_users.dart';
import '../../domain/usecases/get_user_by_id.dart';
import '../../domain/usecases/create_user.dart';
import '../../domain/usecases/update_user.dart';
import '../../domain/usecases/delete_user.dart';
import 'user_management_event.dart';
import 'user_management_state.dart';

class UserManagementBloc extends Bloc<UserManagementEvent, UserManagementState> {
  final GetUsers getUsers;
  final GetUserById getUserById;
  final CreateUser createUser;
  final UpdateUser updateUser;
  final DeleteUser deleteUser;

  UserManagementBloc({
    required this.getUsers,
    required this.getUserById,
    required this.createUser,
    required this.updateUser,
    required this.deleteUser,
  }) : super(UserManagementInitial()) {
    on<GetUsersEvent>(_onGetUsers);
    on<GetUserByIdEvent>(_onGetUserById);
    on<CreateUserEvent>(_onCreateUser);
    on<UpdateUserEvent>(_onUpdateUser);
    on<DeleteUserEvent>(_onDeleteUser);
  }

  Future<void> _onGetUsers(
    GetUsersEvent event,
    Emitter<UserManagementState> emit,
  ) async {
    try {
      emit(UserManagementLoading());
      
      final result = await getUsers(GetUsersParams(
        page: event.page,
        limit: event.limit,
        search: event.search,
        role: event.role,
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
      emit(UserManagementError(message: 'Unexpected error occurred: ${e.toString()}'));
    }
  }

  Future<void> _onGetUserById(
    GetUserByIdEvent event,
    Emitter<UserManagementState> emit,
  ) async {
    try {
      emit(UserManagementLoading());
      
      final result = await getUserById(GetUserByIdParams(userId: event.userId));

      result.fold(
        (failure) => emit(UserManagementError(message: failure.message)),
        (user) => emit(UserUpdated(user: user)),
      );
    } catch (e) {
      emit(UserManagementError(message: 'Unexpected error occurred: ${e.toString()}'));
    }
  }

  Future<void> _onCreateUser(
    CreateUserEvent event,
    Emitter<UserManagementState> emit,
  ) async {
    try {
      emit(UserManagementLoading());
      
      final result = await createUser(CreateUserParams(userData: event.userData));

      result.fold(
        (failure) => emit(UserManagementError(message: failure.message)),
        (user) => emit(UserCreated(user: user)),
      );
    } catch (e) {
      emit(UserManagementError(message: 'Unexpected error occurred: ${e.toString()}'));
    }
  }

  Future<void> _onUpdateUser(
    UpdateUserEvent event,
    Emitter<UserManagementState> emit,
  ) async {
    try {
      emit(UserManagementLoading());
      
      final result = await updateUser(UpdateUserParams(
        userId: event.userId,
        userData: event.userData,
      ));

      result.fold(
        (failure) => emit(UserManagementError(message: failure.message)),
        (user) => emit(UserUpdated(user: user)),
      );
    } catch (e) {
      emit(UserManagementError(message: 'Unexpected error occurred: ${e.toString()}'));
    }
  }

  Future<void> _onDeleteUser(
    DeleteUserEvent event,
    Emitter<UserManagementState> emit,
  ) async {
    try {
      emit(UserManagementLoading());
      
      final result = await deleteUser(DeleteUserParams(userId: event.userId));

      result.fold(
        (failure) => emit(UserManagementError(message: failure.message)),
        (success) => emit(UserDeleted(userId: event.userId)),
      );
    } catch (e) {
      emit(UserManagementError(message: 'Unexpected error occurred: ${e.toString()}'));
    }
  }
}