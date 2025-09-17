// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'register_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

RegisterRequest _$RegisterRequestFromJson(Map<String, dynamic> json) =>
    RegisterRequest(
      name: json['name'] as String,
      email: json['email'] as String,
      password: json['password'] as String,
      phone: json['phone'] as String,
      university: json['university'] as String,
      nationalId: json['nationalId'] as String,
      governorate: json['governorate'] as String,
      membershipNumber: json['membershipNumber'] as String? ?? '',
    );

Map<String, dynamic> _$RegisterRequestToJson(RegisterRequest instance) =>
    <String, dynamic>{
      'name': instance.name,
      'email': instance.email,
      'password': instance.password,
      'phone': instance.phone,
      'university': instance.university,
      'nationalId': instance.nationalId,
      'governorate': instance.governorate,
      'membershipNumber': instance.membershipNumber,
    };
