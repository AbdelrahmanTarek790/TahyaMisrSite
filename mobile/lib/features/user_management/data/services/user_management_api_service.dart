import '../../../../core/network/api_client.dart';
import '../../../../core/error/exceptions.dart';
import '../../../auth/data/models/register_request.dart';
import '../models/user_management_model.dart';

class UserManagementApiService {
  final ApiClient apiClient;

  UserManagementApiService(this.apiClient);

  Future<List<UserManagementModel>> getUsers({
    int page = 1,
    int limit = 10,
    String role = '',
    String search = '',
  }) async {
    try {
      final response = await apiClient.getUsers(
        page,
        limit,
        role,
        search,
      );
      if (response.success && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        final usersList = data['users'] as List<dynamic>? ?? [];
        return usersList
            .map(
              (json) =>
                  UserManagementModel.fromJson(json as Map<String, dynamic>),
            )
            .toList();
      } else {
        throw ServerException(response.error ?? 'Failed to fetch users');
      }
    } catch (e) {
      if (e is ServerException) rethrow;
      throw ServerException('Unexpected error occurred: $e');
    }
  }

  Future<UserManagementModel> getUserById(String id) async {
    try {
      final response = await apiClient.getUserById(id);
      if (response.success && response.data != null) {
        return UserManagementModel.fromJson(
          response.data as Map<String, dynamic>,
        );
      } else {
        throw ServerException(response.error ?? 'Failed to fetch user');
      }
    } catch (e) {
      if (e is ServerException) rethrow;
      throw ServerException('Unexpected error occurred: $e');
    }
  }

  Future<UserManagementModel> createUser(RegisterRequest userData) async {
    try {
      final response = await apiClient.register(userData);
      if (response.success && response.data != null) {
        return UserManagementModel.fromJson(
          response.data as Map<String, dynamic>,
        );
      } else {
        throw ServerException(response.error ?? 'Failed to create user');
      }
    } catch (e) {
      if (e is ServerException) rethrow;
      throw ServerException('Unexpected error occurred: $e');
    }
  }

  Future<UserManagementModel> updateUser(
    String id,
    Map<String, dynamic> userData,
  ) async {
    print('update user in api Service');
    try {
      final response = await apiClient.updateUser(id, userData);
      print(response.data);
      if (response.success && response.data != null) {
        return response.data as UserManagementModel;
      } else {
        print('error in api service: ${response.error}');
        throw ServerException(response.error ?? 'Failed to update user');
      }
    } catch (e) {
      print('exception in api service: $e');
      if (e is ServerException) rethrow;
      throw ServerException('Unexpected error occurred: $e');
    }
  }

  Future<void> deleteUser(String id) async {
    try {
      final response = await apiClient.deleteUser(id);
      if (!response.success) {
        throw ServerException(response.error ?? 'Failed to delete user');
      }
    } catch (e) {
      if (e is ServerException) rethrow;
      throw ServerException('Unexpected error occurred: $e');
    }
  }
}
