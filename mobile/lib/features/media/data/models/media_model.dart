import 'package:json_annotation/json_annotation.dart';
import 'package:equatable/equatable.dart';

part 'media_model.g.dart';

@JsonSerializable()
class MediaModel extends Equatable {
  final String id;
  final String type; // 'photo' or 'video'
  final String url;
  final String? caption;
  final String? thumbnailUrl;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String? uploadedBy;

  const MediaModel({
    required this.id,
    required this.type,
    required this.url,
    this.caption,
    this.thumbnailUrl,
    required this.createdAt,
    required this.updatedAt,
    this.uploadedBy,
  });

  @override
  List<Object?> get props => [
    id,
    type,
    url,
    caption,
    thumbnailUrl,
    createdAt,
    updatedAt,
    uploadedBy,
  ];

  factory MediaModel.fromJson(Map<String, dynamic> json) =>
      _$MediaModelFromJson(json);

  Map<String, dynamic> toJson() => _$MediaModelToJson(this);
}