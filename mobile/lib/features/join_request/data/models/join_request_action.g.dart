// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'join_request_action.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

JoinRequestAction _$JoinRequestActionFromJson(Map<String, dynamic> json) =>
    JoinRequestAction(
      notes: json['notes'] as String,
      university: json['university'] as String?,
      membershipExpiry: json['membershipExpiry'] as String?,
    );

Map<String, dynamic> _$JoinRequestActionToJson(JoinRequestAction instance) =>
    <String, dynamic>{
      'notes': instance.notes,
      'university': instance.university,
      'membershipExpiry': instance.membershipExpiry,
    };