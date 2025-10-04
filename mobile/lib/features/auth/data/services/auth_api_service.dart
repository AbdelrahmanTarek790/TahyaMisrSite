
import '../../../../core/network/api_client.dart';
import '../models/login_request.dart';
import '../models/login_response.dart';
import '../models/register_request.dart';
import '../models/user_model.dart';
import '../models/forgot_password_request.dart';
import '../models/reset_password_request.dart';
import '../models/change_password_request.dart';

class AuthApiService {
  final ApiClient apiClient;

  AuthApiService(this.apiClient);

  Future<LoginResponse> login(LoginRequest request) async {
    try {
      print('Making login request with: ${request.toJson()}');
      final response = await apiClient.login(request);
      print('Raw API response type: ${response.runtimeType}');
      print('Login API response: success=${response.success}, data=${response.data}, error=${response.error}');
      
      if (response.success && response.data != null) {
        print('Login successful, returning data: ${response.data}');
        return response.data!;
      } else {
        final errorMessage = response.error ?? 'Login failed - no error details provided';
        print('Login failed: $errorMessage');
        throw Exception(errorMessage);
      }
    } catch (e) {
      print('Login error (${e.runtimeType}): $e');
      if (e is Exception) {
        rethrow;
      }
      throw Exception('Login failed: $e');
    }
  }

  Future<UserModel> register(RegisterRequest request) async {
    try {
      final response = await apiClient.register(request);
      print('Register API response: success=${response.success}, data=${response.data}, error=${response.error}');
      
      if (response.success && response.data != null) {
        return response.data!;
      } else {
        throw Exception(response.error ?? 'Registration failed');
      }
    } catch (e) {
      print('Register error: $e');
      throw Exception('Registration failed: $e');
    }
  }

  Future<UserModel> getCurrentUser() async {
    try {
      final response = await apiClient.getCurrentUser();
      print('Get current user API response: success=${response.success}, data=${response.data}, error=${response.error}');
      
      if (response.success && response.data != null) {
        return response.data!;
      } else {
        throw Exception(response.error ?? 'Failed to get current user');
      }
    } catch (e) {
      print('Get current user error: $e');
      throw Exception('Failed to get current user: $e');
    }
  }

  Future<UserModel> updateProfile(Map<String, dynamic> data) async {
    try {
      final response = await apiClient.updateProfile(data);
      print('Update profile API response: success=${response.success}, data=${response.data}, error=${response.error}');
      
      if (response.success && response.data != null) {
        return response.data!;
      } else {
        throw Exception(response.error ?? 'Failed to update profile');
      }
    } catch (e) {
      print('Update profile error: $e');
      throw Exception('Failed to update profile: $e');
    }
  }

  Future<void> forgotPassword(ForgotPasswordRequest request) async {
    try {
      final response = await apiClient.forgotPassword(request);
      print('Forgot password API response: success=${response.success}, data=${response.data}, error=${response.error}');
      
      if (!response.success) {
        throw Exception(response.error ?? 'Failed to send reset password email');
      }
    } catch (e) {
      print('Forgot password error: $e');
      throw Exception('Failed to send reset password email: $e');
    }
  }

  Future<void> resetPassword(ResetPasswordRequest request) async {
    try {
      final response = await apiClient.resetPassword(request);
      print('Reset password API response: success=${response.success}, data=${response.data}, error=${response.error}');
      
      if (!response.success) {
        throw Exception(response.error ?? 'Failed to reset password');
      }
    } catch (e) {
      print('Reset password error: $e');
      throw Exception('Failed to reset password: $e');
    }
  }

  Future<void> changePassword(ChangePasswordRequest request) async {
    try {
      final response = await apiClient.changePassword(request);
      print('Change password API response: success=${response.success}, data=${response.data}, error=${response.error}');
      
      if (!response.success) {
        throw Exception(response.error ?? 'Failed to change password');
      }
    } catch (e) {
      print('Change password error: $e');
      throw Exception('Failed to change password: $e');
    }
  }
}