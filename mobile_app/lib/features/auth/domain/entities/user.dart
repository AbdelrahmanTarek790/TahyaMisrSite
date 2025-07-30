import 'package:equatable/equatable.dart';

class User extends Equatable {
  final String id;
  final String email;
  final String name;
  final String role;
  final String? governorate;
  final String? phoneNumber;
  final DateTime createdAt;
  final DateTime updatedAt;

  const User({
    required this.id,
    required this.email,
    required this.name,
    required this.role,
    this.governorate,
    this.phoneNumber,
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
    phoneNumber,
    createdAt,
    updatedAt,
  ];
}