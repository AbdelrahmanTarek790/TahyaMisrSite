// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'media_event.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

/// @nodoc
mixin _$MediaEvent {
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function() getMedia,
    required TResult Function() refreshMedia,
    required TResult Function(String id) getMediaById,
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function()? getMedia,
    TResult? Function()? refreshMedia,
    TResult? Function(String id)? getMediaById,
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function()? getMedia,
    TResult Function()? refreshMedia,
    TResult Function(String id)? getMediaById,
    required TResult orElse(),
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(GetMedia value) getMedia,
    required TResult Function(RefreshMedia value) refreshMedia,
    required TResult Function(GetMediaById value) getMediaById,
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(GetMedia value)? getMedia,
    TResult? Function(RefreshMedia value)? refreshMedia,
    TResult? Function(GetMediaById value)? getMediaById,
  }) =>
      throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(GetMedia value)? getMedia,
    TResult Function(RefreshMedia value)? refreshMedia,
    TResult Function(GetMediaById value)? getMediaById,
    required TResult orElse(),
  }) =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $MediaEventCopyWith<$Res> {
  factory $MediaEventCopyWith(
          MediaEvent value, $Res Function(MediaEvent) then) =
      _$MediaEventCopyWithImpl<$Res, MediaEvent>;
}

/// @nodoc
class _$MediaEventCopyWithImpl<$Res, $Val extends MediaEvent>
    implements $MediaEventCopyWith<$Res> {
  _$MediaEventCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;
}

/// @nodoc
abstract class _$$GetMediaImplCopyWith<$Res> {
  factory _$$GetMediaImplCopyWith(
          _$GetMediaImpl value, $Res Function(_$GetMediaImpl) then) =
      __$$GetMediaImplCopyWithImpl<$Res>;
}

/// @nodoc
class __$$GetMediaImplCopyWithImpl<$Res>
    extends _$MediaEventCopyWithImpl<$Res, _$GetMediaImpl>
    implements _$$GetMediaImplCopyWith<$Res> {
  __$$GetMediaImplCopyWithImpl(
      _$GetMediaImpl _value, $Res Function(_$GetMediaImpl) _then)
      : super(_value, _then);
}

/// @nodoc

class _$GetMediaImpl implements GetMedia {
  const _$GetMediaImpl();

  @override
  String toString() {
    return 'MediaEvent.getMedia()';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType && other is _$GetMediaImpl);
  }

  @override
  int get hashCode => runtimeType.hashCode;

  @override
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function() getMedia,
    required TResult Function() refreshMedia,
    required TResult Function(String id) getMediaById,
  }) {
    return getMedia();
  }

  @override
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function()? getMedia,
    TResult? Function()? refreshMedia,
    TResult? Function(String id)? getMediaById,
  }) {
    return getMedia?.call();
  }

  @override
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function()? getMedia,
    TResult Function()? refreshMedia,
    TResult Function(String id)? getMediaById,
    required TResult orElse(),
  }) {
    if (getMedia != null) {
      return getMedia();
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(GetMedia value) getMedia,
    required TResult Function(RefreshMedia value) refreshMedia,
    required TResult Function(GetMediaById value) getMediaById,
  }) {
    return getMedia(this);
  }

  @override
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(GetMedia value)? getMedia,
    TResult? Function(RefreshMedia value)? refreshMedia,
    TResult? Function(GetMediaById value)? getMediaById,
  }) {
    return getMedia?.call(this);
  }

  @override
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(GetMedia value)? getMedia,
    TResult Function(RefreshMedia value)? refreshMedia,
    TResult Function(GetMediaById value)? getMediaById,
    required TResult orElse(),
  }) {
    if (getMedia != null) {
      return getMedia(this);
    }
    return orElse();
  }
}

abstract class GetMedia implements MediaEvent {
  const factory GetMedia() = _$GetMediaImpl;
}

/// @nodoc
abstract class _$$RefreshMediaImplCopyWith<$Res> {
  factory _$$RefreshMediaImplCopyWith(
          _$RefreshMediaImpl value, $Res Function(_$RefreshMediaImpl) then) =
      __$$RefreshMediaImplCopyWithImpl<$Res>;
}

/// @nodoc
class __$$RefreshMediaImplCopyWithImpl<$Res>
    extends _$MediaEventCopyWithImpl<$Res, _$RefreshMediaImpl>
    implements _$$RefreshMediaImplCopyWith<$Res> {
  __$$RefreshMediaImplCopyWithImpl(
      _$RefreshMediaImpl _value, $Res Function(_$RefreshMediaImpl) _then)
      : super(_value, _then);
}

/// @nodoc

class _$RefreshMediaImpl implements RefreshMedia {
  const _$RefreshMediaImpl();

