import 'package:json_annotation/json_annotation.dart';

part 'event_model.g.dart';

@JsonSerializable()
class EventModel {
  final String id;
  final String title;
  final String description;
  final String? imageUrl;
  final DateTime eventDate;
  final String location;
  final DateTime createdAt;
  final DateTime updatedAt;
  final List<String> registeredUsers;

  EventModel({
    required this.id,
    required this.title,
    required this.description,
    this.imageUrl,
    required this.eventDate,
    required this.location,
    required this.createdAt,
    required this.updatedAt,
    required this.registeredUsers,
  });

  factory EventModel.fromJson(Map<String, dynamic> json) =>
      _$EventModelFromJson(json);

  Map<String, dynamic> toJson() => _$EventModelToJson(this);
}