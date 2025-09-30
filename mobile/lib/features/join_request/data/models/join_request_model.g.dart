// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'join_request_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

JoinRequestModel _$JoinRequestModelFromJson(Map<String, dynamic> json) =>
    JoinRequestModel(
      id: json['_id'] as String?,
      name: json['name'] as String,
      email: json['email'] as String,
      phone: json['phone'] as String,
      nationalId: json['nationalID'] as String,
      governorate: json['governorate'] as String,
      position: json['position'] as String?,
      membershipNumber: json['membershipNumber'] as String?,
      role: json['role'] as String,
      status: json['status'] as String,
      notes: json['notes'] as String?,
      reviewedBy: JoinRequestModel._reviewedByFromJson(json['reviewedBy']),
      reviewedAt: json['reviewedAt'] == null
          ? null
          : DateTime.parse(json['reviewedAt'] as String),
      approvalNotes: json['approvalNotes'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$JoinRequestModelToJson(JoinRequestModel instance) =>
    <String, dynamic>{
      '_id': instance.id,
      'name': instance.name,
      'email': instance.email,
      'phone': instance.phone,
      'nationalID': instance.nationalId,
      'governorate': instance.governorate,
      'position': instance.position,
      'membershipNumber': instance.membershipNumber,
      'role': instance.role,
      'status': instance.status,
      'notes': instance.notes,
      'reviewedBy': JoinRequestModel._reviewedByToJson(instance.reviewedBy),
      'reviewedAt': instance.reviewedAt?.toIso8601String(),
      'approvalNotes': instance.approvalNotes,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };
