import '../../../../core/network/api_client.dart';
import '../../../auth/data/models/user_model.dart';
import '../../../auth/data/models/register_request.dart';

abstract class UserManagementRemoteDataSource {
  Future<List<UserModel>> getUsers({
    int page = 1,
    int limit = 10,
    String? search,
    String? role,
  });
  Future<UserModel> getUserById(String id);
  Future<UserModel> createUser(Map<String, dynamic> userData);
  Future<UserModel> updateUser(String id, Map<String, dynamic> userData);
  Future<void> deleteUser(String id);
}

class UserManagementRemoteDataSourceImpl implements UserManagementRemoteDataSource {
  final ApiClient apiClient;

  UserManagementRemoteDataSourceImpl({required this.apiClient});

  @override
  Future<List<UserModel>> getUsers({
    int page = 1,
    int limit = 10,
    String? search,
    String? role,
  }) async {
    try {
      final response = await apiClient.getUsers(page, limit, role, search);
      
      if (response.success && response.data != null) {
        // Handle both direct array and paginated response
        final List<dynamic> usersJson;
        if (response.data is List) {
          usersJson = response.data as List<dynamic>;
        } else if (response.data is Map<String, dynamic>) {
          final data = response.data as Map<String, dynamic>;
          usersJson = data['users'] ?? data['data'] ?? [];
        } else {
          usersJson = [];
        }
        
        return usersJson
            .map((json) => UserModel.fromJson(json as Map<String, dynamic>))
            .toList();
      } else {
        throw Exception(response.error ?? 'Failed to fetch users');
      }
    } catch (e) {
      print('Error fetching users: $e');
      throw Exception('Failed to fetch users: $e');
    }
  }

  @override
  Future<UserModel> getUserById(String id) async {
    try {
      final response = await apiClient.getUserById(id);
      
      if (response.success && response.data != null) {
        return response.data!;
      } else {
        throw Exception(response.error ?? 'Failed to fetch user');
      }
    } catch (e) {
      print('Error fetching user: $e');
      throw Exception('Failed to fetch user: $e');
    }
  }

  @override
  Future<UserModel> createUser(Map<String, dynamic> userData) async {
    try {
      // For admin user creation, use the register endpoint
      final registerRequest = RegisterRequest(
        name: userData['name'] ?? '',
        email: userData['email'] ?? '',
        password: userData['password'] ?? 'TempPassword123!', // Temporary password
        phone: userData['phone'] ?? '',
        university: userData['university'] ?? '',
        nationalId: userData['nationalId'] ?? '',
        governorate: userData['governorate'] ?? '',
        position: userData['position'],
        membershipNumber: userData['membershipNumber'],
        membershipExpiry: userData['membershipExpiry'] != null 
            ? DateTime.parse(userData['membershipExpiry']) 
            : null,
      );
      
      final response = await apiClient.register(registerRequest);
      
      if (response.success && response.data != null) {
        return response.data!;
      } else {
        throw Exception(response.error ?? 'Failed to create user');
      }
    } catch (e) {
      print('Error creating user: $e');
      throw Exception('Failed to create user: $e');
    }
  }

  @override
  Future<UserModel> updateUser(String id, Map<String, dynamic> userData) async {
    try {
      final response = await apiClient.updateUser(id, userData);
      
      if (response.success && response.data != null) {
        return response.data!;
      } else {
        throw Exception(response.error ?? 'Failed to update user');
      }
    } catch (e) {
      print('Error updating user: $e');
      throw Exception('Failed to update user: $e');
    }
  }

  @override
  Future<void> deleteUser(String id) async {
    try {
      final response = await apiClient.deleteUser(id);
      
      if (!response.success) {
        throw Exception(response.error ?? 'Failed to delete user');
      }
    } catch (e) {
      print('Error deleting user: $e');
      throw Exception('Failed to delete user: $e');
    }
  }
}