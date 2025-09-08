import 'package:equatable/equatable.dart';

class RecentActivity extends Equatable {
  final String id;
  final String type; // 'news', 'event', 'media', 'user'
  final String title;
  final String description;
  final DateTime timestamp;
  final String? imageUrl;

  const RecentActivity({
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
}