import 'package:json_annotation/json_annotation.dart';
import 'package:equatable/equatable.dart';

part 'recent_activity_model.g.dart';

@JsonSerializable()
class RecentActivityModel extends Equatable {
  final String id;
  final String type; // 'news', 'event', 'media', 'user'
  final String title;
  final String description;
  final DateTime timestamp;
  final String? imageUrl;

  const RecentActivityModel({
    required this.id,
    required this.type,
    required this.title,
    required this.description,
    required this.timestamp,
    this.imageUrl,
  });

  @override
  List<Object?> get props => [
    id,
    type,
    title,
    description,
    timestamp,
    imageUrl,
  ];

  factory RecentActivityModel.fromJson(Map<String, dynamic> json) =>
      _$RecentActivityModelFromJson(json);

  Map<String, dynamic> toJson() => _$RecentActivityModelToJson(this);
}