// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'auth_event.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

/// @nodoc
mixin _$AuthEvent {
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function(String email, String password) loginRequested,
    required TResult Function(String email, String password, String name,
            String role, String? governorate, String? phoneNumber)
        registerRequested,
    required TResult Function() logoutRequested,
    required TResult Function() checkAuthStatus,
    required TResult Function() getCurrentUser,
    required TResult Function(Map<String, dynamic> data) updateProfile,
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function(String email, String password)? loginRequested,
    TResult? Function(String email, String password, String name, String role,
            String? governorate, String? phoneNumber)?
        registerRequested,
    TResult? Function()? logoutRequested,
    TResult? Function()? checkAuthStatus,
    TResult? Function()? getCurrentUser,
    TResult? Function(Map<String, dynamic> data)? updateProfile,
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function(String email, String password)? loginRequested,
    TResult Function(String email, String password, String name, String role,
            String? governorate, String? phoneNumber)?
        registerRequested,
    TResult Function()? logoutRequested,
    TResult Function()? checkAuthStatus,
    TResult Function()? getCurrentUser,
    TResult Function(Map<String, dynamic> data)? updateProfile,
    required TResult orElse(),
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(LoginRequested value) loginRequested,
    required TResult Function(RegisterRequested value) registerRequested,
    required TResult Function(LogoutRequested value) logoutRequested,
    required TResult Function(CheckAuthStatus value) checkAuthStatus,
    required TResult Function(GetCurrentUser value) getCurrentUser,
    required TResult Function(UpdateProfile value) updateProfile,
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(LoginRequested value)? loginRequested,
    TResult? Function(RegisterRequested value)? registerRequested,
    TResult? Function(LogoutRequested value)? logoutRequested,
    TResult? Function(CheckAuthStatus value)? checkAuthStatus,
    TResult? Function(GetCurrentUser value)? getCurrentUser,
    TResult? Function(UpdateProfile value)? updateProfile,
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(LoginRequested value)? loginRequested,
    TResult Function(RegisterRequested value)? registerRequested,
    TResult Function(LogoutRequested value)? logoutRequested,
    TResult Function(CheckAuthStatus value)? checkAuthStatus,
    TResult Function(GetCurrentUser value)? getCurrentUser,
    TResult Function(UpdateProfile value)? updateProfile,
    required TResult orElse(),
  }) =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $AuthEventCopyWith<$Res> {
  factory $AuthEventCopyWith(AuthEvent value, $Res Function(AuthEvent) then) =
      _$AuthEventCopyWithImpl<$Res, AuthEvent>;
}

/// @nodoc
class _$AuthEventCopyWithImpl<$Res, $Val extends AuthEvent>
    implements $AuthEventCopyWith<$Res> {
  _$AuthEventCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;
}

/// @nodoc
abstract class _$$LoginRequestedImplCopyWith<$Res> {
  factory _$$LoginRequestedImplCopyWith(_$LoginRequestedImpl value,
          $Res Function(_$LoginRequestedImpl) then) =
      __$$LoginRequestedImplCopyWithImpl<$Res>;
  @useResult
  $Res call({String email, String password});
}

