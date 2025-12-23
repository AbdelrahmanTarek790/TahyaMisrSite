import 'package:equatable/equatable.dart';

class AchievementModel extends Equatable {
  final String id;
  final String title;
  final String description;
  final List<String> highlights;
  final String color;
  final String? image;
  final String icon;
  final int order;
  final bool isActive;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String? createdBy;

  const AchievementModel({
    required this.id,
    required this.title,
    required this.description,
    required this.highlights,
    required this.color,
    this.image,
    required this.icon,
    required this.order,
    required this.isActive,
    required this.createdAt,
    required this.updatedAt,
    this.createdBy,
  });

  @override
  List<Object?> get props => [
        id,
        title,
        description,
        highlights,
        color,
        image,
        icon,
        order,
        isActive,
        createdAt,
        updatedAt,
        createdBy,
      ];

  factory AchievementModel.fromJson(Map<String, dynamic> json) {
    try {
      // Handle the backend response format
      final id = json['_id'] as String? ?? json['id'] as String? ?? '';
      final title = json['title'] as String? ?? '';
      final description = json['description'] as String? ?? '';

      // Handle highlights array
      List<String> highlights = [];
      if (json['highlights'] != null) {
        final highlightsList = json['highlights'] as List<dynamic>? ?? [];
        highlights = highlightsList.map((h) => h.toString()).toList();
      }

      // Handle image field
      String? image;
      if (json['image'] != null && json['image'].toString().isNotEmpty) {
        final imageValue = json['image'] as String;
        if (imageValue.startsWith('http')) {
          image = imageValue;
        } else if (imageValue.startsWith('/uploads/')) {
          image = 'https://form.codepeak.software$imageValue';
        } else {
          image = 'https://form.codepeak.software/uploads/$imageValue';
        }
      }

      final color = json['color'] as String? ?? 'text-egypt-gold';
      final icon = json['icon'] as String? ?? 'Award';
      final order = json['order'] as int? ?? 0;
      final isActive = json['isActive'] as bool? ?? true;

      // Handle createdBy field - extract name from populated object or use fallback
      String? createdBy;
      if (json['createdBy'] != null) {
        if (json['createdBy'] is Map<String, dynamic>) {
          createdBy =
              (json['createdBy'] as Map<String, dynamic>)['name'] as String?;
        } else {
          createdBy = json['createdBy'].toString();
        }
      }

      final createdAt = json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'] as String) ?? DateTime.now()
          : DateTime.now();

      final updatedAt = json['updatedAt'] != null
          ? DateTime.tryParse(json['updatedAt'] as String) ?? DateTime.now()
          : DateTime.now();

      return AchievementModel(
        id: id,
        title: title,
        description: description,
        highlights: highlights,
        color: color,
        image: image,
        icon: icon,
        order: order,
        isActive: isActive,
        createdAt: createdAt,
        updatedAt: updatedAt,
        createdBy: createdBy,
      );
    } catch (e) {
      print('Error parsing AchievementModel: $e');
      print('JSON data: $json');
      rethrow;
    }
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'title': title,
      'description': description,
      'highlights': highlights,
      'color': color,
      'image': image,
      'icon': icon,
      'order': order,
      'isActive': isActive,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      if (createdBy != null) 'createdBy': createdBy,
    };
  }

  AchievementModel copyWith({
    String? id,
    String? title,
    String? description,
    List<String>? highlights,
    String? color,
    String? image,
    String? icon,
    int? order,
    bool? isActive,
    DateTime? createdAt,
    DateTime? updatedAt,
    String? createdBy,
  }) {
    return AchievementModel(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      highlights: highlights ?? this.highlights,
      color: color ?? this.color,
      image: image ?? this.image,
      icon: icon ?? this.icon,
      order: order ?? this.order,
      isActive: isActive ?? this.isActive,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      createdBy: createdBy ?? this.createdBy,
    );
  }
}
