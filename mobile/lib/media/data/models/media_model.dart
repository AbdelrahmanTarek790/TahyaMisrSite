import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/media.dart';

part 'media_model.g.dart';

@JsonSerializable()
class MediaModel extends Media {
  const MediaModel({
    required super.id,
    required super.type,
    required super.url,
    super.caption,
    super.thumbnailUrl,
    required super.createdAt,
    required super.updatedAt,
    super.uploadedBy,
  });

  factory MediaModel.fromJson(Map<String, dynamic> json) =>
      _$MediaModelFromJson(json);

  Map<String, dynamic> toJson() => _$MediaModelToJson(this);

  factory MediaModel.fromEntity(Media media) {
    return MediaModel(
      id: media.id,
      type: media.type,
      url: media.url,
      caption: media.caption,
      thumbnailUrl: media.thumbnailUrl,
      createdAt: media.createdAt,
      updatedAt: media.updatedAt,
      uploadedBy: media.uploadedBy,
    );
  }
}