/// @nodoc
class __$$LoginRequestedImplCopyWithImpl<$Res>
    extends _$AuthEventCopyWithImpl<$Res, _$LoginRequestedImpl>
    implements _$$LoginRequestedImplCopyWith<$Res> {
  __$$LoginRequestedImplCopyWithImpl(
      _$LoginRequestedImpl _value, $Res Function(_$LoginRequestedImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? email = null,
    Object? password = null,
  }) {
    return _then(_$LoginRequestedImpl(
      email: null == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String,
      password: null == password
          ? _value.password
          : password // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc

class _$LoginRequestedImpl implements LoginRequested {
  const _$LoginRequestedImpl({required this.email, required this.password});

  @override
  final String email;
  @override
  final String password;

  @override
  String toString() {
    return 'AuthEvent.loginRequested(email: $email, password: $password)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$LoginRequestedImpl &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.password, password) ||
                other.password == password));
  }

  @override
  int get hashCode => Object.hash(runtimeType, email, password);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$LoginRequestedImplCopyWith<_$LoginRequestedImpl> get copyWith =>
      __$$LoginRequestedImplCopyWithImpl<_$LoginRequestedImpl>(
          this, _$identity);

  @override
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function(String email, String password) loginRequested,
    required TResult Function(String email, String password, String name,
            String role, String? governorate, String? phoneNumber)
        registerRequested,
    required TResult Function() logoutRequested,
    required TResult Function() checkAuthStatus,
    required TResult Function() getCurrentUser,
    required TResult Function(Map<String, dynamic> data) updateProfile,
  }) {
    return loginRequested(email, password);
  }

  @override
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function(String email, String password)? loginRequested,
    TResult? Function(String email, String password, String name, String role,
            String? governorate, String? phoneNumber)?
        registerRequested,
    TResult? Function()? logoutRequested,
    TResult? Function()? checkAuthStatus,
    TResult? Function()? getCurrentUser,
    TResult? Function(Map<String, dynamic> data)? updateProfile,
  }) {
    return loginRequested?.call(email, password);
  }

  @override
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function(String email, String password)? loginRequested,
    TResult Function(String email, String password, String name, String role,
            String? governorate, String? phoneNumber)?
        registerRequested,
    TResult Function()? logoutRequested,
    TResult Function()? checkAuthStatus,
    TResult Function()? getCurrentUser,
    TResult Function(Map<String, dynamic> data)? updateProfile,
    required TResult orElse(),
  }) {
    if (loginRequested != null) {
      return loginRequested(email, password);
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(LoginRequested value) loginRequested,
    required TResult Function(RegisterRequested value) registerRequested,
    required TResult Function(LogoutRequested value) logoutRequested,
    required TResult Function(CheckAuthStatus value) checkAuthStatus,
    required TResult Function(GetCurrentUser value) getCurrentUser,
    required TResult Function(UpdateProfile value) updateProfile,
  }) {
    return loginRequested(this);
  }

  @override
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(LoginRequested value)? loginRequested,
    TResult? Function(RegisterRequested value)? registerRequested,
    TResult? Function(LogoutRequested value)? logoutRequested,
    TResult? Function(CheckAuthStatus value)? checkAuthStatus,
    TResult? Function(GetCurrentUser value)? getCurrentUser,
    TResult? Function(UpdateProfile value)? updateProfile,
  }) {
    return loginRequested?.call(this);
  }

  @override
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(LoginRequested value)? loginRequested,
    TResult Function(RegisterRequested value)? registerRequested,
    TResult Function(LogoutRequested value)? logoutRequested,
    TResult Function(CheckAuthStatus value)? checkAuthStatus,
    TResult Function(GetCurrentUser value)? getCurrentUser,
    TResult Function(UpdateProfile value)? updateProfile,
    required TResult orElse(),
  }) {
    if (loginRequested != null) {
      return loginRequested(this);
    }
    return orElse();
  }
}

abstract class LoginRequested implements AuthEvent {
  const factory LoginRequested(
      {required final String email,
      required final String password}) = _$LoginRequestedImpl;

