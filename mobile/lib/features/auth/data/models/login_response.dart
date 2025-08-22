import 'package:json_annotation/json_annotation.dart';
import 'user_model.dart';

part 'login_response.g.dart';

@JsonSerializable()
class LoginResponse {
  final String token;
  final UserModel user;

  LoginResponse({
    required this.token,
    required this.user,
  });

  factory LoginResponse.fromJson(Map<String, dynamic> json) {
    try {
      // The response is already unwrapped by ApiResponse wrapper
      return LoginResponse(
        token: json['token']?.toString() ?? '',
        user: UserModel.fromJson(json['user'] as Map<String, dynamic>? ?? {}),
      );
    } catch (e) {
      // If parsing fails, return empty response to prevent crashes
      return LoginResponse(
        token: '',
        user: UserModel.fromJson({}),
      );
    }
  }

  Map<String, dynamic> toJson() => _$LoginResponseToJson(this);
}