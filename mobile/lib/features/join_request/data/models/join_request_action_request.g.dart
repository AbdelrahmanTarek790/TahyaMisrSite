// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'join_request_action_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

JoinRequestActionRequest _$JoinRequestActionRequestFromJson(
        Map<String, dynamic> json) =>
    JoinRequestActionRequest(
      notes: json['notes'] as String,
      university: json['university'] as String?,
      membershipExpiry: json['membershipExpiry'] == null
          ? null
          : DateTime.parse(json['membershipExpiry'] as String),
    );

Map<String, dynamic> _$JoinRequestActionRequestToJson(
        JoinRequestActionRequest instance) =>
    <String, dynamic>{
      'notes': instance.notes,
      'university': instance.university,
      'membershipExpiry': instance.membershipExpiry?.toIso8601String(),
    };