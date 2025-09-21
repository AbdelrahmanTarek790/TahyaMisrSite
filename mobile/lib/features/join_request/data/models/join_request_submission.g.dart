// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'join_request_submission.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

JoinRequestSubmission _$JoinRequestSubmissionFromJson(Map<String, dynamic> json) =>
    JoinRequestSubmission(
      name: json['name'] as String,
      email: json['email'] as String,
      phone: json['phone'] as String,
      nationalID: json['nationalID'] as String,
      governorate: json['governorate'] as String,
      position: json['position'] as String?,
      membershipNumber: json['membershipNumber'] as String?,
      role: json['role'] as String,
      notes: json['notes'] as String?,
    );

Map<String, dynamic> _$JoinRequestSubmissionToJson(JoinRequestSubmission instance) =>
    <String, dynamic>{
      'name': instance.name,
      'email': instance.email,
      'phone': instance.phone,
      'nationalID': instance.nationalID,
      'governorate': instance.governorate,
      'position': instance.position,
      'membershipNumber': instance.membershipNumber,
      'role': instance.role,
      'notes': instance.notes,
    };