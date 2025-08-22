// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'events_event.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

/// @nodoc
mixin _$EventsEvent {
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function() getEvents,
    required TResult Function() refreshEvents,
    required TResult Function(String id) getEventById,
    required TResult Function(String eventId) registerForEvent,
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function()? getEvents,
    TResult? Function()? refreshEvents,
    TResult? Function(String id)? getEventById,
    TResult? Function(String eventId)? registerForEvent,
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function()? getEvents,
    TResult Function()? refreshEvents,
    TResult Function(String id)? getEventById,
    TResult Function(String eventId)? registerForEvent,
    required TResult orElse(),
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(GetEvents value) getEvents,
    required TResult Function(RefreshEvents value) refreshEvents,
    required TResult Function(GetEventById value) getEventById,
    required TResult Function(RegisterForEvent value) registerForEvent,
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(GetEvents value)? getEvents,
    TResult? Function(RefreshEvents value)? refreshEvents,
    TResult? Function(GetEventById value)? getEventById,
    TResult? Function(RegisterForEvent value)? registerForEvent,
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(GetEvents value)? getEvents,
    TResult Function(RefreshEvents value)? refreshEvents,
    TResult Function(GetEventById value)? getEventById,
    TResult Function(RegisterForEvent value)? registerForEvent,
    required TResult orElse(),
  }) =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $EventsEventCopyWith<$Res> {
  factory $EventsEventCopyWith(
          EventsEvent value, $Res Function(EventsEvent) then) =
      _$EventsEventCopyWithImpl<$Res, EventsEvent>;
}

/// @nodoc
class _$EventsEventCopyWithImpl<$Res, $Val extends EventsEvent>
    implements $EventsEventCopyWith<$Res> {
  _$EventsEventCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;
}

/// @nodoc
abstract class _$$GetEventsImplCopyWith<$Res> {
  factory _$$GetEventsImplCopyWith(
          _$GetEventsImpl value, $Res Function(_$GetEventsImpl) then) =
      __$$GetEventsImplCopyWithImpl<$Res>;
}

/// @nodoc
class __$$GetEventsImplCopyWithImpl<$Res>
    extends _$EventsEventCopyWithImpl<$Res, _$GetEventsImpl>
    implements _$$GetEventsImplCopyWith<$Res> {
  __$$GetEventsImplCopyWithImpl(
      _$GetEventsImpl _value, $Res Function(_$GetEventsImpl) _then)
      : super(_value, _then);
}

/// @nodoc

class _$GetEventsImpl implements GetEvents {
  const _$GetEventsImpl();

  @override
  String toString() {
    return 'EventsEvent.getEvents()';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType && other is _$GetEventsImpl);
  }

  @override
  int get hashCode => runtimeType.hashCode;

  @override
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function() getEvents,
    required TResult Function() refreshEvents,
    required TResult Function(String id) getEventById,
    required TResult Function(String eventId) registerForEvent,
  }) {
    return getEvents();
  }

  @override
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function()? getEvents,
    TResult? Function()? refreshEvents,
    TResult? Function(String id)? getEventById,
    TResult? Function(String eventId)? registerForEvent,
  }) {
    return getEvents?.call();
  }

  @override
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function()? getEvents,
    TResult Function()? refreshEvents,
    TResult Function(String id)? getEventById,
    TResult Function(String eventId)? registerForEvent,
    required TResult orElse(),
  }) {
    if (getEvents != null) {
      return getEvents();
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(GetEvents value) getEvents,
    required TResult Function(RefreshEvents value) refreshEvents,
    required TResult Function(GetEventById value) getEventById,
    required TResult Function(RegisterForEvent value) registerForEvent,
  }) {
    return getEvents(this);
  }

  @override
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(GetEvents value)? getEvents,
    TResult? Function(RefreshEvents value)? refreshEvents,
    TResult? Function(GetEventById value)? getEventById,
    TResult? Function(RegisterForEvent value)? registerForEvent,
  }) {
    return getEvents?.call(this);
  }

  @override
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(GetEvents value)? getEvents,
    TResult Function(RefreshEvents value)? refreshEvents,
    TResult Function(GetEventById value)? getEventById,
    TResult Function(RegisterForEvent value)? registerForEvent,
    required TResult orElse(),
  }) {
    if (getEvents != null) {
      return getEvents(this);
    }
    return orElse();
  }
}

abstract class GetEvents implements EventsEvent {
  const factory GetEvents() = _$GetEventsImpl;
}

/// @nodoc
abstract class _$$RefreshEventsImplCopyWith<$Res> {
  factory _$$RefreshEventsImplCopyWith(
          _$RefreshEventsImpl value, $Res Function(_$RefreshEventsImpl) then) =
      __$$RefreshEventsImplCopyWithImpl<$Res>;
}

