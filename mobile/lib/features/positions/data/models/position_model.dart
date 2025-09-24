import 'package:json_annotation/json_annotation.dart';
import 'package:equatable/equatable.dart';

part 'position_model.g.dart';

@JsonSerializable()
class PositionModel extends Equatable {
  final String id;
  final String name;
  final String? description;
  final bool isActive;
  final bool isGlobal;
  final String? governorate;
  final String? createdBy;
  final DateTime createdAt;
  final DateTime updatedAt;

  const PositionModel({
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

  factory PositionModel.fromJson(Map<String, dynamic> json) {
    try {
      return PositionModel(
        id: json['_id'] ?? json['id'] ?? '',
        name: json['name'] ?? '',
        description: json['description'],
        isActive: json['isActive'] ?? true,
        isGlobal: json['isGlobal'] ?? false,
        governorate: json['governorate'],
        createdBy: json['createdBy'] is Map 
            ? json['createdBy']['_id'] ?? json['createdBy']['id']
            : json['createdBy'],
        createdAt: json['createdAt'] != null 
            ? DateTime.parse(json['createdAt'])
            : DateTime.now(),
        updatedAt: json['updatedAt'] != null 
            ? DateTime.parse(json['updatedAt'])
            : DateTime.now(),
      );
    } catch (e) {
      // Fallback with default values to prevent crashes
      return PositionModel(
        id: json['_id'] ?? json['id'] ?? '',
        name: json['name'] ?? 'Unknown Position',
        description: json['description'],
        isActive: json['isActive'] ?? true,
        isGlobal: json['isGlobal'] ?? false,
        governorate: json['governorate'],
        createdBy: null,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );
    }
  }

  Map<String, dynamic> toJson() => _$PositionModelToJson(this);

  Map<String, dynamic> toCreateJson() => {
    'name': name,
    if (description != null) 'description': description,
    'isActive': isActive,
    'isGlobal': isGlobal,
    if (governorate != null) 'governorate': governorate,
  };
}