  @override
  String toString() {
    return 'MediaEvent.refreshMedia()';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType && other is _$RefreshMediaImpl);
  }

  @override
  int get hashCode => runtimeType.hashCode;

  @override
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function() getMedia,
    required TResult Function() refreshMedia,
    required TResult Function(String id) getMediaById,
  }) {
    return refreshMedia();
  }

  @override
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function()? getMedia,
    TResult? Function()? refreshMedia,
    TResult? Function(String id)? getMediaById,
  }) {
    return refreshMedia?.call();
  }

  @override
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function()? getMedia,
    TResult Function()? refreshMedia,
    TResult Function(String id)? getMediaById,
    required TResult orElse(),
  }) {
    if (refreshMedia != null) {
      return refreshMedia();
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(GetMedia value) getMedia,
    required TResult Function(RefreshMedia value) refreshMedia,
    required TResult Function(GetMediaById value) getMediaById,
  }) {
    return refreshMedia(this);
  }

  @override
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(GetMedia value)? getMedia,
    TResult? Function(RefreshMedia value)? refreshMedia,
    TResult? Function(GetMediaById value)? getMediaById,
  }) {
    return refreshMedia?.call(this);
  }

  @override
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(GetMedia value)? getMedia,
    TResult Function(RefreshMedia value)? refreshMedia,
    TResult Function(GetMediaById value)? getMediaById,
    required TResult orElse(),
  }) {
    if (refreshMedia != null) {
      return refreshMedia(this);
    }
    return orElse();
  }
}

abstract class RefreshMedia implements MediaEvent {
  const factory RefreshMedia() = _$RefreshMediaImpl;
}

/// @nodoc
abstract class _$$GetMediaByIdImplCopyWith<$Res> {
  factory _$$GetMediaByIdImplCopyWith(
          _$GetMediaByIdImpl value, $Res Function(_$GetMediaByIdImpl) then) =
      __$$GetMediaByIdImplCopyWithImpl<$Res>;
  @useResult
  $Res call({String id});
}

/// @nodoc
class __$$GetMediaByIdImplCopyWithImpl<$Res>
    extends _$MediaEventCopyWithImpl<$Res, _$GetMediaByIdImpl>
    implements _$$GetMediaByIdImplCopyWith<$Res> {
  __$$GetMediaByIdImplCopyWithImpl(
      _$GetMediaByIdImpl _value, $Res Function(_$GetMediaByIdImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
  }) {
    return _then(_$GetMediaByIdImpl(
      null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc

class _$GetMediaByIdImpl implements GetMediaById {
  const _$GetMediaByIdImpl(this.id);

  @override
  final String id;

  @override
  String toString() {
    return 'MediaEvent.getMediaById(id: $id)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$GetMediaByIdImpl &&
            (identical(other.id, id) || other.id == id));
  }

  @override
  int get hashCode => Object.hash(runtimeType, id);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$GetMediaByIdImplCopyWith<_$GetMediaByIdImpl> get copyWith =>
      __$$GetMediaByIdImplCopyWithImpl<_$GetMediaByIdImpl>(this, _$identity);

  @override
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function() getMedia,
    required TResult Function() refreshMedia,
    required TResult Function(String id) getMediaById,
  }) {
    return getMediaById(id);
  }

  @override
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function()? getMedia,
    TResult? Function()? refreshMedia,
    TResult? Function(String id)? getMediaById,
  }) {
    return getMediaById?.call(id);
  }

  @override
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function()? getMedia,
    TResult Function()? refreshMedia,
    TResult Function(String id)? getMediaById,
    required TResult orElse(),
  }) {
    if (getMediaById != null) {
      return getMediaById(id);
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(GetMedia value) getMedia,
    required TResult Function(RefreshMedia value) refreshMedia,
    required TResult Function(GetMediaById value) getMediaById,
  }) {
    return getMediaById(this);
  }

  @override
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(GetMedia value)? getMedia,
    TResult? Function(RefreshMedia value)? refreshMedia,
    TResult? Function(GetMediaById value)? getMediaById,
  }) {
    return getMediaById?.call(this);
  }

  @override
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(GetMedia value)? getMedia,
    TResult Function(RefreshMedia value)? refreshMedia,
    TResult Function(GetMediaById value)? getMediaById,
    required TResult orElse(),
  }) {
    if (getMediaById != null) {
      return getMediaById(this);
    }
    return orElse();
  }
}

abstract class GetMediaById implements MediaEvent {
  const factory GetMediaById(final String id) = _$GetMediaByIdImpl;

  String get id;
  @JsonKey(ignore: true)
  _$$GetMediaByIdImplCopyWith<_$GetMediaByIdImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