  String get email;
  String get password;
  @JsonKey(ignore: true)
  _$$LoginRequestedImplCopyWith<_$LoginRequestedImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class _$$RegisterRequestedImplCopyWith<$Res> {
  factory _$$RegisterRequestedImplCopyWith(_$RegisterRequestedImpl value,
          $Res Function(_$RegisterRequestedImpl) then) =
      __$$RegisterRequestedImplCopyWithImpl<$Res>;
  @useResult
  $Res call(
      {String email,
      String password,
      String name,
      String role,
      String? governorate,
      String? phoneNumber});
}

/// @nodoc
class __$$RegisterRequestedImplCopyWithImpl<$Res>
    extends _$AuthEventCopyWithImpl<$Res, _$RegisterRequestedImpl>
    implements _$$RegisterRequestedImplCopyWith<$Res> {
  __$$RegisterRequestedImplCopyWithImpl(_$RegisterRequestedImpl _value,
      $Res Function(_$RegisterRequestedImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? email = null,
    Object? password = null,
    Object? name = null,
    Object? role = null,
    Object? governorate = freezed,
    Object? phoneNumber = freezed,
  }) {
    return _then(_$RegisterRequestedImpl(
      email: null == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String,
      password: null == password
          ? _value.password
          : password // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      role: null == role
          ? _value.role
          : role // ignore: cast_nullable_to_non_nullable
              as String,
      governorate: freezed == governorate
          ? _value.governorate
          : governorate // ignore: cast_nullable_to_non_nullable
              as String?,
      phoneNumber: freezed == phoneNumber
          ? _value.phoneNumber
          : phoneNumber // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc

class _$RegisterRequestedImpl implements RegisterRequested {
  const _$RegisterRequestedImpl(
      {required this.email,
      required this.password,
      required this.name,
      required this.role,
      this.governorate,
      this.phoneNumber});

  @override
  final String email;
  @override
  final String password;
  @override
  final String name;
  @override
  final String role;
  @override
  final String? governorate;
  @override
  final String? phoneNumber;

  @override
  String toString() {
    return 'AuthEvent.registerRequested(email: $email, password: $password, name: $name, role: $role, governorate: $governorate, phoneNumber: $phoneNumber)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$RegisterRequestedImpl &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.password, password) ||
                other.password == password) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.role, role) || other.role == role) &&
            (identical(other.governorate, governorate) ||
                other.governorate == governorate) &&
            (identical(other.phoneNumber, phoneNumber) ||
                other.phoneNumber == phoneNumber));
  }

  @override
  int get hashCode => Object.hash(
      runtimeType, email, password, name, role, governorate, phoneNumber);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$RegisterRequestedImplCopyWith<_$RegisterRequestedImpl> get copyWith =>
      __$$RegisterRequestedImplCopyWithImpl<_$RegisterRequestedImpl>(
          this, _$identity);

  @override
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function(String email, String password) loginRequested,
    required TResult Function(String email, String password, String name,
            String role, String? governorate, String? phoneNumber)
        registerRequested,
    required TResult Function() logoutRequested,
    required TResult Function() checkAuthStatus,
    required TResult Function() getCurrentUser,
    required TResult Function(Map<String, dynamic> data) updateProfile,
  }) {
    return registerRequested(
        email, password, name, role, governorate, phoneNumber);
  }

  @override
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function(String email, String password)? loginRequested,
    TResult? Function(String email, String password, String name, String role,
            String? governorate, String? phoneNumber)?
        registerRequested,
    TResult? Function()? logoutRequested,
    TResult? Function()? checkAuthStatus,
    TResult? Function()? getCurrentUser,
    TResult? Function(Map<String, dynamic> data)? updateProfile,
  }) {
    return registerRequested?.call(
        email, password, name, role, governorate, phoneNumber);
  }

  @override
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function(String email, String password)? loginRequested,
    TResult Function(String email, String password, String name, String role,
            String? governorate, String? phoneNumber)?
        registerRequested,
    TResult Function()? logoutRequested,
    TResult Function()? checkAuthStatus,
    TResult Function()? getCurrentUser,
    TResult Function(Map<String, dynamic> data)? updateProfile,
    required TResult orElse(),
  }) {
    if (registerRequested != null) {
      return registerRequested(
          email, password, name, role, governorate, phoneNumber);
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(LoginRequested value) loginRequested,
    required TResult Function(RegisterRequested value) registerRequested,
    required TResult Function(LogoutRequested value) logoutRequested,
    required TResult Function(CheckAuthStatus value) checkAuthStatus,
    required TResult Function(GetCurrentUser value) getCurrentUser,
    required TResult Function(UpdateProfile value) updateProfile,
  }) {
    return registerRequested(this);
  }

  @override
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(LoginRequested value)? loginRequested,
    TResult? Function(RegisterRequested value)? registerRequested,
    TResult? Function(LogoutRequested value)? logoutRequested,
    TResult? Function(CheckAuthStatus value)? checkAuthStatus,
    TResult? Function(GetCurrentUser value)? getCurrentUser,
    TResult? Function(UpdateProfile value)? updateProfile,
  }) {
    return registerRequested?.call(this);
  }

  @override
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(LoginRequested value)? loginRequested,
    TResult Function(RegisterRequested value)? registerRequested,
    TResult Function(LogoutRequested value)? logoutRequested,
    TResult Function(CheckAuthStatus value)? checkAuthStatus,
    TResult Function(GetCurrentUser value)? getCurrentUser,
    TResult Function(UpdateProfile value)? updateProfile,
    required TResult orElse(),
  }) {
    if (registerRequested != null) {
      return registerRequested(this);
    }
    return orElse();
  }
}

