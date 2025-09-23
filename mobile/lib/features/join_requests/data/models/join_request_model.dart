import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/join_request.dart';

part 'join_request_model.g.dart';

@JsonSerializable()
class JoinRequestModel extends JoinRequest {
  const JoinRequestModel({
    required super.id,
    required super.name,
    required super.email,
    required super.phone,
    required super.nationalID,
    required super.governorate,
    super.position,
    super.membershipNumber,
    required super.role,
    required super.status,
    super.notes,
    super.reviewedBy,
    super.reviewedAt,
    super.approvalNotes,
    required super.createdAt,
    required super.updatedAt,
  });

  factory JoinRequestModel.fromJson(Map<String, dynamic> json) {
    try {
      final id = json['_id'] as String? ?? json['id'] as String? ?? '';
      final name = json['name'] as String? ?? '';
      final email = json['email'] as String? ?? '';
      final phone = json['phone'] as String? ?? '';
      final nationalID = json['nationalID'] as String? ?? '';
      final governorate = json['governorate'] as String? ?? '';
      final membershipNumber = json['membershipNumber'] as String?;
      final role = json['role'] as String? ?? 'member';
      final status = json['status'] as String? ?? 'pending';
      final notes = json['notes'] as String?;
      final approvalNotes = json['approvalNotes'] as String?;
      
      // Handle position field
      String? position;
      if (json['position'] != null) {
        if (json['position'] is Map<String, dynamic>) {
          position = (json['position'] as Map<String, dynamic>)['name'] as String?;
        } else {
          position = json['position'].toString();
        }
      }
      
      // Handle reviewedBy field
      String? reviewedBy;
      if (json['reviewedBy'] != null) {
        if (json['reviewedBy'] is Map<String, dynamic>) {
          reviewedBy = (json['reviewedBy'] as Map<String, dynamic>)['name'] as String?;
        } else {
          reviewedBy = json['reviewedBy'].toString();
        }
      }
      
      // Handle dates
      final createdAt = DateTime.parse(json['createdAt'] as String? ?? DateTime.now().toIso8601String());
      final updatedAt = DateTime.parse(json['updatedAt'] as String? ?? DateTime.now().toIso8601String());
      
      DateTime? reviewedAt;
      if (json['reviewedAt'] != null) {
        reviewedAt = DateTime.parse(json['reviewedAt'] as String);
      }

      return JoinRequestModel(
        id: id,
        name: name,
        email: email,
        phone: phone,
        nationalID: nationalID,
        governorate: governorate,
        position: position,
        membershipNumber: membershipNumber,
        role: role,
        status: status,
        notes: notes,
        reviewedBy: reviewedBy,
        reviewedAt: reviewedAt,
        approvalNotes: approvalNotes,
        createdAt: createdAt,
        updatedAt: updatedAt,
      );
    } catch (e) {
      throw FormatException('Failed to parse join request: $e');
    }
  }

  Map<String, dynamic> toJson() => _$JoinRequestModelToJson(this);
}