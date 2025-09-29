// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'join_request_create_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

JoinRequestCreateRequest _$JoinRequestCreateRequestFromJson(
        Map<String, dynamic> json) =>
    JoinRequestCreateRequest(
      name: json['name'] as String,
      email: json['email'] as String,
      phone: json['phone'] as String,
      nationalId: json['nationalID'] as String,
      governorate: json['governorate'] as String,
      position: json['position'] as String?,
      membershipNumber: json['membershipNumber'] as String?,
      role: json['role'] as String,
      notes: json['notes'] as String?,
    );

Map<String, dynamic> _$JoinRequestCreateRequestToJson(
        JoinRequestCreateRequest instance) =>
    <String, dynamic>{
      'name': instance.name,
      'email': instance.email,
      'phone': instance.phone,
      'nationalID': instance.nationalId,
      'governorate': instance.governorate,
      'position': instance.position,
      'membershipNumber': instance.membershipNumber,
      'role': instance.role,
      'notes': instance.notes,
    };