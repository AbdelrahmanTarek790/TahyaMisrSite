import '../../../../core/constants/app_constants.dart';
import '../../domain/entities/news.dart';

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

  factory NewsModel.fromJson(Map<String, dynamic> json) {
    try {
      // Handle the backend response format
      final id = json['_id'] as String? ?? json['id'] as String? ?? '';
      final title = json['title'] as String? ?? '';
      final content = json['content'] as String? ?? '';
      
      // Handle image field - backend uses 'image', mobile expects 'imageUrl'
      final imageUrl ='https://form.codepeak.software/uploads/'+json['image'] as String? ??'https://form.codepeak.software/uploads/'+json['image']  as String?;
      
      // Handle createdBy field - extract name from populated object or use fallback
      String author = '';
      if (json['createdBy'] != null) {
        if (json['createdBy'] is Map<String, dynamic>) {
          author = (json['createdBy'] as Map<String, dynamic>)['name'] as String? ?? 'Unknown Author';
        } else {
          author = json['createdBy'].toString();
        }
      } else if (json['author'] != null) {
        author = json['author'] as String? ?? 'Unknown Author';
      } else {
        author = 'Unknown Author';
      }
      
      // Handle dates with fallback
      final createdAt = json['createdAt'] != null 
          ? DateTime.tryParse(json['createdAt'] as String) ?? DateTime.now()
          : DateTime.now();
      final updatedAt = json['updatedAt'] != null 
          ? DateTime.tryParse(json['updatedAt'] as String) ?? DateTime.now()
          : DateTime.now();

      return NewsModel(
        id: id,
        title: title,
        content: content,
        imageUrl: imageUrl,
        createdAt: createdAt,
        updatedAt: updatedAt,
        author: author,
      );
    } catch (e) {
      // Fallback to prevent null casting errors
      return NewsModel(
        id: json['_id']?.toString() ?? json['id']?.toString() ?? '',
        title: json['title']?.toString() ?? '',
        content: json['content']?.toString() ?? '',
        imageUrl: 'https://form.codepeak.software/uploads/'+json['image'],
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
        author: 'Unknown Author',
      );
    }
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'content': content,
    'imageUrl': imageUrl,
    'createdAt': createdAt.toIso8601String(),
    'updatedAt': updatedAt.toIso8601String(),
    'author': author,
  };

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