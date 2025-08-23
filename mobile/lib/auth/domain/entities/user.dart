import 'package:equatable/equatable.dart';

class User extends Equatable {
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

  const User({
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
}