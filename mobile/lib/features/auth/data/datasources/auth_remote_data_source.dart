import '../../../../core/network/api_client.dart';
import '../models/login_request.dart';
import '../models/login_response.dart';
import '../models/register_request.dart';
import '../models/user_model.dart';

abstract class AuthRemoteDataSource {
  Future<LoginResponse> login(LoginRequest request);
  Future<UserModel> register(RegisterRequest request);
  Future<UserModel> getCurrentUser();
  Future<UserModel> updateProfile(Map<String, dynamic> data);
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final ApiClient apiClient;

  AuthRemoteDataSourceImpl(this.apiClient);

  @override
  Future<LoginResponse> login(LoginRequest request) async {
    try {
      final response = await apiClient.login(request);
      print('Login API response: success=${response.success}, data=${response.data}, error=${response.error}');
      
      if (response.success && response.data != null) {
        return response.data!;
      } else {
        throw Exception(response.error ?? 'Login failed');
      }
    } catch (e) {
      print('Login error: $e');
      throw Exception('Login failed: $e');
    }
  }

  @override
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

  @override
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

  @override
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
}
