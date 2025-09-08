import 'package:json_annotation/json_annotation.dart';

part 'register_request.g.dart';

@JsonSerializable()
class RegisterRequest {

   String name;
   String email;
   String password;
   String phone;
   String university;
   String nationalId;
   String governorate;
   // String position;
   String membershipNumber;

  RegisterRequest({
    required this.name,
    required this.email,
    required this.password,
    required this.phone,
    required this.university,
    required this.nationalId,
    required this.governorate,
    // required this.position,
    this.membershipNumber = '',
  });

  factory RegisterRequest.fromJson(Map<String, dynamic> json) =>
      _$RegisterRequestFromJson(json);

  Map<String, dynamic> toJson() => _$RegisterRequestToJson(this);
}