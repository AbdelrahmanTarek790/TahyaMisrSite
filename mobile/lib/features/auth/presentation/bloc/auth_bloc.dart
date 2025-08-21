import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/usecases/usecase.dart';
import '../../domain/usecases/login_usecase.dart';
import '../../domain/usecases/register_usecase.dart';
import '../../domain/usecases/logout_usecase.dart';
import '../../domain/repositories/auth_repository.dart';
import 'auth_event.dart';
import 'auth_state.dart';

@injectable
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final LoginUseCase loginUseCase;
  final RegisterUseCase registerUseCase;
  final LogoutUseCase logoutUseCase;
  final AuthRepository authRepository;

  AuthBloc({
    required this.loginUseCase,
    required this.registerUseCase,
    required this.logoutUseCase,
    required this.authRepository,
  }) : super(const AuthState.initial()) {
    on<LoginRequested>(_onLoginRequested);
    on<RegisterRequested>(_onRegisterRequested);
    on<LogoutRequested>(_onLogoutRequested);
    on<CheckAuthStatus>(_onCheckAuthStatus);
    on<GetCurrentUser>(_onGetCurrentUser);
  }

  Future<void> _onLoginRequested(
    LoginRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthState.loading());

    final result = await loginUseCase(
      LoginParams(email: event.email, password: event.password),
    );

    result.fold(
      (failure) => emit(AuthState.error(message: failure.message)),
      (token) async {
        // Get user data after successful login
        final userResult = await authRepository.getCurrentUser();
        userResult.fold(
          (failure) => emit(AuthState.error(message: failure.message)),
          (user) => emit(AuthState.authenticated(user: user, token: token)),
        );
      },
    );
  }

  Future<void> _onRegisterRequested(
    RegisterRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthState.loading());

    final result = await registerUseCase(
      RegisterParams(
        email: event.email,
        password: event.password,
        name: event.name,
        role: event.role,
        governorate: event.governorate,
        phoneNumber: event.phoneNumber,
      ),
    );

    result.fold(
      (failure) => emit(AuthState.error(message: failure.message)),
      (user) {
        // After registration, user needs to login
        emit(const AuthState.unauthenticated());
      },
    );
  }

  Future<void> _onLogoutRequested(
    LogoutRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthState.loading());

    final result = await logoutUseCase(NoParams());

    result.fold(
      (failure) => emit(AuthState.error(message: failure.message)),
      (_) => emit(const AuthState.unauthenticated()),
    );
  }

  Future<void> _onCheckAuthStatus(
    CheckAuthStatus event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthState.loading());

    final isLoggedInResult = await authRepository.isLoggedIn();

    isLoggedInResult.fold(
      (failure) => emit(const AuthState.unauthenticated()),
      (isLoggedIn) async {
        if (isLoggedIn) {
          final tokenResult = await authRepository.getStoredToken();
          tokenResult.fold(
            (failure) => emit(const AuthState.unauthenticated()),
            (token) async {
              if (token != null) {
                final userResult = await authRepository.getCurrentUser();
                userResult.fold(
                  (failure) => emit(const AuthState.unauthenticated()),
                  (user) =>
                      emit(AuthState.authenticated(user: user, token: token)),
                );
              } else {
                emit(const AuthState.unauthenticated());
              }
            },
          );
        } else {
          emit(const AuthState.unauthenticated());
        }
      },
    );
  }

  Future<void> _onGetCurrentUser(
    GetCurrentUser event,
    Emitter<AuthState> emit,
  ) async {
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
}
