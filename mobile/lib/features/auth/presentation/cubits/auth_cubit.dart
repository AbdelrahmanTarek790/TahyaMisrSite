import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:injectable/injectable.dart';

import '../../data/models/user_model.dart';
import '../../data/repositories/auth_repository.dart';

part 'auth_state.dart';
part 'auth_cubit.freezed.dart';

@injectable
class AuthCubit extends Cubit<AuthState> {
  final AuthRepository authRepository;

  AuthCubit({required this.authRepository}) : super(const AuthState.initial());

  Future<void> login({
    required String email,
    required String password,
  }) async {
    emit(const AuthState.loading());

    final result = await authRepository.login(email: email, password: password);

    if (result.isLeft()) {
      final failure = result.swap().getOrElse(() => throw Exception());
      emit(AuthState.error(message: failure.message));
      return;
    }

    final token = result.getOrElse(() => '');
    final userResult = await authRepository.getCurrentUser();

    if (userResult.isLeft()) {
      final failure = userResult.swap().getOrElse(() => throw Exception());
      emit(AuthState.error(message: failure.message));
      return;
    }

    final user = userResult.getOrElse(() => throw Exception());
    emit(AuthState.authenticated(user: user, token: token));
  }

  Future<void> register({
    required String name,
    required String email,
    required String password,
    required String phone,
    required String university,
    required String nationalId,
    required String governorate,
    required String membershipNumber,
  }) async {
    emit(const AuthState.loading());

    final result = await authRepository.register(
      name: name,
      email: email,
      password: password,
      phone: phone,
      university: university,
      nationalId: nationalId,
      governorate: governorate,
      membershipNumber: membershipNumber,
    );

    result.fold(
      (failure) => emit(AuthState.error(message: failure.message)),
      (user) {
        emit(const AuthState.unauthenticated());
      },
    );
  }

  Future<void> logout() async {
    emit(const AuthState.loading());

    final result = await authRepository.logout();
    result.fold(
      (failure) => emit(AuthState.error(message: failure.message)),
      (_) => emit(const AuthState.unauthenticated()),
    );
  }

  Future<void> checkAuthStatus() async {
    emit(const AuthState.loading());

    final isLoggedInResult = await authRepository.isLoggedIn();

    await isLoggedInResult.fold<Future<void>>(
      (failure) async {
        emit(const AuthState.unauthenticated());
      },
      (isLoggedIn) async {
        if (!isLoggedIn) {
          emit(const AuthState.unauthenticated());
          return;
        }

        final tokenResult = await authRepository.getStoredToken();

        await tokenResult.fold<Future<void>>(
          (failure) async {
            emit(const AuthState.unauthenticated());
          },
          (token) async {
            if (token == null) {
              emit(const AuthState.unauthenticated());
              return;
            }

            final userResult = await authRepository.getCurrentUser();

            await userResult.fold<Future<void>>(
              (failure) async {
                emit(const AuthState.unauthenticated());
              },
              (user) async {
                emit(AuthState.authenticated(user: user, token: token));
              },
            );
          },
        );
      },
    );
  }

  Future<void> getCurrentUser() async {
    final userResult = await authRepository.getCurrentUser();
    final tokenResult = await authRepository.getStoredToken();

    userResult.fold(
      (failure) => emit(AuthState.error(message: failure.message)),
      (user) {
        tokenResult.fold(
          (failure) => emit(AuthState.error(message: failure.message)),
          (token) {
            if (token != null) {
              emit(AuthState.authenticated(user: user, token: token));
            } else {
              emit(const AuthState.unauthenticated());
            }
          },
        );
      },
    );
  }

  Future<void> updateProfile(Map<String, dynamic> data) async {
    print('Updating profile with data: $data');
    emit(const AuthState.loading());

    final result = await authRepository.updateProfile(data);

    await result.fold(
      (failure) async {
        emit(AuthState.error(message: failure.message));
      },
      (user) async {
        final tokenResult = await authRepository.getStoredToken();
        tokenResult.fold(
          (failure) => emit(AuthState.error(message: failure.message)),
          (token) {
            if (token != null) {
              emit(AuthState.authenticated(user: user, token: token));
            } else {
              emit(const AuthState.unauthenticated());
            }
          },
        );
      },
    );
  }

  bool asGuest = false;

  void setAsGuest(bool value) {
    asGuest = value;
  }
}