abstract class RegisterRequested implements AuthEvent {
  const factory RegisterRequested(
      {required final String email,
      required final String password,
      required final String name,
      required final String role,
      final String? governorate,
      final String? phoneNumber}) = _$RegisterRequestedImpl;

  String get email;
  String get password;
  String get name;
  String get role;
  String? get governorate;
  String? get phoneNumber;
  @JsonKey(ignore: true)
  _$$RegisterRequestedImplCopyWith<_$RegisterRequestedImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class _$$LogoutRequestedImplCopyWith<$Res> {
  factory _$$LogoutRequestedImplCopyWith(_$LogoutRequestedImpl value,
          $Res Function(_$LogoutRequestedImpl) then) =
      __$$LogoutRequestedImplCopyWithImpl<$Res>;
}

/// @nodoc
class __$$LogoutRequestedImplCopyWithImpl<$Res>
    extends _$AuthEventCopyWithImpl<$Res, _$LogoutRequestedImpl>
    implements _$$LogoutRequestedImplCopyWith<$Res> {
  __$$LogoutRequestedImplCopyWithImpl(
      _$LogoutRequestedImpl _value, $Res Function(_$LogoutRequestedImpl) _then)
      : super(_value, _then);
}

/// @nodoc

class _$LogoutRequestedImpl implements LogoutRequested {
  const _$LogoutRequestedImpl();

  @override
  String toString() {
    return 'AuthEvent.logoutRequested()';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType && other is _$LogoutRequestedImpl);
  }

  @override
  int get hashCode => runtimeType.hashCode;

  @override
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function(String email, String password) loginRequested,
    required TResult Function(String email, String password, String name,
            String role, String? governorate, String? phoneNumber)
        registerRequested,
    required TResult Function() logoutRequested,
    required TResult Function() checkAuthStatus,
    required TResult Function() getCurrentUser,
    required TResult Function(Map<String, dynamic> data) updateProfile,
  }) {
    return logoutRequested();
  }

  @override
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function(String email, String password)? loginRequested,
    TResult? Function(String email, String password, String name, String role,
            String? governorate, String? phoneNumber)?
        registerRequested,
    TResult? Function()? logoutRequested,
    TResult? Function()? checkAuthStatus,
    TResult? Function()? getCurrentUser,
    TResult? Function(Map<String, dynamic> data)? updateProfile,
  }) {
    return logoutRequested?.call();
  }

  @override
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function(String email, String password)? loginRequested,
    TResult Function(String email, String password, String name, String role,
            String? governorate, String? phoneNumber)?
        registerRequested,
    TResult Function()? logoutRequested,
    TResult Function()? checkAuthStatus,
    TResult Function()? getCurrentUser,
    TResult Function(Map<String, dynamic> data)? updateProfile,
    required TResult orElse(),
  }) {
    if (logoutRequested != null) {
      return logoutRequested();
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(LoginRequested value) loginRequested,
    required TResult Function(RegisterRequested value) registerRequested,
    required TResult Function(LogoutRequested value) logoutRequested,
    required TResult Function(CheckAuthStatus value) checkAuthStatus,
    required TResult Function(GetCurrentUser value) getCurrentUser,
    required TResult Function(UpdateProfile value) updateProfile,
  }) {
    return logoutRequested(this);
  }

  @override
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(LoginRequested value)? loginRequested,
    TResult? Function(RegisterRequested value)? registerRequested,
    TResult? Function(LogoutRequested value)? logoutRequested,
    TResult? Function(CheckAuthStatus value)? checkAuthStatus,
    TResult? Function(GetCurrentUser value)? getCurrentUser,
    TResult? Function(UpdateProfile value)? updateProfile,
  }) {
    return logoutRequested?.call(this);
  }

  @override
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(LoginRequested value)? loginRequested,
    TResult Function(RegisterRequested value)? registerRequested,
    TResult Function(LogoutRequested value)? logoutRequested,
    TResult Function(CheckAuthStatus value)? checkAuthStatus,
    TResult Function(GetCurrentUser value)? getCurrentUser,
    TResult Function(UpdateProfile value)? updateProfile,
    required TResult orElse(),
  }) {
    if (logoutRequested != null) {
      return logoutRequested(this);
    }
    return orElse();
  }
}

abstract class LogoutRequested implements AuthEvent {
  const factory LogoutRequested() = _$LogoutRequestedImpl;
}

