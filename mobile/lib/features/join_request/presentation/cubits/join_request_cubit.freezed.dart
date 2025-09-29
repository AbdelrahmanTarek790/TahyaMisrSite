// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint

part of 'join_request_cubit.dart';

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError('Mock freezed implementation');

mixin _$JoinRequestState {
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function() initial,
    required TResult Function() loading,
    required TResult Function() processing,
    required TResult Function(JoinRequestModel joinRequest) created,
    required TResult Function(List<JoinRequestModel> joinRequests, Pagination pagination) loaded,
    required TResult Function(JoinRequestModel joinRequest) detailLoaded,
    required TResult Function(JoinRequestModel joinRequest, String action) actionCompleted,
    required TResult Function() deleted,
    required TResult Function(String message) error,
  }) => throw _privateConstructorUsedError;

  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function()? initial,
    TResult? Function()? loading,
    TResult? Function()? processing,
    TResult? Function(JoinRequestModel joinRequest)? created,
    TResult? Function(List<JoinRequestModel> joinRequests, Pagination pagination)? loaded,
    TResult? Function(JoinRequestModel joinRequest)? detailLoaded,
    TResult? Function(JoinRequestModel joinRequest, String action)? actionCompleted,
    TResult? Function()? deleted,
    TResult? Function(String message)? error,
  }) => throw _privateConstructorUsedError;

  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function()? initial,
    TResult Function()? loading,
    TResult Function()? processing,
    TResult Function(JoinRequestModel joinRequest)? created,
    TResult Function(List<JoinRequestModel> joinRequests, Pagination pagination)? loaded,
    TResult Function(JoinRequestModel joinRequest)? detailLoaded,
    TResult Function(JoinRequestModel joinRequest, String action)? actionCompleted,
    TResult Function()? deleted,
    TResult Function(String message)? error,
    required TResult orElse(),
  }) => throw _privateConstructorUsedError;
}

class _$InitialImpl implements Initial {
  const _$InitialImpl();

  @override
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function() initial,
    required TResult Function() loading,
    required TResult Function() processing,
    required TResult Function(JoinRequestModel joinRequest) created,
    required TResult Function(List<JoinRequestModel> joinRequests, Pagination pagination) loaded,
    required TResult Function(JoinRequestModel joinRequest) detailLoaded,
    required TResult Function(JoinRequestModel joinRequest, String action) actionCompleted,
    required TResult Function() deleted,
    required TResult Function(String message) error,
  }) => initial();

  @override
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function()? initial,
    TResult? Function()? loading,
    TResult? Function()? processing,
    TResult? Function(JoinRequestModel joinRequest)? created,
    TResult? Function(List<JoinRequestModel> joinRequests, Pagination pagination)? loaded,
    TResult? Function(JoinRequestModel joinRequest)? detailLoaded,
    TResult? Function(JoinRequestModel joinRequest, String action)? actionCompleted,
    TResult? Function()? deleted,
    TResult? Function(String message)? error,
  }) => initial?.call();

  @override
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function()? initial,
    TResult Function()? loading,
    TResult Function()? processing,
    TResult Function(JoinRequestModel joinRequest)? created,
    TResult Function(List<JoinRequestModel> joinRequests, Pagination pagination)? loaded,
    TResult Function(JoinRequestModel joinRequest)? detailLoaded,
    TResult Function(JoinRequestModel joinRequest, String action)? actionCompleted,
    TResult Function()? deleted,
    TResult Function(String message)? error,
    required TResult orElse(),
  }) => initial != null ? initial() : orElse();
}

abstract class Initial implements JoinRequestState {
  const factory Initial() = _$InitialImpl;
}

// Mock implementations for other states - minimal for compilation
class _$LoadingImpl implements Loading { const _$LoadingImpl(); @override TResult when<TResult extends Object?>({required TResult Function() initial, required TResult Function() loading, required TResult Function() processing, required TResult Function(JoinRequestModel joinRequest) created, required TResult Function(List<JoinRequestModel> joinRequests, Pagination pagination) loaded, required TResult Function(JoinRequestModel joinRequest) detailLoaded, required TResult Function(JoinRequestModel joinRequest, String action) actionCompleted, required TResult Function() deleted, required TResult Function(String message) error}) => loading(); @override TResult? whenOrNull<TResult extends Object?>({TResult? Function()? initial, TResult? Function()? loading, TResult? Function()? processing, TResult? Function(JoinRequestModel joinRequest)? created, TResult? Function(List<JoinRequestModel> joinRequests, Pagination pagination)? loaded, TResult? Function(JoinRequestModel joinRequest)? detailLoaded, TResult? Function(JoinRequestModel joinRequest, String action)? actionCompleted, TResult? Function()? deleted, TResult? Function(String message)? error}) => loading?.call(); @override TResult maybeWhen<TResult extends Object?>({TResult Function()? initial, TResult Function()? loading, TResult Function()? processing, TResult Function(JoinRequestModel joinRequest)? created, TResult Function(List<JoinRequestModel> joinRequests, Pagination pagination)? loaded, TResult Function(JoinRequestModel joinRequest)? detailLoaded, TResult Function(JoinRequestModel joinRequest, String action)? actionCompleted, TResult Function()? deleted, TResult Function(String message)? error, required TResult orElse()}) => loading != null ? loading() : orElse(); }
abstract class Loading implements JoinRequestState { const factory Loading() = _$LoadingImpl; }

