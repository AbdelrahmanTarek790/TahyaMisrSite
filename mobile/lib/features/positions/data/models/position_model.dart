import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/position.dart';

part 'position_model.g.dart';

@JsonSerializable()
class PositionModel extends Position {
  const PositionModel({
    required super.id,
    required super.name,
    super.description,
    required super.isActive,
    required super.isGlobal,
    super.governorate,
    super.createdBy,
    required super.createdAt,
    required super.updatedAt,
  });

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