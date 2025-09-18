import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/usecases/usecase.dart';
import '../../domain/usecases/login_usecase.dart';
import '../../domain/usecases/register_usecase.dart';
import '../../domain/usecases/logout_usecase.dart';
import '../../domain/usecases/update_profile_usecase.dart';
import '../../domain/repositories/auth_repository.dart';
import 'auth_event.dart';
import 'auth_state.dart';

@injectable
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final LoginUseCase loginUseCase;
  final RegisterUseCase registerUseCase;
  final LogoutUseCase logoutUseCase;
  final UpdateProfileUseCase updateProfileUseCase;
  final AuthRepository authRepository;

  AuthBloc({
    required this.loginUseCase,
    required this.registerUseCase,
    required this.logoutUseCase,
    required this.updateProfileUseCase,
    required this.authRepository,
  }) : super(const AuthState.initial()) {
    on<LoginRequested>(_onLoginRequested);
    on<RegisterRequested>(_onRegisterRequested);
    on<LogoutRequested>(_onLogoutRequested);
    on<CheckAuthStatus>(_onCheckAuthStatus);
    on<GetCurrentUser>(_onGetCurrentUser);
    on<UpdateProfile>(_onUpdateProfile);
  }

  Future<void> _onLoginRequested(
      LoginRequested event,
      Emitter<AuthState> emit,
      ) async
  {
    emit(const AuthState.loading());

    final result = await loginUseCase(
      LoginParams(email: event.email, password: event.password),
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


  Future<void> _onRegisterRequested(
    RegisterRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthState.loading());

    final result = await registerUseCase(
      RegisterParams(
        name: event.name,
        email: event.email,
        password: event.password,
        phone: event.phone,
        university: event.university,
        nationalId: event.nationalId,
        governorate: event.governorate,
        // position: event.position,
        membershipNumber: event.membershipNumber,
      ),
    );

    result.fold(
      (failure) => emit(AuthState.error(message: failure.message)),
      (user) {
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
      ) async
  {
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

  Future<void> _onUpdateProfile(
    UpdateProfile event,
    Emitter<AuthState> emit,
  ) async
  {
    emit(const AuthState.loading());

    final result = await updateProfileUseCase(
      UpdateProfileParams(data: event.data),
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

  bool asGuest  = false;

  void setAsGuest(bool value) {
    asGuest = value;
  }
}
