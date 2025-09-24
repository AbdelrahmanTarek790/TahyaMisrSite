import 'package:json_annotation/json_annotation.dart';
import 'package:equatable/equatable.dart';

part 'user_management_model.g.dart';

@JsonSerializable()
class UserManagementModel extends Equatable {
  final String id;
  final String name;
  final String email;
  final String phone;
  final String university;
  final String governorate;
  final String role;
  final DateTime createdAt;
  final DateTime updatedAt;

  const UserManagementModel({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.university,
    required this.governorate,
    required this.role,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object> get props => [
        id,
        name,
        email,
        phone,
        university,
        governorate,
        role,
        createdAt,
        updatedAt,
      ];

  factory UserManagementModel.fromJson(Map<String, dynamic> json) {
    try {
      return UserManagementModel(
        id: json['_id'] ?? json['id'] ?? '',
        name: json['name'] ?? '',
        email: json['email'] ?? '',
        phone: json['phone'] ?? '',
        university: json['university'] ?? '',
        governorate: json['governorate'] ?? '',
        role: json['role'] ?? 'user',
        createdAt: json['createdAt'] != null 
            ? DateTime.parse(json['createdAt'])
            : DateTime.now(),
        updatedAt: json['updatedAt'] != null 
            ? DateTime.parse(json['updatedAt'])
            : DateTime.now(),
      );
    } catch (e) {
      return UserManagementModel(
        id: json['_id'] ?? json['id'] ?? '',
        name: json['name'] ?? 'Unknown User',
        email: json['email'] ?? '',
        phone: json['phone'] ?? '',
        university: json['university'] ?? '',
        governorate: json['governorate'] ?? '',
        role: json['role'] ?? 'user',
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );
    }
  }

  Map<String, dynamic> toJson() => _$UserManagementModelToJson(this);
}