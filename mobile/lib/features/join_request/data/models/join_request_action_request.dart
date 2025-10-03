import 'package:json_annotation/json_annotation.dart';

part 'join_request_action_request.g.dart';

@JsonSerializable()
class JoinRequestActionRequest {
  final String notes;
  final String? university;
  final DateTime? membershipExpiry;

  JoinRequestActionRequest({
    required this.notes,
    this.university,
    this.membershipExpiry,
  });

  factory JoinRequestActionRequest.fromJson(Map<String, dynamic> json) =>
      _$JoinRequestActionRequestFromJson(json);

  Map<String, dynamic> toJson() => _$JoinRequestActionRequestToJson(this);
}