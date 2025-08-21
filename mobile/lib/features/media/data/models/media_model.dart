import 'package:json_annotation/json_annotation.dart';

part 'media_model.g.dart';

@JsonSerializable()
class MediaModel {
  final String id;
  final String type; // 'image' or 'video'
  final String url;
  final String? caption;
  final String? thumbnailUrl;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String uploadedBy;

  MediaModel({
    required this.id,
    required this.type,
    required this.url,
    this.caption,
    this.thumbnailUrl,
    required this.createdAt,
    required this.updatedAt,
    required this.uploadedBy,
  });

  factory MediaModel.fromJson(Map<String, dynamic> json) =>
      _$MediaModelFromJson(json);

  Map<String, dynamic> toJson() => _$MediaModelToJson(this);
}