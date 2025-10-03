import '../../../../core/network/api_client.dart';
import '../models/join_request_model.dart';

import '../models/join_request_response.dart';
import '../models/join_request_action_request.dart';

class JoinRequestApiService {
  final ApiClient apiClient;

  JoinRequestApiService(this.apiClient);

  Future<void> createJoinRequest({
    required String name,
    required String email,
    required String phone,
    required String nationalId,
    required String governorate,
    required String role,
    String? position,
    String? membershipNumber,
    String? notes,
  }) async {
    try {
      final response = await apiClient.createJoinRequest({
        'name': name,
        'email': email,
        'phone': phone,
        'nationalID': nationalId,
        'governorate': governorate,
        'role': role,
        if (position != null) 'position': position,
        if (membershipNumber != null) 'membershipNumber': membershipNumber,
        if (notes != null) 'notes': notes,
      });
      if (response.success ) {
        return;
      } else {
        final errorMessage = response.error ?? 'Failed to create join request';
        print('Create join request failed: $errorMessage');
        throw Exception(errorMessage);
      }
    } catch (e) {
      print('Create join request error (${e.runtimeType}): $e');
      if (e is Exception) {
        rethrow;
      }
      throw Exception('Failed to create join request: $e');
    }
  }

  Future<JoinRequestResponse> getJoinRequests({
    int? page,
    int? limit,
    String? status,
  }) async {
    try {
      print(
          'Getting join requests with page: $page, limit: $limit, status: $status');
      final response = await apiClient.getJoinRequests(page, limit, status);
      print(
          'Get join requests API response: success=${response.success}, data=${response.data}, error=${response.error}');

      if (response.success && response.data != null) {
        return response.data!;
      } else {
        final errorMessage = response.error ?? 'Failed to get join requests';
        print('Get join requests failed: $errorMessage');
        throw Exception(errorMessage);
      }
    } catch (e) {
      print('Get join requests error (${e.runtimeType}): $e');
      if (e is Exception) {
        rethrow;
      }
      throw Exception('Failed to get join requests: $e');
    }
  }

  Future<JoinRequestModel> getJoinRequestById(String id) async {
    try {
      print('Getting join request by id: $id');
      final response = await apiClient.getJoinRequestById(id);
      print(
          'Get join request by id API response: success=${response.success}, data=${response.data}, error=${response.error}');

      if (response.success && response.data != null) {
        return response.data!;
      } else {
        final errorMessage = response.error ?? 'Failed to get join request';
        print('Get join request by id failed: $errorMessage');
        throw Exception(errorMessage);
      }
    } catch (e) {
      print('Get join request by id error (${e.runtimeType}): $e');
      if (e is Exception) {
        rethrow;
      }
      throw Exception('Failed to get join request: $e');
    }
  }

  Future<void> approveJoinRequest(
      String id, JoinRequestActionRequest request) async {
    try {
      print('Approving join request $id with: ${request.toJson()}');
      final response = await apiClient.approveJoinRequest(id, request);
      print(
          'Approve join request API response: success=${response.success}, data=${response.data}, error=${response.error}');

      if (response.success && response.data != null) {
        return;
      } else {
        final errorMessage = response.error ?? 'Failed to approve join request';
        print('Approve join request failed: $errorMessage');
        throw Exception(errorMessage);
      }
    } catch (e) {
      print('Approve join request error (${e.runtimeType}): $e');
      if (e is Exception) {
        rethrow;
      }
      throw Exception('Failed to approve join request: $e');
    }
  }

  Future<void> denyJoinRequest(
      String id, JoinRequestActionRequest request) async {
    try {
      print('Denying join request $id with: ${request.toJson()}');
      final response = await apiClient.denyJoinRequest(id, request);
      print(
          'Deny join request API response: success=${response.success}, data=${response.data}, error=${response.error}');

      if (response.success && response.data != null) {
        return ;
      } else {
        final errorMessage = response.error ?? 'Failed to deny join request';
        print('Deny join request failed: $errorMessage');
        throw Exception(errorMessage);
      }
    } catch (e) {
      print('Deny join request error (${e.runtimeType}): $e');
      if (e is Exception) {
        rethrow;
      }
      throw Exception('Failed to deny join request: $e');
    }
  }

  Future<void> deleteJoinRequest(String id) async {
    try {
      print('Deleting join request: $id');
      final response = await apiClient.deleteJoinRequest(id);
      print(
          'Delete join request API response: success=${response.success}, error=${response.error}');

      if (!response.success) {
        final errorMessage = response.error ?? 'Failed to delete join request';
        print('Delete join request failed: $errorMessage');
        throw Exception(errorMessage);
      }
    } catch (e) {
      print('Delete join request error (${e.runtimeType}): $e');
      if (e is Exception) {
        rethrow;
      }
      throw Exception('Failed to delete join request: $e');
    }
  }
}
