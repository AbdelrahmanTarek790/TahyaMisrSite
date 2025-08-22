import '../../../../core/network/api_client.dart';
import '../../../../core/network/api_response.dart';
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
    return await apiClient.login(request);
  }

  @override
  Future<UserModel> register(RegisterRequest request) async {
    return await apiClient.register(request);
  }

  @override
  Future<UserModel> getCurrentUser() async {
    final response = await apiClient.getCurrentUser();
    if (response.success && response.data != null) {
      return response.data!;
    } else {
      throw Exception(response.error ?? 'Failed to get current user');
    }
  }

  @override
  Future<UserModel> updateProfile(Map<String, dynamic> data) async {
    final response = await apiClient.updateProfile(data);
    if (response.success && response.data != null) {
      return response.data!;
    } else {
      throw Exception(response.error ?? 'Failed to update profile');
    }
  }
}
