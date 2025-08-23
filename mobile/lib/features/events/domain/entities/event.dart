import 'package:equatable/equatable.dart';

class Event extends Equatable {
  final String id;
  final String title;
  final String description;
  final String? imageUrl;
  final DateTime eventDate;
  final String location;
  final DateTime createdAt;
  final DateTime updatedAt;
  final List<String> registeredUsers;
  final String? createdBy;

  const Event({
    required this.id,
    required this.title,
    required this.description,
    this.imageUrl,
    required this.eventDate,
    required this.location,
    required this.createdAt,
    required this.updatedAt,
    required this.registeredUsers,
    this.createdBy,
  });

  @override
  List<Object?> get props => [
    id,
    title,
    description,
    imageUrl,
    eventDate,
    location,
    createdAt,
    updatedAt,
    registeredUsers,
    createdBy,
  ];
}