/// @nodoc
class __$$RefreshEventsImplCopyWithImpl<$Res>
    extends _$EventsEventCopyWithImpl<$Res, _$RefreshEventsImpl>
    implements _$$RefreshEventsImplCopyWith<$Res> {
  __$$RefreshEventsImplCopyWithImpl(
      _$RefreshEventsImpl _value, $Res Function(_$RefreshEventsImpl) _then)
      : super(_value, _then);
}

/// @nodoc

class _$RefreshEventsImpl implements RefreshEvents {
  const _$RefreshEventsImpl();

  @override
  String toString() {
    return 'EventsEvent.refreshEvents()';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType && other is _$RefreshEventsImpl);
  }

  @override
  int get hashCode => runtimeType.hashCode;

  @override
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function() getEvents,
    required TResult Function() refreshEvents,
    required TResult Function(String id) getEventById,
    required TResult Function(String eventId) registerForEvent,
  }) {
    return refreshEvents();
  }

  @override
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function()? getEvents,
    TResult? Function()? refreshEvents,
    TResult? Function(String id)? getEventById,
    TResult? Function(String eventId)? registerForEvent,
  }) {
    return refreshEvents?.call();
  }

  @override
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function()? getEvents,
    TResult Function()? refreshEvents,
    TResult Function(String id)? getEventById,
    TResult Function(String eventId)? registerForEvent,
    required TResult orElse(),
  }) {
    if (refreshEvents != null) {
      return refreshEvents();
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(GetEvents value) getEvents,
    required TResult Function(RefreshEvents value) refreshEvents,
    required TResult Function(GetEventById value) getEventById,
    required TResult Function(RegisterForEvent value) registerForEvent,
  }) {
    return refreshEvents(this);
  }

  @override
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(GetEvents value)? getEvents,
    TResult? Function(RefreshEvents value)? refreshEvents,
    TResult? Function(GetEventById value)? getEventById,
    TResult? Function(RegisterForEvent value)? registerForEvent,
  }) {
    return refreshEvents?.call(this);
  }

  @override
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(GetEvents value)? getEvents,
    TResult Function(RefreshEvents value)? refreshEvents,
    TResult Function(GetEventById value)? getEventById,
    TResult Function(RegisterForEvent value)? registerForEvent,
    required TResult orElse(),
  }) {
    if (refreshEvents != null) {
      return refreshEvents(this);
    }
    return orElse();
  }
}

abstract class RefreshEvents implements EventsEvent {
  const factory RefreshEvents() = _$RefreshEventsImpl;
}

/// @nodoc
abstract class _$$GetEventByIdImplCopyWith<$Res> {
  factory _$$GetEventByIdImplCopyWith(
          _$GetEventByIdImpl value, $Res Function(_$GetEventByIdImpl) then) =
      __$$GetEventByIdImplCopyWithImpl<$Res>;
  @useResult
  $Res call({String id});
}

/// @nodoc
class __$$GetEventByIdImplCopyWithImpl<$Res>
    extends _$EventsEventCopyWithImpl<$Res, _$GetEventByIdImpl>
    implements _$$GetEventByIdImplCopyWith<$Res> {
  __$$GetEventByIdImplCopyWithImpl(
      _$GetEventByIdImpl _value, $Res Function(_$GetEventByIdImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
  }) {
    return _then(_$GetEventByIdImpl(
      null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc

class _$GetEventByIdImpl implements GetEventById {
  const _$GetEventByIdImpl(this.id);

  @override
  final String id;

  @override
  String toString() {
    return 'EventsEvent.getEventById(id: $id)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$GetEventByIdImpl &&
            (identical(other.id, id) || other.id == id));
  }

  @override
  int get hashCode => Object.hash(runtimeType, id);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$GetEventByIdImplCopyWith<_$GetEventByIdImpl> get copyWith =>
      __$$GetEventByIdImplCopyWithImpl<_$GetEventByIdImpl>(this, _$identity);

  @override
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function() getEvents,
    required TResult Function() refreshEvents,
    required TResult Function(String id) getEventById,
    required TResult Function(String eventId) registerForEvent,
  }) {
    return getEventById(id);
  }

  @override
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function()? getEvents,
    TResult? Function()? refreshEvents,
    TResult? Function(String id)? getEventById,
    TResult? Function(String eventId)? registerForEvent,
  }) {
    return getEventById?.call(id);
  }

  @override
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function()? getEvents,
    TResult Function()? refreshEvents,
    TResult Function(String id)? getEventById,
    TResult Function(String eventId)? registerForEvent,
    required TResult orElse(),
  }) {
    if (getEventById != null) {
      return getEventById(id);
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(GetEvents value) getEvents,
    required TResult Function(RefreshEvents value) refreshEvents,
    required TResult Function(GetEventById value) getEventById,
    required TResult Function(RegisterForEvent value) registerForEvent,
  }) {
    return getEventById(this);
  }

  @override
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(GetEvents value)? getEvents,
    TResult? Function(RefreshEvents value)? refreshEvents,
    TResult? Function(GetEventById value)? getEventById,
    TResult? Function(RegisterForEvent value)? registerForEvent,
  }) {
    return getEventById?.call(this);
  }

  @override
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(GetEvents value)? getEvents,
    TResult Function(RefreshEvents value)? refreshEvents,
    TResult Function(GetEventById value)? getEventById,
    TResult Function(RegisterForEvent value)? registerForEvent,
    required TResult orElse(),
  }) {
    if (getEventById != null) {
      return getEventById(this);
    }
    return orElse();
  }
}

