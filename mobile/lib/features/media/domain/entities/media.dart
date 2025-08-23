import 'package:equatable/equatable.dart';

class Media extends Equatable {
  final String id;
  final String type; // 'photo' or 'video'
  final String url;
  final String? caption;
  final String? thumbnailUrl;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String? uploadedBy;

  const Media({
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
}