import 'package:json_annotation/json_annotation.dart';

part 'join_request_action.g.dart';

@JsonSerializable()
class JoinRequestAction {
  final String notes;
  final String? university;
  final String? membershipExpiry;

  const JoinRequestAction({
    required this.notes,
    this.university,
    this.membershipExpiry,
  });

  factory JoinRequestAction.fromJson(Map<String, dynamic> json) =>
      _$JoinRequestActionFromJson(json);

  Map<String, dynamic> toJson() => _$JoinRequestActionToJson(this);
}