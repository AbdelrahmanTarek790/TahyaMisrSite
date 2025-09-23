import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/usecases/usecase.dart';
import '../../domain/usecases/login_usecase.dart';
import '../../domain/usecases/register_usecase.dart';
import '../../domain/usecases/logout_usecase.dart';
import '../../domain/usecases/update_profile_usecase.dart';
import '../../domain/repositories/auth_repository.dart';
import '../bloc/auth_state.dart';

@injectable
class AuthCubit extends Cubit<AuthState> {
  final LoginUseCase loginUseCase;
  final RegisterUseCase registerUseCase;
  final LogoutUseCase logoutUseCase;
  final UpdateProfileUseCase updateProfileUseCase;
  final AuthRepository authRepository;

  AuthCubit({
    required this.loginUseCase,
    required this.registerUseCase,
    required this.logoutUseCase,
    required this.updateProfileUseCase,
    required this.authRepository,
  }) : super(const AuthState.initial());

  Future<void> login({
    required String email,
    required String password,
  }) async {
    emit(const AuthState.loading());

    final result = await loginUseCase(
      LoginParams(email: email, password: password),
    );

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
    String membershipNumber = '',
  }) async {
    emit(const AuthState.loading());

    final result = await registerUseCase(
      RegisterParams(
        name: name,
        email: email,
        password: password,
        phone: phone,
        university: university,
        nationalId: nationalId,
        governorate: governorate,
        membershipNumber: membershipNumber,
      ),
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

    final result = await logoutUseCase(NoParams());
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
    emit(const AuthState.loading());

    final result = await updateProfileUseCase(
      UpdateProfileParams(data: data),
    );

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