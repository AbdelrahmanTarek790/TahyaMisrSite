import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/recent_activity.dart';

part 'recent_activity_model.g.dart';

@JsonSerializable()
class RecentActivityModel extends RecentActivity {
  const RecentActivityModel({
    required super.id,
    required super.type,
    required super.title,
    required super.description,
    required super.timestamp,
    super.imageUrl,
  });

  factory RecentActivityModel.fromJson(Map<String, dynamic> json) =>
      _$RecentActivityModelFromJson(json);

  Map<String, dynamic> toJson() => _$RecentActivityModelToJson(this);

  factory RecentActivityModel.fromEntity(RecentActivity activity) {
    return RecentActivityModel(
      id: activity.id,
      type: activity.type,
      title: activity.title,
      description: activity.description,
      timestamp: activity.timestamp,
      imageUrl: activity.imageUrl,
    );
  }
}