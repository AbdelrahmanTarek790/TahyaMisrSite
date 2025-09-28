part of 'auth_cubit.dart';

@freezed
class AuthState with _$AuthState {
  const factory AuthState.initial() = Initial;
  
  const factory AuthState.loading() = Loading;
  
  const factory AuthState.authenticated({
    required UserModel user,
    required String token,
  }) = Authenticated;
  
  const factory AuthState.unauthenticated() = Unauthenticated;
  
  const factory AuthState.error({
    required String message,
  }) = Error;
}