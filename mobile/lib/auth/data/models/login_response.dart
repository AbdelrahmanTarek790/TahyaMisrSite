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
      // Handle null and missing values safely
      final token = json['token'];
      final userData = json['user'];
      
      return LoginResponse(
        token: token?.toString() ?? '',
        user: userData != null && userData is Map<String, dynamic>
            ? UserModel.fromJson(userData)
            : UserModel.fromJson({}),
      );
    } catch (e) {
      print('LoginResponse.fromJson error: $e');
      // If parsing fails, return empty response to prevent crashes
      return LoginResponse(
        token: '',
        user: UserModel.fromJson({}),
      );
    }
  }

  Map<String, dynamic> toJson() => _$LoginResponseToJson(this);
}