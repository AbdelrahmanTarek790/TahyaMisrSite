// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UserModel _$UserModelFromJson(Map<String, dynamic> json) => UserModel(
      id: json['id'] as String,
      email: json['email'] as String,
      name: json['name'] as String,
      role: json['role'] as String,
      governorate: json['governorate'] as String?,
      phone: json['phone'] as String?,
      university: json['university'] as String?,
      nationalId: json['nationalId'] as String?,
      membershipNumber: json['membershipNumber'] as String?,
      membershipExpiry: json['membershipExpiry'] == null
          ? null
          : DateTime.parse(json['membershipExpiry'] as String),
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$UserModelToJson(UserModel instance) => <String, dynamic>{
      'id': instance.id,
      'email': instance.email,
      'name': instance.name,
      'role': instance.role,
      'governorate': instance.governorate,
      'phone': instance.phone,
      'university': instance.university,
      'nationalId': instance.nationalId,
      'membershipNumber': instance.membershipNumber,
      'membershipExpiry': instance.membershipExpiry?.toIso8601String(),
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };
