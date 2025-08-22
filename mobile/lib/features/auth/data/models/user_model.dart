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

  factory UserModel.fromJson(Map<String, dynamic> json) =>
      _$UserModelFromJson(json);

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