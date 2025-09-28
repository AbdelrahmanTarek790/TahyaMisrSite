import 'package:json_annotation/json_annotation.dart';
import 'package:equatable/equatable.dart';

part 'user_model.g.dart';

@JsonSerializable()
class UserModel extends Equatable {
  final String id;
  final String email;
  final String name;
  final String role;
  final String? governorate;
  final String? phone;
  final String? university;
  final String? nationalId;
  final String? membershipNumber;
  final DateTime? membershipExpiry;
  final DateTime createdAt;
  final DateTime updatedAt;

  const UserModel({
    required this.id,
    required this.email,
    required this.name,
    required this.role,
    this.governorate,
    this.phone,
    this.university,
    this.nationalId,
    this.membershipNumber,
    this.membershipExpiry,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
    id,
    email,
    name,
    role,
    governorate,
    phone,
    university,
    nationalId,
    membershipNumber,
    membershipExpiry,
    createdAt,
    updatedAt,
  ];

  factory UserModel.fromJson(Map<String, dynamic> jsonData) {
    final json = jsonData['user'] ?? jsonData;
    try {
      final userModel = UserModel(
        id: json['_id']?.toString() ?? json['id']?.toString() ?? 'unknown_id',
        email: json['email']?.toString() ?? '',
        name: json['name']?.toString() ?? '',
        role: json['role']?.toString() ?? '',
        governorate: json['governorate']?.toString(),
        phone: json['phone']?.toString(),
        university: json['university']?.toString(),
        nationalId: json['nationalId']?.toString(),
        membershipNumber: json['membershipNumber']?.toString(),
        membershipExpiry: json['membershipExpiry'] != null 
            ? DateTime.tryParse(json['membershipExpiry'].toString()) 
            : null,
        createdAt: _parseDateTime(json['createdAt']) ?? DateTime.now(),
        updatedAt: _parseDateTime(json['updatedAt']) ?? DateTime.now(),
      );
      
      print('Successfully parsed UserModel: id=${userModel.id}, email=${userModel.email}, role=${userModel.role}');
      return userModel;
    } catch (e) {
      print('Error parsing UserModel: $e');
      print('Fallback UserModel creation from json: $json');
      // If parsing fails, return a basic user object to prevent crashes
      return UserModel(
        id: json['_id']?.toString() ?? json['id']?.toString() ?? 'fallback_id',
        email: json['email']?.toString() ?? 'unknown@email.com',
        name: json['name']?.toString() ?? 'Unknown User',
        role: json['role']?.toString() ?? '',
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );
    }
  }

  static DateTime? _parseDateTime(dynamic value) {
    if (value == null) return null;
    try {
      return DateTime.parse(value.toString());
    } catch (e) {
      return null;
    }
  }

  Map<String, dynamic> toJson() => _$UserModelToJson(this);
}