abstract class GetEventById implements EventsEvent {
  const factory GetEventById(final String id) = _$GetEventByIdImpl;

  String get id;
  @JsonKey(ignore: true)
  _$$GetEventByIdImplCopyWith<_$GetEventByIdImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class _$$RegisterForEventImplCopyWith<$Res> {
  factory _$$RegisterForEventImplCopyWith(_$RegisterForEventImpl value,
          $Res Function(_$RegisterForEventImpl) then) =
      __$$RegisterForEventImplCopyWithImpl<$Res>;
  @useResult
  $Res call({String eventId});
}

/// @nodoc
class __$$RegisterForEventImplCopyWithImpl<$Res>
    extends _$EventsEventCopyWithImpl<$Res, _$RegisterForEventImpl>
    implements _$$RegisterForEventImplCopyWith<$Res> {
  __$$RegisterForEventImplCopyWithImpl(_$RegisterForEventImpl _value,
      $Res Function(_$RegisterForEventImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? eventId = null,
  }) {
    return _then(_$RegisterForEventImpl(
      null == eventId
          ? _value.eventId
          : eventId // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc

class _$RegisterForEventImpl implements RegisterForEvent {
  const _$RegisterForEventImpl(this.eventId);

  @override
  final String eventId;

  @override
  String toString() {
    return 'EventsEvent.registerForEvent(eventId: $eventId)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$RegisterForEventImpl &&
            (identical(other.eventId, eventId) || other.eventId == eventId));
  }

  @override
  int get hashCode => Object.hash(runtimeType, eventId);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$RegisterForEventImplCopyWith<_$RegisterForEventImpl> get copyWith =>
      __$$RegisterForEventImplCopyWithImpl<_$RegisterForEventImpl>(
          this, _$identity);

  @override
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function() getEvents,
    required TResult Function() refreshEvents,
    required TResult Function(String id) getEventById,
    required TResult Function(String eventId) registerForEvent,
  }) {
    return registerForEvent(eventId);
  }

  @override
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function()? getEvents,
    TResult? Function()? refreshEvents,
    TResult? Function(String id)? getEventById,
    TResult? Function(String eventId)? registerForEvent,
  }) {
    return registerForEvent?.call(eventId);
  }

  @override
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function()? getEvents,
    TResult Function()? refreshEvents,
    TResult Function(String id)? getEventById,
    TResult Function(String eventId)? registerForEvent,
    required TResult orElse(),
  }) {
    if (registerForEvent != null) {
      return registerForEvent(eventId);
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(GetEvents value) getEvents,
    required TResult Function(RefreshEvents value) refreshEvents,
    required TResult Function(GetEventById value) getEventById,
    required TResult Function(RegisterForEvent value) registerForEvent,
  }) {
    return registerForEvent(this);
  }

  @override
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(GetEvents value)? getEvents,
    TResult? Function(RefreshEvents value)? refreshEvents,
    TResult? Function(GetEventById value)? getEventById,
    TResult? Function(RegisterForEvent value)? registerForEvent,
  }) {
    return registerForEvent?.call(this);
  }

  @override
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(GetEvents value)? getEvents,
    TResult Function(RefreshEvents value)? refreshEvents,
    TResult Function(GetEventById value)? getEventById,
    TResult Function(RegisterForEvent value)? registerForEvent,
    required TResult orElse(),
  }) {
    if (registerForEvent != null) {
      return registerForEvent(this);
    }
    return orElse();
  }
}

abstract class RegisterForEvent implements EventsEvent {
  const factory RegisterForEvent(final String eventId) = _$RegisterForEventImpl;

  String get eventId;
  @JsonKey(ignore: true)
  _$$RegisterForEventImplCopyWith<_$RegisterForEventImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
