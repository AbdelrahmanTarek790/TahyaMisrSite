import 'package:equatable/equatable.dart';

class Position extends Equatable {
  final String id;
  final String name;
  final String? description;
  final bool isActive;
  final bool isGlobal;
  final String? governorate;
  final String? createdBy;
  final DateTime createdAt;
  final DateTime updatedAt;

  const Position({
    required this.id,
    required this.name,
    this.description,
    required this.isActive,
    required this.isGlobal,
    this.governorate,
    this.createdBy,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id,
        name,
        description,
        isActive,
        isGlobal,
        governorate,
        createdBy,
        createdAt,
        updatedAt,
      ];
}