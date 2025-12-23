import 'package:equatable/equatable.dart';

class ActivityModel extends Equatable {
  final String id;
  final String title;
  final String? image;
  final String color;
  final int order;
  final bool isActive;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String? createdBy;

  const ActivityModel({
    required this.id,
    required this.title,
    this.image,
    required this.color,
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
        image,
        color,
        order,
        isActive,
        createdAt,
        updatedAt,
        createdBy,
      ];

  factory ActivityModel.fromJson(Map<String, dynamic> json) {
    try {
      // Handle the backend response format
      final id = json['_id'] as String? ?? json['id'] as String? ?? '';
      final title = json['title'] as String? ?? '';

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

      final color = json['color'] as String? ??
          'bg-gradient-to-br from-egypt-red to-egypt-gold';
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

      return ActivityModel(
        id: id,
        title: title,
        image: image,
        color: color,
        order: order,
        isActive: isActive,
        createdAt: createdAt,
        updatedAt: updatedAt,
        createdBy: createdBy,
      );
    } catch (e) {
      print('Error parsing ActivityModel: $e');
      print('JSON data: $json');
      rethrow;
    }
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'title': title,
      'image': image,
      'color': color,
      'order': order,
      'isActive': isActive,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      if (createdBy != null) 'createdBy': createdBy,
    };
  }

  ActivityModel copyWith({
    String? id,
    String? title,
    String? image,
    String? color,
    int? order,
    bool? isActive,
    DateTime? createdAt,
    DateTime? updatedAt,
    String? createdBy,
  }) {
    return ActivityModel(
      id: id ?? this.id,
      title: title ?? this.title,
      image: image ?? this.image,
      color: color ?? this.color,
      order: order ?? this.order,
      isActive: isActive ?? this.isActive,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      createdBy: createdBy ?? this.createdBy,
    );
  }
}
