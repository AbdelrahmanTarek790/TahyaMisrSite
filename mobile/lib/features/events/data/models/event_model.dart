import '../../domain/entities/event.dart';

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

  factory EventModel.fromJson(Map<String, dynamic> json) {
    try {
      // Handle the backend response format
      final id = json['_id'] as String? ?? json['id'] as String? ?? '';
      final title = json['title'] as String? ?? '';
      final description = json['description'] as String? ?? '';
      
      // Handle image field - backend uses 'image', mobile expects 'imageUrl'
      final imageUrl ='https://form.codepeak.software/uploads/${json['image']}' as String? ??'https://form.codepeak.software/uploads/${json['image']}'  as String?;


      // Handle event date - backend uses 'date', mobile expects 'eventDate'
      final eventDate = json['date'] != null 
          ? DateTime.tryParse(json['date'] as String) ?? DateTime.now()
          : json['eventDate'] != null
              ? DateTime.tryParse(json['eventDate'] as String) ?? DateTime.now()
              : DateTime.now();
              
      final location = json['location'] as String? ?? '';
      
      // Handle createdBy field - extract name from populated object or use fallback
      String? createdBy;
      if (json['createdBy'] != null) {
        if (json['createdBy'] is Map<String, dynamic>) {
          createdBy = (json['createdBy'] as Map<String, dynamic>)['name'] as String?;
        } else {
          createdBy = json['createdBy'].toString();
        }
      }
      
      // Handle registeredUsers - extract user IDs from populated objects or use directly
      List<String> registeredUsers = [];
      if (json['registeredUsers'] != null) {
        final users = json['registeredUsers'] as List<dynamic>? ?? [];
        registeredUsers = users.map((user) {
          if (user is Map<String, dynamic>) {
            return user['_id']?.toString() ?? user['id']?.toString() ?? '';
          } else {
            return user.toString();
          }
        }).where((id) => id.isNotEmpty).toList();
      }
      
      // Handle dates with fallback
      final createdAt = json['createdAt'] != null 
          ? DateTime.tryParse(json['createdAt'] as String) ?? DateTime.now()
          : DateTime.now();
      final updatedAt = json['updatedAt'] != null 
          ? DateTime.tryParse(json['updatedAt'] as String) ?? DateTime.now()
          : DateTime.now();

      return EventModel(
        id: id,
        title: title,
        description: description,
        imageUrl: imageUrl,
        eventDate: eventDate,
        location: location,
        createdAt: createdAt,
        updatedAt: updatedAt,
        registeredUsers: registeredUsers,
        createdBy: createdBy,
      );
    } catch (e) {
      // Fallback to prevent null casting errors
      return EventModel(
        id: json['_id']?.toString() ?? json['id']?.toString() ?? '',
        title: json['title']?.toString() ?? '',
        description: json['description']?.toString() ?? '',
        imageUrl: json['image']?.toString() ?? json['imageUrl']?.toString(),
        eventDate: DateTime.now(),
        location: json['location']?.toString() ?? '',
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
        registeredUsers: const [],
        createdBy: null,
      );
    }
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'description': description,
    'imageUrl': imageUrl,
    'eventDate': eventDate.toIso8601String(),
    'location': location,
    'createdAt': createdAt.toIso8601String(),
    'updatedAt': updatedAt.toIso8601String(),
    'registeredUsers': registeredUsers,
    'createdBy': createdBy,
  };

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