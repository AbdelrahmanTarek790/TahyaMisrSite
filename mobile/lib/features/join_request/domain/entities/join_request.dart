import 'package:equatable/equatable.dart';

class JoinRequest extends Equatable {
  final String name;
  final String email;
  final String phone;
  final String nationalID;
  final String governorate;
  final String? position;
  final String? membershipNumber;
  final String role;
  final String? notes;
  final String status;
  final String? approvalNotes;

  const JoinRequest({
    required this.name,
    required this.email,
    required this.phone,
    required this.nationalID,
    required this.governorate,
    this.position,
    this.membershipNumber,
    required this.role,
    this.notes,
    this.status = 'pending',
    this.approvalNotes,
  });

  @override
  List<Object?> get props => [
        name,
        email,
        phone,
        nationalID,
        governorate,
        position,
        membershipNumber,
        role,
        notes,
        status,
        approvalNotes,
      ];

  bool get isPending => status == 'pending';
  bool get isApproved => status == 'approved';
  bool get isDenied => status == 'denied';
}