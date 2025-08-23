import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/user.dart';

part 'user_model.g.dart';

@JsonSerializable()
class UserModel extends User {
  const UserModel({
    required super.id,
    required super.email,
    required super.name,
    required super.role,
    super.governorate,
    super.phone,
    super.university,
    super.nationalId,
    super.membershipNumber,
    super.membershipExpiry,
    required super.createdAt,
    required super.updatedAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
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

  factory UserModel.fromEntity(User user) {
    return UserModel(
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      governorate: user.governorate,
      phone: user.phone,
      university: user.university,
      nationalId: user.nationalId,
      membershipNumber: user.membershipNumber,
      membershipExpiry: user.membershipExpiry,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    );
  }
}