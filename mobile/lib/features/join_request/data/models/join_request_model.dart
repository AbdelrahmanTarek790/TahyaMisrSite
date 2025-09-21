import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/join_request.dart';

part 'join_request_model.g.dart';

@JsonSerializable()
class JoinRequestModel extends JoinRequest {
  @JsonKey(name: '_id')
  final String? id;

  @JsonKey(name: 'createdAt')
  final String? createdAt;

  @JsonKey(name: 'updatedAt') 
  final String? updatedAt;

  @JsonKey(name: 'reviewedBy')
  final Map<String, dynamic>? reviewedBy;

  @JsonKey(name: 'reviewedAt')
  final String? reviewedAt;

  const JoinRequestModel({
    this.id,
    required String name,
    required String email,
    required String phone,
    required String nationalID,
    required String governorate,
    String? position,
    String? membershipNumber,
    required String role,
    String? notes,
    String status = 'pending',
    String? approvalNotes,
    this.createdAt,
    this.updatedAt,
    this.reviewedBy,
    this.reviewedAt,
  }) : super(
          name: name,
          email: email,
          phone: phone,
          nationalID: nationalID,
          governorate: governorate,
          position: position,
          membershipNumber: membershipNumber,
          role: role,
          notes: notes,
          status: status,
          approvalNotes: approvalNotes,
        );

  factory JoinRequestModel.fromJson(Map<String, dynamic> json) =>
      _$JoinRequestModelFromJson(json);

  Map<String, dynamic> toJson() => _$JoinRequestModelToJson(this);

  JoinRequestModel copyWith({
    String? id,
    String? name,
    String? email,
    String? phone,
    String? nationalID,
    String? governorate,
    String? position,
    String? membershipNumber,
    String? role,
    String? notes,
    String? status,
    String? approvalNotes,
    String? createdAt,
    String? updatedAt,
    Map<String, dynamic>? reviewedBy,
    String? reviewedAt,
  }) {
    return JoinRequestModel(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      nationalID: nationalID ?? this.nationalID,
      governorate: governorate ?? this.governorate,
      position: position ?? this.position,
      membershipNumber: membershipNumber ?? this.membershipNumber,
      role: role ?? this.role,
      notes: notes ?? this.notes,
      status: status ?? this.status,
      approvalNotes: approvalNotes ?? this.approvalNotes,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      reviewedBy: reviewedBy ?? this.reviewedBy,
      reviewedAt: reviewedAt ?? this.reviewedAt,
    );
  }
}