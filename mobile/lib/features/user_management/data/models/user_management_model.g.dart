// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_management_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UserManagementModel _$UserManagementModelFromJson(Map<String, dynamic> json) =>
    UserManagementModel(
      id: json['id'] as String,
      name: json['name'] as String,
      email: json['email'] as String,
      phone: json['phone'] as String,
      university: json['university'] as String,
      governorate: json['governorate'] as String,
      role: json['role'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$UserManagementModelToJson(
        UserManagementModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'email': instance.email,
      'phone': instance.phone,
      'university': instance.university,
      'governorate': instance.governorate,
      'role': instance.role,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };
