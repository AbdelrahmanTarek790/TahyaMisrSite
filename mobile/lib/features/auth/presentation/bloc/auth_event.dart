import 'package:equatable/equatable.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

import '../../domain/entities/user.dart';

part 'auth_event.freezed.dart';

@freezed
class AuthEvent with _$AuthEvent {
  const factory AuthEvent.loginRequested({
    required String email,
    required String password,
  }) = LoginRequested;

  const factory AuthEvent.registerRequested({
    required String name,
    required String email,
    required String password,
    required String phone,
    required String university,
    required String nationalId,
    required String governorate,
    // required String position,
    required String membershipNumber,
  }) = RegisterRequested;

  const factory AuthEvent.logoutRequested() = LogoutRequested;

  const factory AuthEvent.checkAuthStatus() = CheckAuthStatus;

  const factory AuthEvent.getCurrentUser() = GetCurrentUser;

  const factory AuthEvent.updateProfile({
    required Map<String, dynamic> data,
  }) = UpdateProfile;
}