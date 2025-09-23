import 'package:equatable/equatable.dart';

class JoinRequest extends Equatable {
  final String id;
  final String name;
  final String email;
  final String phone;
  final String nationalID;
  final String governorate;
  final String? position;
  final String? membershipNumber;
  final String role;
  final String status;
  final String? notes;
  final String? reviewedBy;
  final DateTime? reviewedAt;
  final String? approvalNotes;
  final DateTime createdAt;
  final DateTime updatedAt;

  const JoinRequest({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.nationalID,
    required this.governorate,
    this.position,
    this.membershipNumber,
    required this.role,
    required this.status,
    this.notes,
    this.reviewedBy,
    this.reviewedAt,
    this.approvalNotes,
    required this.createdAt,
    required this.updatedAt,
  });

  bool get isPending => status == 'pending';
  bool get isApproved => status == 'approved';
  bool get isDenied => status == 'denied';

  @override
  List<Object?> get props => [
        id,
        name,
        email,
        phone,
        nationalID,
        governorate,
        position,
        membershipNumber,
        role,
        status,
        notes,
        reviewedBy,
        reviewedAt,
        approvalNotes,
        createdAt,
        updatedAt,
      ];
}