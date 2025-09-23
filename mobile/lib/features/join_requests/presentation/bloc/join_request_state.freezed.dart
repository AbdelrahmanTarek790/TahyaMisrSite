// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'join_request_state.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

/// @nodoc
mixin _$JoinRequestState {
  // Implementation will be handled by the actual freezed generation
}

/// @nodoc
class Initial implements JoinRequestState {
  const Initial();
}

class Loading implements JoinRequestState {
  const Loading();
}

class JoinRequestsLoaded implements JoinRequestState {
  const JoinRequestsLoaded({required this.joinRequests, required this.currentPage, required this.hasMore});
  final List<JoinRequest> joinRequests;
  final int currentPage;
  final bool hasMore;
}

class JoinRequestLoaded implements JoinRequestState {
  const JoinRequestLoaded({required this.joinRequest});
  final JoinRequest joinRequest;
}

class ActionCompleted implements JoinRequestState {
  const ActionCompleted({required this.message});
  final String message;
}

class Error implements JoinRequestState {
  const Error({required this.message});
  final String message;
}