import 'package:json_annotation/json_annotation.dart';

part 'join_request_model.g.dart';

@JsonSerializable()
class JoinRequestModel {
  @JsonKey(name: '_id')
  final String? id;
  final String name;
  final String email;
  final String phone;
  @JsonKey(name: 'nationalID')
  final String nationalId;
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

  JoinRequestModel({
    this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.nationalId,
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

  factory JoinRequestModel.fromJson(Map<String, dynamic> json) =>
      _$JoinRequestModelFromJson(json);

  Map<String, dynamic> toJson() => _$JoinRequestModelToJson(this);

  JoinRequestModel copyWith({
    String? id,
    String? name,
    String? email,
    String? phone,
    String? nationalId,
    String? governorate,
    String? position,
    String? membershipNumber,
    String? role,
    String? status,
    String? notes,
    String? reviewedBy,
    DateTime? reviewedAt,
    String? approvalNotes,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return JoinRequestModel(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      nationalId: nationalId ?? this.nationalId,
      governorate: governorate ?? this.governorate,
      position: position ?? this.position,
      membershipNumber: membershipNumber ?? this.membershipNumber,
      role: role ?? this.role,
      status: status ?? this.status,
      notes: notes ?? this.notes,
      reviewedBy: reviewedBy ?? this.reviewedBy,
      reviewedAt: reviewedAt ?? this.reviewedAt,
      approvalNotes: approvalNotes ?? this.approvalNotes,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}