class _$ProcessingImpl implements Processing { const _$ProcessingImpl(); @override TResult when<TResult extends Object?>({required TResult Function() initial, required TResult Function() loading, required TResult Function() processing, required TResult Function(JoinRequestModel joinRequest) created, required TResult Function(List<JoinRequestModel> joinRequests, Pagination pagination) loaded, required TResult Function(JoinRequestModel joinRequest) detailLoaded, required TResult Function(JoinRequestModel joinRequest, String action) actionCompleted, required TResult Function() deleted, required TResult Function(String message) error}) => processing(); @override TResult? whenOrNull<TResult extends Object?>({TResult? Function()? initial, TResult? Function()? loading, TResult? Function()? processing, TResult? Function(JoinRequestModel joinRequest)? created, TResult? Function(List<JoinRequestModel> joinRequests, Pagination pagination)? loaded, TResult? Function(JoinRequestModel joinRequest)? detailLoaded, TResult? Function(JoinRequestModel joinRequest, String action)? actionCompleted, TResult? Function()? deleted, TResult? Function(String message)? error}) => processing?.call(); @override TResult maybeWhen<TResult extends Object?>({TResult Function()? initial, TResult Function()? loading, TResult Function()? processing, TResult Function(JoinRequestModel joinRequest)? created, TResult Function(List<JoinRequestModel> joinRequests, Pagination pagination)? loaded, TResult Function(JoinRequestModel joinRequest)? detailLoaded, TResult Function(JoinRequestModel joinRequest, String action)? actionCompleted, TResult Function()? deleted, TResult Function(String message)? error, required TResult orElse()}) => processing != null ? processing() : orElse(); }
abstract class Processing implements JoinRequestState { const factory Processing() = _$ProcessingImpl; }

class _$CreatedImpl implements Created { final JoinRequestModel joinRequest; const _$CreatedImpl({required this.joinRequest}); @override TResult when<TResult extends Object?>({required TResult Function() initial, required TResult Function() loading, required TResult Function() processing, required TResult Function(JoinRequestModel joinRequest) created, required TResult Function(List<JoinRequestModel> joinRequests, Pagination pagination) loaded, required TResult Function(JoinRequestModel joinRequest) detailLoaded, required TResult Function(JoinRequestModel joinRequest, String action) actionCompleted, required TResult Function() deleted, required TResult Function(String message) error}) => created(joinRequest); @override TResult? whenOrNull<TResult extends Object?>({TResult? Function()? initial, TResult? Function()? loading, TResult? Function()? processing, TResult? Function(JoinRequestModel joinRequest)? created, TResult? Function(List<JoinRequestModel> joinRequests, Pagination pagination)? loaded, TResult? Function(JoinRequestModel joinRequest)? detailLoaded, TResult? Function(JoinRequestModel joinRequest, String action)? actionCompleted, TResult? Function()? deleted, TResult? Function(String message)? error}) => created?.call(joinRequest); @override TResult maybeWhen<TResult extends Object?>({TResult Function()? initial, TResult Function()? loading, TResult Function()? processing, TResult Function(JoinRequestModel joinRequest)? created, TResult Function(List<JoinRequestModel> joinRequests, Pagination pagination)? loaded, TResult Function(JoinRequestModel joinRequest)? detailLoaded, TResult Function(JoinRequestModel joinRequest, String action)? actionCompleted, TResult Function()? deleted, TResult Function(String message)? error, required TResult orElse()}) => created != null ? created(joinRequest) : orElse(); }
abstract class Created implements JoinRequestState { const factory Created({required JoinRequestModel joinRequest}) = _$CreatedImpl; }

