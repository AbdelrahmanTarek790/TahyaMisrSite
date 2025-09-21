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
      nationalID: json['nationalID'] as String,
      governorate: json['governorate'] as String,
      position: json['position'] as String?,
      membershipNumber: json['membershipNumber'] as String?,
      role: json['role'] as String,
      notes: json['notes'] as String?,
      status: json['status'] as String? ?? 'pending',
      approvalNotes: json['approvalNotes'] as String?,
      createdAt: json['createdAt'] as String?,
      updatedAt: json['updatedAt'] as String?,
      reviewedBy: json['reviewedBy'] as Map<String, dynamic>?,
      reviewedAt: json['reviewedAt'] as String?,
    );

Map<String, dynamic> _$JoinRequestModelToJson(JoinRequestModel instance) =>
    <String, dynamic>{
      '_id': instance.id,
      'name': instance.name,
      'email': instance.email,
      'phone': instance.phone,
      'nationalID': instance.nationalID,
      'governorate': instance.governorate,
      'position': instance.position,
      'membershipNumber': instance.membershipNumber,
      'role': instance.role,
      'notes': instance.notes,
      'status': instance.status,
      'approvalNotes': instance.approvalNotes,
      'createdAt': instance.createdAt,
      'updatedAt': instance.updatedAt,
      'reviewedBy': instance.reviewedBy,
      'reviewedAt': instance.reviewedAt,
    };