/// @nodoc
abstract class _$$CheckAuthStatusImplCopyWith<$Res> {
  factory _$$CheckAuthStatusImplCopyWith(_$CheckAuthStatusImpl value,
          $Res Function(_$CheckAuthStatusImpl) then) =
      __$$CheckAuthStatusImplCopyWithImpl<$Res>;
}

/// @nodoc
class __$$CheckAuthStatusImplCopyWithImpl<$Res>
    extends _$AuthEventCopyWithImpl<$Res, _$CheckAuthStatusImpl>
    implements _$$CheckAuthStatusImplCopyWith<$Res> {
  __$$CheckAuthStatusImplCopyWithImpl(
      _$CheckAuthStatusImpl _value, $Res Function(_$CheckAuthStatusImpl) _then)
      : super(_value, _then);
}

/// @nodoc

class _$CheckAuthStatusImpl implements CheckAuthStatus {
  const _$CheckAuthStatusImpl();

  @override
  String toString() {
    return 'AuthEvent.checkAuthStatus()';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType && other is _$CheckAuthStatusImpl);
  }

  @override
  int get hashCode => runtimeType.hashCode;

  @override
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function(String email, String password) loginRequested,
    required TResult Function(String email, String password, String name,
            String role, String? governorate, String? phoneNumber)
        registerRequested,
    required TResult Function() logoutRequested,
    required TResult Function() checkAuthStatus,
    required TResult Function() getCurrentUser,
    required TResult Function(Map<String, dynamic> data) updateProfile,
  }) {
    return checkAuthStatus();
  }

  @override
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function(String email, String password)? loginRequested,
    TResult? Function(String email, String password, String name, String role,
            String? governorate, String? phoneNumber)?
        registerRequested,
    TResult? Function()? logoutRequested,
    TResult? Function()? checkAuthStatus,
    TResult? Function()? getCurrentUser,
    TResult? Function(Map<String, dynamic> data)? updateProfile,
  }) {
    return checkAuthStatus?.call();
  }

  @override
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function(String email, String password)? loginRequested,
    TResult Function(String email, String password, String name, String role,
            String? governorate, String? phoneNumber)?
        registerRequested,
    TResult Function()? logoutRequested,
    TResult Function()? checkAuthStatus,
    TResult Function()? getCurrentUser,
    TResult Function(Map<String, dynamic> data)? updateProfile,
    required TResult orElse(),
  }) {
    if (checkAuthStatus != null) {
      return checkAuthStatus();
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(LoginRequested value) loginRequested,
    required TResult Function(RegisterRequested value) registerRequested,
    required TResult Function(LogoutRequested value) logoutRequested,
    required TResult Function(CheckAuthStatus value) checkAuthStatus,
    required TResult Function(GetCurrentUser value) getCurrentUser,
    required TResult Function(UpdateProfile value) updateProfile,
  }) {
    return checkAuthStatus(this);
  }

  @override
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(LoginRequested value)? loginRequested,
    TResult? Function(RegisterRequested value)? registerRequested,
    TResult? Function(LogoutRequested value)? logoutRequested,
    TResult? Function(CheckAuthStatus value)? checkAuthStatus,
    TResult? Function(GetCurrentUser value)? getCurrentUser,
    TResult? Function(UpdateProfile value)? updateProfile,
  }) {
    return checkAuthStatus?.call(this);
  }

  @override
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(LoginRequested value)? loginRequested,
    TResult Function(RegisterRequested value)? registerRequested,
    TResult Function(LogoutRequested value)? logoutRequested,
    TResult Function(CheckAuthStatus value)? checkAuthStatus,
    TResult Function(GetCurrentUser value)? getCurrentUser,
    TResult Function(UpdateProfile value)? updateProfile,
    required TResult orElse(),
  }) {
    if (checkAuthStatus != null) {
      return checkAuthStatus(this);
    }
    return orElse();
  }
}

abstract class CheckAuthStatus implements AuthEvent {
  const factory CheckAuthStatus() = _$CheckAuthStatusImpl;
}

/// @nodoc
abstract class _$$GetCurrentUserImplCopyWith<$Res> {
  factory _$$GetCurrentUserImplCopyWith(_$GetCurrentUserImpl value,
          $Res Function(_$GetCurrentUserImpl) then) =
      __$$GetCurrentUserImplCopyWithImpl<$Res>;
}