class _$LoadedImpl implements Loaded { final List<JoinRequestModel> joinRequests; final Pagination pagination; const _$LoadedImpl({required this.joinRequests, required this.pagination}); @override TResult when<TResult extends Object?>({required TResult Function() initial, required TResult Function() loading, required TResult Function() processing, required TResult Function(JoinRequestModel joinRequest) created, required TResult Function(List<JoinRequestModel> joinRequests, Pagination pagination) loaded, required TResult Function(JoinRequestModel joinRequest) detailLoaded, required TResult Function(JoinRequestModel joinRequest, String action) actionCompleted, required TResult Function() deleted, required TResult Function(String message) error}) => loaded(joinRequests, pagination); @override TResult? whenOrNull<TResult extends Object?>({TResult? Function()? initial, TResult? Function()? loading, TResult? Function()? processing, TResult? Function(JoinRequestModel joinRequest)? created, TResult? Function(List<JoinRequestModel> joinRequests, Pagination pagination)? loaded, TResult? Function(JoinRequestModel joinRequest)? detailLoaded, TResult? Function(JoinRequestModel joinRequest, String action)? actionCompleted, TResult? Function()? deleted, TResult? Function(String message)? error}) => loaded?.call(joinRequests, pagination); @override TResult maybeWhen<TResult extends Object?>({TResult Function()? initial, TResult Function()? loading, TResult Function()? processing, TResult Function(JoinRequestModel joinRequest)? created, TResult Function(List<JoinRequestModel> joinRequests, Pagination pagination)? loaded, TResult Function(JoinRequestModel joinRequest)? detailLoaded, TResult Function(JoinRequestModel joinRequest, String action)? actionCompleted, TResult Function()? deleted, TResult Function(String message)? error, required TResult orElse()}) => loaded != null ? loaded(joinRequests, pagination) : orElse(); }
abstract class Loaded implements JoinRequestState { const factory Loaded({required List<JoinRequestModel> joinRequests, required Pagination pagination}) = _$LoadedImpl; }

class _$DetailLoadedImpl implements DetailLoaded { final JoinRequestModel joinRequest; const _$DetailLoadedImpl({required this.joinRequest}); @override TResult when<TResult extends Object?>({required TResult Function() initial, required TResult Function() loading, required TResult Function() processing, required TResult Function(JoinRequestModel joinRequest) created, required TResult Function(List<JoinRequestModel> joinRequests, Pagination pagination) loaded, required TResult Function(JoinRequestModel joinRequest) detailLoaded, required TResult Function(JoinRequestModel joinRequest, String action) actionCompleted, required TResult Function() deleted, required TResult Function(String message) error}) => detailLoaded(joinRequest); @override TResult? whenOrNull<TResult extends Object?>({TResult? Function()? initial, TResult? Function()? loading, TResult? Function()? processing, TResult? Function(JoinRequestModel joinRequest)? created, TResult? Function(List<JoinRequestModel> joinRequests, Pagination pagination)? loaded, TResult? Function(JoinRequestModel joinRequest)? detailLoaded, TResult? Function(JoinRequestModel joinRequest, String action)? actionCompleted, TResult? Function()? deleted, TResult? Function(String message)? error}) => detailLoaded?.call(joinRequest); @override TResult maybeWhen<TResult extends Object?>({TResult Function()? initial, TResult Function()? loading, TResult Function()? processing, TResult Function(JoinRequestModel joinRequest)? created, TResult Function(List<JoinRequestModel> joinRequests, Pagination pagination)? loaded, TResult Function(JoinRequestModel joinRequest)? detailLoaded, TResult Function(JoinRequestModel joinRequest, String action)? actionCompleted, TResult Function()? deleted, TResult Function(String message)? error, required TResult orElse()}) => detailLoaded != null ? detailLoaded(joinRequest) : orElse(); }
abstract class DetailLoaded implements JoinRequestState { const factory DetailLoaded({required JoinRequestModel joinRequest}) = _$DetailLoadedImpl; }

