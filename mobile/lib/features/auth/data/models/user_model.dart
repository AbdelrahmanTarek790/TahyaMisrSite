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
    // Handle backend response format
    final position = json['position'];
    final role = position is Map<String, dynamic> 
        ? position['name'] as String? ?? 'Student'
        : position?.toString() ?? 'Student';

    return UserModel(
      id: json['_id']?.toString() ?? json['id']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      role: role,
      governorate: json['governorate']?.toString(),
      phone: json['phone']?.toString(),
      university: json['university']?.toString(),
      nationalId: json['nationalId']?.toString(),
      membershipNumber: json['membershipNumber']?.toString(),
      membershipExpiry: json['membershipExpiry'] != null 
          ? DateTime.tryParse(json['membershipExpiry'].toString()) 
          : null,
      createdAt: DateTime.tryParse(json['createdAt']?.toString() ?? '') ?? DateTime.now(),
      updatedAt: DateTime.tryParse(json['updatedAt']?.toString() ?? '') ?? DateTime.now(),
    );
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