/// @nodoc
class __$$GetCurrentUserImplCopyWithImpl<$Res>
    extends _$AuthEventCopyWithImpl<$Res, _$GetCurrentUserImpl>
    implements _$$GetCurrentUserImplCopyWith<$Res> {
  __$$GetCurrentUserImplCopyWithImpl(
      _$GetCurrentUserImpl _value, $Res Function(_$GetCurrentUserImpl) _then)
      : super(_value, _then);
}

/// @nodoc

class _$GetCurrentUserImpl implements GetCurrentUser {
  const _$GetCurrentUserImpl();

  @override
  String toString() {
    return 'AuthEvent.getCurrentUser()';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType && other is _$GetCurrentUserImpl);
  }

  @override
  int get hashCode => runtimeType.hashCode;

  @override
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function(String email, String password) loginRequested,
    required TResult Function(String email, String password, String name,
            String role, String? governorate, String? phoneNumber)
        registerRequested,
    required TResult Function() logoutRequested,
    required TResult Function() checkAuthStatus,
    required TResult Function() getCurrentUser,
    required TResult Function(Map<String, dynamic> data) updateProfile,
  }) {
    return getCurrentUser();
  }

  @override
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function(String email, String password)? loginRequested,
    TResult? Function(String email, String password, String name, String role,
            String? governorate, String? phoneNumber)?
        registerRequested,
    TResult? Function()? logoutRequested,
    TResult? Function()? checkAuthStatus,
    TResult? Function()? getCurrentUser,
    TResult? Function(Map<String, dynamic> data)? updateProfile,
  }) {
    return getCurrentUser?.call();
  }

  @override
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function(String email, String password)? loginRequested,
    TResult Function(String email, String password, String name, String role,
            String? governorate, String? phoneNumber)?
        registerRequested,
    TResult Function()? logoutRequested,
    TResult Function()? checkAuthStatus,
    TResult Function()? getCurrentUser,
    TResult Function(Map<String, dynamic> data)? updateProfile,
    required TResult orElse(),
  }) {
    if (getCurrentUser != null) {
      return getCurrentUser();
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(LoginRequested value) loginRequested,
    required TResult Function(RegisterRequested value) registerRequested,
    required TResult Function(LogoutRequested value) logoutRequested,
    required TResult Function(CheckAuthStatus value) checkAuthStatus,
    required TResult Function(GetCurrentUser value) getCurrentUser,
    required TResult Function(UpdateProfile value) updateProfile,
  }) {
    return getCurrentUser(this);
  }

  @override
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(LoginRequested value)? loginRequested,
    TResult? Function(RegisterRequested value)? registerRequested,
    TResult? Function(LogoutRequested value)? logoutRequested,
    TResult? Function(CheckAuthStatus value)? checkAuthStatus,
    TResult? Function(GetCurrentUser value)? getCurrentUser,
    TResult? Function(UpdateProfile value)? updateProfile,
  }) {
    return getCurrentUser?.call(this);
  }

  @override
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(LoginRequested value)? loginRequested,
    TResult Function(RegisterRequested value)? registerRequested,
    TResult Function(LogoutRequested value)? logoutRequested,
    TResult Function(CheckAuthStatus value)? checkAuthStatus,
    TResult Function(GetCurrentUser value)? getCurrentUser,
    TResult Function(UpdateProfile value)? updateProfile,
    required TResult orElse(),
  }) {
    if (getCurrentUser != null) {
      return getCurrentUser(this);
    }
    return orElse();
  }
}

abstract class GetCurrentUser implements AuthEvent {
  const factory GetCurrentUser() = _$GetCurrentUserImpl;
}

/// @nodoc
abstract class _$$UpdateProfileImplCopyWith<$Res> {
  factory _$$UpdateProfileImplCopyWith(
          _$UpdateProfileImpl value, $Res Function(_$UpdateProfileImpl) then) =
      __$$UpdateProfileImplCopyWithImpl<$Res>;
  @useResult
  $Res call({Map<String, dynamic> data});
}

