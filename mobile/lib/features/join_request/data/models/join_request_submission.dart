import 'package:json_annotation/json_annotation.dart';

part 'join_request_submission.g.dart';

@JsonSerializable()
class JoinRequestSubmission {
  final String name;
  final String email;
  final String phone;
  final String nationalID;
  final String governorate;
  final String? position;
  final String? membershipNumber;
  final String role;
  final String? notes;

  const JoinRequestSubmission({
    required this.name,
    required this.email,
    required this.phone,
    required this.nationalID,
    required this.governorate,
    this.position,
    this.membershipNumber,
    required this.role,
    this.notes,
  });

  factory JoinRequestSubmission.fromJson(Map<String, dynamic> json) =>
      _$JoinRequestSubmissionFromJson(json);

  Map<String, dynamic> toJson() => _$JoinRequestSubmissionToJson(this);
}