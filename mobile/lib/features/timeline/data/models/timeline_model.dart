import 'package:equatable/equatable.dart';

class TimelineModel extends Equatable {
  final String id;
  final String year;
  final String title;
  final String description;
  final String achievement;
  final int order;
  final DateTime createdAt;
  final DateTime updatedAt;

  const TimelineModel({
    required this.id,
    required this.year,
    required this.title,
    required this.description,
    required this.achievement,
    required this.order,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id,
        year,
        title,
        description,
        achievement,
        order,
        createdAt,
        updatedAt,
      ];

  factory TimelineModel.fromJson(Map<String, dynamic> json) {
    try {
      // Handle the backend response format
      final id = json['_id'] as String? ?? json['id'] as String? ?? '';
      final year = json['year'] as String? ?? '';
      final title = json['title'] as String? ?? '';
      final description = json['description'] as String? ?? '';
      final achievement = json['achievement'] as String? ?? '';
      final order = json['order'] as int? ?? 0;

      // Handle dates with fallback
      final createdAt = json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'] as String) ?? DateTime.now()
          : DateTime.now();
      final updatedAt = json['updatedAt'] != null
          ? DateTime.tryParse(json['updatedAt'] as String) ?? DateTime.now()
          : DateTime.now();

      return TimelineModel(
        id: id,
        year: year,
        title: title,
        description: description,
        achievement: achievement,
        order: order,
        createdAt: createdAt,
        updatedAt: updatedAt,
      );
    } catch (e) {
      // Fallback to prevent null casting errors
      return TimelineModel(
        id: json['_id']?.toString() ?? json['id']?.toString() ?? '',
        year: json['year']?.toString() ?? '',
        title: json['title']?.toString() ?? '',
        description: json['description']?.toString() ?? '',
        achievement: json['achievement']?.toString() ?? '',
        order: int.tryParse(json['order']?.toString() ?? '0') ?? 0,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );
    }
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'year': year,
      'title': title,
      'description': description,
      'achievement': achievement,
      'order': order,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}

