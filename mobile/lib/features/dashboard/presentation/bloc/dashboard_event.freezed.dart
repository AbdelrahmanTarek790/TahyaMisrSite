// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'dashboard_event.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#custom-getters-and-methods');

/// @nodoc
mixin _$DashboardEvent {
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function() getDashboardStats,
    required TResult Function(int page, int limit) getRecentActivity,
    required TResult Function() refreshDashboard,
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function()? getDashboardStats,
    TResult? Function(int page, int limit)? getRecentActivity,
    TResult? Function()? refreshDashboard,
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function()? getDashboardStats,
    TResult Function(int page, int limit)? getRecentActivity,
    TResult Function()? refreshDashboard,
    required TResult orElse(),
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(GetDashboardStats value) getDashboardStats,
    required TResult Function(GetRecentActivity value) getRecentActivity,
    required TResult Function(RefreshDashboard value) refreshDashboard,
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(GetDashboardStats value)? getDashboardStats,
    TResult? Function(GetRecentActivity value)? getRecentActivity,
    TResult? Function(RefreshDashboard value)? refreshDashboard,
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(GetDashboardStats value)? getDashboardStats,
    TResult Function(GetRecentActivity value)? getRecentActivity,
    TResult Function(RefreshDashboard value)? refreshDashboard,
    required TResult orElse(),
  }) =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $DashboardEventCopyWith<$Res> {
  factory $DashboardEventCopyWith(
          DashboardEvent value, $Res Function(DashboardEvent) then) =
      _$DashboardEventCopyWithImpl<$Res, DashboardEvent>;
}

/// @nodoc
class _$DashboardEventCopyWithImpl<$Res, $Val extends DashboardEvent>
    implements $DashboardEventCopyWith<$Res> {
  _$DashboardEventCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;
}

/// @nodoc
abstract class _$$GetDashboardStatsImplCopyWith<$Res> {
  factory _$$GetDashboardStatsImplCopyWith(_$GetDashboardStatsImpl value,
          $Res Function(_$GetDashboardStatsImpl) then) =
      __$$GetDashboardStatsImplCopyWithImpl<$Res>;
}

/// @nodoc
class __$$GetDashboardStatsImplCopyWithImpl<$Res>
    extends _$DashboardEventCopyWithImpl<$Res, _$GetDashboardStatsImpl>
    implements _$$GetDashboardStatsImplCopyWith<$Res> {
  __$$GetDashboardStatsImplCopyWithImpl(_$GetDashboardStatsImpl _value,
      $Res Function(_$GetDashboardStatsImpl) _then)
      : super(_value, _then);
}

/// @nodoc

class _$GetDashboardStatsImpl implements GetDashboardStats {
  const _$GetDashboardStatsImpl();

  @override
  String toString() {
    return 'DashboardEvent.getDashboardStats()';
  }

  @override
  bool operator ==(dynamic other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType && other is _$GetDashboardStatsImpl);
  }

  @override
  int get hashCode => runtimeType.hashCode;

  @override
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function() getDashboardStats,
    required TResult Function(int page, int limit) getRecentActivity,
    required TResult Function() refreshDashboard,
  }) {
    return getDashboardStats();
  }

  @override
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function()? getDashboardStats,
    TResult? Function(int page, int limit)? getRecentActivity,
    TResult? Function()? refreshDashboard,
  }) {
    return getDashboardStats?.call();
  }

  @override
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function()? getDashboardStats,
    TResult Function(int page, int limit)? getRecentActivity,
    TResult Function()? refreshDashboard,
    required TResult orElse(),
  }) {
    if (getDashboardStats != null) {
      return getDashboardStats();
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(GetDashboardStats value) getDashboardStats,
    required TResult Function(GetRecentActivity value) getRecentActivity,
    required TResult Function(RefreshDashboard value) refreshDashboard,
  }) {
    return getDashboardStats(this);
  }

  @override
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(GetDashboardStats value)? getDashboardStats,
    TResult? Function(GetRecentActivity value)? getRecentActivity,
    TResult? Function(RefreshDashboard value)? refreshDashboard,
  }) {
    return getDashboardStats?.call(this);
  }

  @override
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(GetDashboardStats value)? getDashboardStats,
    TResult Function(GetRecentActivity value)? getRecentActivity,
    TResult Function(RefreshDashboard value)? refreshDashboard,
    required TResult orElse(),
  }) {
    if (getDashboardStats != null) {
      return getDashboardStats(this);
    }
    return orElse();
  }
}

abstract class GetDashboardStats implements DashboardEvent {
  const factory GetDashboardStats() = _$GetDashboardStatsImpl;
}

/// @nodoc
abstract class _$$GetRecentActivityImplCopyWith<$Res> {
  factory _$$GetRecentActivityImplCopyWith(_$GetRecentActivityImpl value,
          $Res Function(_$GetRecentActivityImpl) then) =
      __$$GetRecentActivityImplCopyWithImpl<$Res>;
  @useResult
  $Res call({int page, int limit});
}

/// @nodoc
class __$$GetRecentActivityImplCopyWithImpl<$Res>
    extends _$DashboardEventCopyWithImpl<$Res, _$GetRecentActivityImpl>
    implements _$$GetRecentActivityImplCopyWith<$Res> {
  __$$GetRecentActivityImplCopyWithImpl(_$GetRecentActivityImpl _value,
      $Res Function(_$GetRecentActivityImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? page = null,
    Object? limit = null,
  }) {
    return _then(_$GetRecentActivityImpl(
      page: null == page
          ? _value.page
          : page // ignore: cast_nullable_to_non_nullable
              as int,
      limit: null == limit
          ? _value.limit
          : limit // ignore: cast_nullable_to_non_nullable
              as int,
    ));
  }
}

