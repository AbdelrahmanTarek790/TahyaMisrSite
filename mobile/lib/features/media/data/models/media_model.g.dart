// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'media_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

MediaModel _$MediaModelFromJson(Map<String, dynamic> json) => MediaModel(
      id: json['id'] as String,
      type: json['type'] as String,
      url: json['url'] as String,
      caption: json['caption'] as String?,
      thumbnailUrl: json['thumbnailUrl'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      uploadedBy: json['uploadedBy'] as String?,
    );

Map<String, dynamic> _$MediaModelToJson(MediaModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'type': instance.type,
      'url': instance.url,
      'caption': instance.caption,
      'thumbnailUrl': instance.thumbnailUrl,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
      'uploadedBy': instance.uploadedBy,
    };