/// @nodoc
class __$$UpdateProfileImplCopyWithImpl<$Res>
    extends _$AuthEventCopyWithImpl<$Res, _$UpdateProfileImpl>
    implements _$$UpdateProfileImplCopyWith<$Res> {
  __$$UpdateProfileImplCopyWithImpl(
      _$UpdateProfileImpl _value, $Res Function(_$UpdateProfileImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? data = null,
  }) {
    return _then(_$UpdateProfileImpl(
      data: null == data
          ? _value._data
          : data // ignore: cast_nullable_to_non_nullable
              as Map<String, dynamic>,
    ));
  }
}

/// @nodoc

class _$UpdateProfileImpl implements UpdateProfile {
  const _$UpdateProfileImpl({required final Map<String, dynamic> data})
      : _data = data;

  final Map<String, dynamic> _data;
  @override
  Map<String, dynamic> get data {
    if (_data is EqualUnmodifiableMapView) return _data;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableMapView(_data);
  }

  @override
  String toString() {
    return 'AuthEvent.updateProfile(data: $data)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$UpdateProfileImpl &&
            const DeepCollectionEquality().equals(other._data, _data));
  }

  @override
  int get hashCode =>
      Object.hash(runtimeType, const DeepCollectionEquality().hash(_data));

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$UpdateProfileImplCopyWith<_$UpdateProfileImpl> get copyWith =>
      __$$UpdateProfileImplCopyWithImpl<_$UpdateProfileImpl>(this, _$identity);

  @override
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function(String email, String password) loginRequested,
    required TResult Function(String email, String password, String name,
            String role, String? governorate, String? phoneNumber)
        registerRequested,
    required TResult Function() logoutRequested,
    required TResult Function() checkAuthStatus,
    required TResult Function() getCurrentUser,
    required TResult Function(Map<String, dynamic> data) updateProfile,
  }) {
    return updateProfile(data);
  }

  @override
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function(String email, String password)? loginRequested,
    TResult? Function(String email, String password, String name, String role,
            String? governorate, String? phoneNumber)?
        registerRequested,
    TResult? Function()? logoutRequested,
    TResult? Function()? checkAuthStatus,
    TResult? Function()? getCurrentUser,
    TResult? Function(Map<String, dynamic> data)? updateProfile,
  }) {
    return updateProfile?.call(data);
  }

  @override
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function(String email, String password)? loginRequested,
    TResult Function(String email, String password, String name, String role,
            String? governorate, String? phoneNumber)?
        registerRequested,
    TResult Function()? logoutRequested,
    TResult Function()? checkAuthStatus,
    TResult Function()? getCurrentUser,
    TResult Function(Map<String, dynamic> data)? updateProfile,
    required TResult orElse(),
  }) {
    if (updateProfile != null) {
      return updateProfile(data);
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(LoginRequested value) loginRequested,
    required TResult Function(RegisterRequested value) registerRequested,
    required TResult Function(LogoutRequested value) logoutRequested,
    required TResult Function(CheckAuthStatus value) checkAuthStatus,
    required TResult Function(GetCurrentUser value) getCurrentUser,
    required TResult Function(UpdateProfile value) updateProfile,
  }) {
    return updateProfile(this);
  }

  @override
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(LoginRequested value)? loginRequested,
    TResult? Function(RegisterRequested value)? registerRequested,
    TResult? Function(LogoutRequested value)? logoutRequested,
    TResult? Function(CheckAuthStatus value)? checkAuthStatus,
    TResult? Function(GetCurrentUser value)? getCurrentUser,
    TResult? Function(UpdateProfile value)? updateProfile,
  }) {
    return updateProfile?.call(this);
  }

  @override
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(LoginRequested value)? loginRequested,
    TResult Function(RegisterRequested value)? registerRequested,
    TResult Function(LogoutRequested value)? logoutRequested,
    TResult Function(CheckAuthStatus value)? checkAuthStatus,
    TResult Function(GetCurrentUser value)? getCurrentUser,
    TResult Function(UpdateProfile value)? updateProfile,
    required TResult orElse(),
  }) {
    if (updateProfile != null) {
      return updateProfile(this);
    }
    return orElse();
  }
}

abstract class UpdateProfile implements AuthEvent {
  const factory UpdateProfile({required final Map<String, dynamic> data}) =
      _$UpdateProfileImpl;

  Map<String, dynamic> get data;
  @JsonKey(ignore: true)
  _$$UpdateProfileImplCopyWith<_$UpdateProfileImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
