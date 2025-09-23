import 'package:json_annotation/json_annotation.dart';

part 'create_join_request.g.dart';

@JsonSerializable()
class CreateJoinRequest {
  final String name;
  final String email;
  final String phone;
  final String nationalID;
  final String governorate;
  final String? position;
  final String? membershipNumber;
  final String role;
  final String? notes;

  const CreateJoinRequest({
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

  factory CreateJoinRequest.fromJson(Map<String, dynamic> json) =>
      _$CreateJoinRequestFromJson(json);

  Map<String, dynamic> toJson() => _$CreateJoinRequestToJson(this);
}