class _$ActionCompletedImpl implements ActionCompleted { final JoinRequestModel joinRequest; final String action; const _$ActionCompletedImpl({required this.joinRequest, required this.action}); @override TResult when<TResult extends Object?>({required TResult Function() initial, required TResult Function() loading, required TResult Function() processing, required TResult Function(JoinRequestModel joinRequest) created, required TResult Function(List<JoinRequestModel> joinRequests, Pagination pagination) loaded, required TResult Function(JoinRequestModel joinRequest) detailLoaded, required TResult Function(JoinRequestModel joinRequest, String action) actionCompleted, required TResult Function() deleted, required TResult Function(String message) error}) => actionCompleted(joinRequest, action); @override TResult? whenOrNull<TResult extends Object?>({TResult? Function()? initial, TResult? Function()? loading, TResult? Function()? processing, TResult? Function(JoinRequestModel joinRequest)? created, TResult? Function(List<JoinRequestModel> joinRequests, Pagination pagination)? loaded, TResult? Function(JoinRequestModel joinRequest)? detailLoaded, TResult? Function(JoinRequestModel joinRequest, String action)? actionCompleted, TResult? Function()? deleted, TResult? Function(String message)? error}) => actionCompleted?.call(joinRequest, action); @override TResult maybeWhen<TResult extends Object?>({TResult Function()? initial, TResult Function()? loading, TResult Function()? processing, TResult Function(JoinRequestModel joinRequest)? created, TResult Function(List<JoinRequestModel> joinRequests, Pagination pagination)? loaded, TResult Function(JoinRequestModel joinRequest)? detailLoaded, TResult Function(JoinRequestModel joinRequest, String action)? actionCompleted, TResult Function()? deleted, TResult Function(String message)? error, required TResult orElse()}) => actionCompleted != null ? actionCompleted(joinRequest, action) : orElse(); }
abstract class ActionCompleted implements JoinRequestState { const factory ActionCompleted({required JoinRequestModel joinRequest, required String action}) = _$ActionCompletedImpl; }

class _$DeletedImpl implements Deleted { const _$DeletedImpl(); @override TResult when<TResult extends Object?>({required TResult Function() initial, required TResult Function() loading, required TResult Function() processing, required TResult Function(JoinRequestModel joinRequest) created, required TResult Function(List<JoinRequestModel> joinRequests, Pagination pagination) loaded, required TResult Function(JoinRequestModel joinRequest) detailLoaded, required TResult Function(JoinRequestModel joinRequest, String action) actionCompleted, required TResult Function() deleted, required TResult Function(String message) error}) => deleted(); @override TResult? whenOrNull<TResult extends Object?>({TResult? Function()? initial, TResult? Function()? loading, TResult? Function()? processing, TResult? Function(JoinRequestModel joinRequest)? created, TResult? Function(List<JoinRequestModel> joinRequests, Pagination pagination)? loaded, TResult? Function(JoinRequestModel joinRequest)? detailLoaded, TResult? Function(JoinRequestModel joinRequest, String action)? actionCompleted, TResult? Function()? deleted, TResult? Function(String message)? error}) => deleted?.call(); @override TResult maybeWhen<TResult extends Object?>({TResult Function()? initial, TResult Function()? loading, TResult Function()? processing, TResult Function(JoinRequestModel joinRequest)? created, TResult Function(List<JoinRequestModel> joinRequests, Pagination pagination)? loaded, TResult Function(JoinRequestModel joinRequest)? detailLoaded, TResult Function(JoinRequestModel joinRequest, String action)? actionCompleted, TResult Function()? deleted, TResult Function(String message)? error, required TResult orElse()}) => deleted != null ? deleted() : orElse(); }
abstract class Deleted implements JoinRequestState { const factory Deleted() = _$DeletedImpl; }

class _$ErrorImpl implements Error { final String message; const _$ErrorImpl({required this.message}); @override TResult when<TResult extends Object?>({required TResult Function() initial, required TResult Function() loading, required TResult Function() processing, required TResult Function(JoinRequestModel joinRequest) created, required TResult Function(List<JoinRequestModel> joinRequests, Pagination pagination) loaded, required TResult Function(JoinRequestModel joinRequest) detailLoaded, required TResult Function(JoinRequestModel joinRequest, String action) actionCompleted, required TResult Function() deleted, required TResult Function(String message) error}) => error(message); @override TResult? whenOrNull<TResult extends Object?>({TResult? Function()? initial, TResult? Function()? loading, TResult? Function()? processing, TResult? Function(JoinRequestModel joinRequest)? created, TResult? Function(List<JoinRequestModel> joinRequests, Pagination pagination)? loaded, TResult? Function(JoinRequestModel joinRequest)? detailLoaded, TResult? Function(JoinRequestModel joinRequest, String action)? actionCompleted, TResult? Function()? deleted, TResult? Function(String message)? error}) => error?.call(message); @override TResult maybeWhen<TResult extends Object?>({TResult Function()? initial, TResult Function()? loading, TResult Function()? processing, TResult Function(JoinRequestModel joinRequest)? created, TResult Function(List<JoinRequestModel> joinRequests, Pagination pagination)? loaded, TResult Function(JoinRequestModel joinRequest)? detailLoaded, TResult Function(JoinRequestModel joinRequest, String action)? actionCompleted, TResult Function()? deleted, TResult Function(String message)? error, required TResult orElse()}) => error != null ? error(message) : orElse(); }
abstract class Error implements JoinRequestState { const factory Error({required String message}) = _$ErrorImpl; }
