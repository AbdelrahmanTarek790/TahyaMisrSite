import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/event.dart';

part 'event_model.g.dart';

@JsonSerializable()
class EventModel extends Event {
  const EventModel({
    required super.id,
    required super.title,
    required super.description,
    super.imageUrl,
    required super.eventDate,
    required super.location,
    required super.createdAt,
    required super.updatedAt,
    required super.registeredUsers,
    super.createdBy,
  });

  factory EventModel.fromJson(Map<String, dynamic> json) =>
      _$EventModelFromJson(json);

  Map<String, dynamic> toJson() => _$EventModelToJson(this);

  factory EventModel.fromEntity(Event event) {
    return EventModel(
      id: event.id,
      title: event.title,
      description: event.description,
      imageUrl: event.imageUrl,
      eventDate: event.eventDate,
      location: event.location,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      registeredUsers: event.registeredUsers,
      createdBy: event.createdBy,
    );
  }
}