/// @nodoc

class _$GetRecentActivityImpl implements GetRecentActivity {
  const _$GetRecentActivityImpl({this.page = 1, this.limit = 10});

  @override
  @JsonKey()
  final int page;
  @override
  @JsonKey()
  final int limit;

  @override
  String toString() {
    return 'DashboardEvent.getRecentActivity(page: $page, limit: $limit)';
  }

  @override
  bool operator ==(dynamic other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$GetRecentActivityImpl &&
            (identical(other.page, page) || other.page == page) &&
            (identical(other.limit, limit) || other.limit == limit));
  }

  @override
  int get hashCode => Object.hash(runtimeType, page, limit);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$GetRecentActivityImplCopyWith<_$GetRecentActivityImpl> get copyWith =>
      __$$GetRecentActivityImplCopyWithImpl<_$GetRecentActivityImpl>(
          this, _$identity);

  @override
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function() getDashboardStats,
    required TResult Function(int page, int limit) getRecentActivity,
    required TResult Function() refreshDashboard,
  }) {
    return getRecentActivity(page, limit);
  }

  @override
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function()? getDashboardStats,
    TResult? Function(int page, int limit)? getRecentActivity,
    TResult? Function()? refreshDashboard,
  }) {
    return getRecentActivity?.call(page, limit);
  }

  @override
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function()? getDashboardStats,
    TResult Function(int page, int limit)? getRecentActivity,
    TResult Function()? refreshDashboard,
    required TResult orElse(),
  }) {
    if (getRecentActivity != null) {
      return getRecentActivity(page, limit);
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(GetDashboardStats value) getDashboardStats,
    required TResult Function(GetRecentActivity value) getRecentActivity,
    required TResult Function(RefreshDashboard value) refreshDashboard,
  }) {
    return getRecentActivity(this);
  }

  @override
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(GetDashboardStats value)? getDashboardStats,
    TResult? Function(GetRecentActivity value)? getRecentActivity,
    TResult? Function(RefreshDashboard value)? refreshDashboard,
  }) {
    return getRecentActivity?.call(this);
  }

  @override
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(GetDashboardStats value)? getDashboardStats,
    TResult Function(GetRecentActivity value)? getRecentActivity,
    TResult Function(RefreshDashboard value)? refreshDashboard,
    required TResult orElse(),
  }) {
    if (getRecentActivity != null) {
      return getRecentActivity(this);
    }
    return orElse();
  }
}

abstract class GetRecentActivity implements DashboardEvent {
  const factory GetRecentActivity({final int page, final int limit}) =
      _$GetRecentActivityImpl;

  int get page;
  int get limit;
  @JsonKey(ignore: true)
  _$$GetRecentActivityImplCopyWith<_$GetRecentActivityImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class _$$RefreshDashboardImplCopyWith<$Res> {
  factory _$$RefreshDashboardImplCopyWith(_$RefreshDashboardImpl value,
          $Res Function(_$RefreshDashboardImpl) then) =
      __$$RefreshDashboardImplCopyWithImpl<$Res>;
}

/// @nodoc
class __$$RefreshDashboardImplCopyWithImpl<$Res>
    extends _$DashboardEventCopyWithImpl<$Res, _$RefreshDashboardImpl>
    implements _$$RefreshDashboardImplCopyWith<$Res> {
  __$$RefreshDashboardImplCopyWithImpl(_$RefreshDashboardImpl _value,
      $Res Function(_$RefreshDashboardImpl) _then)
      : super(_value, _then);
}

/// @nodoc

class _$RefreshDashboardImpl implements RefreshDashboard {
  const _$RefreshDashboardImpl();

  @override
  String toString() {
    return 'DashboardEvent.refreshDashboard()';
  }

  @override
  bool operator ==(dynamic other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType && other is _$RefreshDashboardImpl);
  }

  @override
  int get hashCode => runtimeType.hashCode;

  @override
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function() getDashboardStats,
    required TResult Function(int page, int limit) getRecentActivity,
    required TResult Function() refreshDashboard,
  }) {
    return refreshDashboard();
  }

  @override
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function()? getDashboardStats,
    TResult? Function(int page, int limit)? getRecentActivity,
    TResult? Function()? refreshDashboard,
  }) {
    return refreshDashboard?.call();
  }

  @override
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function()? getDashboardStats,
    TResult Function(int page, int limit)? getRecentActivity,
    TResult Function()? refreshDashboard,
    required TResult orElse(),
  }) {
    if (refreshDashboard != null) {
      return refreshDashboard();
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(GetDashboardStats value) getDashboardStats,
    required TResult Function(GetRecentActivity value) getRecentActivity,
    required TResult Function(RefreshDashboard value) refreshDashboard,
  }) {
    return refreshDashboard(this);
  }

  @override
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(GetDashboardStats value)? getDashboardStats,
    TResult? Function(GetRecentActivity value)? getRecentActivity,
    TResult? Function(RefreshDashboard value)? refreshDashboard,
  }) {
    return refreshDashboard?.call(this);
  }

  @override
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(GetDashboardStats value)? getDashboardStats,
    TResult Function(GetRecentActivity value)? getRecentActivity,
    TResult Function(RefreshDashboard value)? refreshDashboard,
    required TResult orElse(),
  }) {
    if (refreshDashboard != null) {
      return refreshDashboard(this);
    }
    return orElse();
  }
}

abstract class RefreshDashboard implements DashboardEvent {
  const factory RefreshDashboard() = _$RefreshDashboardImpl;
}