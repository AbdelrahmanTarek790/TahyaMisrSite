import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/news.dart';

part 'news_model.g.dart';

@JsonSerializable()
class NewsModel extends News {
  const NewsModel({
    required super.id,
    required super.title,
    required super.content,
    super.imageUrl,
    required super.createdAt,
    required super.updatedAt,
    required super.author,
  });

  factory NewsModel.fromJson(Map<String, dynamic> json) =>
      _$NewsModelFromJson(json);

  Map<String, dynamic> toJson() => _$NewsModelToJson(this);

  factory NewsModel.fromEntity(News news) {
    return NewsModel(
      id: news.id,
      title: news.title,
      content: news.content,
      imageUrl: news.imageUrl,
      createdAt: news.createdAt,
      updatedAt: news.updatedAt,
      author: news.author,
    );
  }
}