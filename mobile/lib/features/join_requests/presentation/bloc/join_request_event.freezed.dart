// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'join_request_event.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

/// @nodoc
mixin _$JoinRequestEvent {
  // Implementation will be handled by the actual freezed generation
}

/// @nodoc
class CreateJoinRequestEvent implements JoinRequestEvent {
  const CreateJoinRequestEvent({required this.request});
  final CreateJoinRequest request;
}

class GetJoinRequestsEvent implements JoinRequestEvent {
  const GetJoinRequestsEvent({required this.page, required this.limit, this.status});
  final int page;
  final int limit;
  final String? status;
}

class GetJoinRequestByIdEvent implements JoinRequestEvent {
  const GetJoinRequestByIdEvent({required this.id});
  final String id;
}

class ApproveJoinRequestEvent implements JoinRequestEvent {
  const ApproveJoinRequestEvent({required this.id, required this.action});
  final String id;
  final JoinRequestAction action;
}

class DenyJoinRequestEvent implements JoinRequestEvent {
  const DenyJoinRequestEvent({required this.id, required this.action});
  final String id;
  final JoinRequestAction action;
}

class DeleteJoinRequestEvent implements JoinRequestEvent {
  const DeleteJoinRequestEvent({required this.id});
  final String id;
}

class ResetStateEvent implements JoinRequestEvent {
  const ResetStateEvent();
}