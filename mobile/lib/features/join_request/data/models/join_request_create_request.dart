import 'package:json_annotation/json_annotation.dart';

part 'join_request_create_request.g.dart';

@JsonSerializable()
class JoinRequestCreateRequest {
  final String name;
  final String email;
  final String phone;
  @JsonKey(name: 'nationalID')
  final String nationalId;
  final String governorate;
  final String? position;
  final String? membershipNumber;
  final String role;
  final String? notes;

  JoinRequestCreateRequest({
    required this.name,
    required this.email,
    required this.phone,
    required this.nationalId,
    required this.governorate,
    this.position,
    this.membershipNumber,
    required this.role,
    this.notes,
  });

  factory JoinRequestCreateRequest.fromJson(Map<String, dynamic> json) =>
      _$JoinRequestCreateRequestFromJson(json);

  Map<String, dynamic> toJson() => _$JoinRequestCreateRequestToJson(this);
}