import '../../../../core/network/api_client.dart';
import '../models/join_request_model.dart';
import '../models/join_request_submission.dart';
import '../models/join_request_action.dart';

abstract class JoinRequestRemoteDataSource {
  Future<JoinRequestModel> createJoinRequest(JoinRequestSubmission request);
  Future<Map<String, dynamic>> getJoinRequests({
    required int page,
    required int limit,
    String? status,
  });
  Future<JoinRequestModel> getJoinRequestById(String id);
  Future<JoinRequestModel> approveJoinRequest(String id, JoinRequestAction action);
  Future<JoinRequestModel> denyJoinRequest(String id, JoinRequestAction action);
  Future<void> deleteJoinRequest(String id);
}

class JoinRequestRemoteDataSourceImpl implements JoinRequestRemoteDataSource {
  final ApiClient apiClient;

  JoinRequestRemoteDataSourceImpl(this.apiClient);

  @override
  Future<JoinRequestModel> createJoinRequest(JoinRequestSubmission request) async {
    try {
      final response = await apiClient.createJoinRequest(request);
      print('Create join request API response: success=${response.success}, data=${response.data}, error=${response.error}');
      
      if (response.success && response.data != null) {
        return response.data!;
      } else {
        throw Exception(response.error ?? 'Failed to create join request');
      }
    } catch (e) {
      print('Create join request error: $e');
      throw Exception('Failed to create join request: $e');
    }
  }

  @override
  Future<Map<String, dynamic>> getJoinRequests({
    required int page,
    required int limit,
    String? status,
  }) async {
    try {
      final response = await apiClient.getJoinRequests(page, limit, status);
      print('Get join requests API response: success=${response.success}, data=${response.data}, error=${response.error}');
      
      if (response.success && response.data != null) {
        return response.data!;
      } else {
        throw Exception(response.error ?? 'Failed to get join requests');
      }
    } catch (e) {
      print('Get join requests error: $e');
      throw Exception('Failed to get join requests: $e');
    }
  }

  @override
  Future<JoinRequestModel> getJoinRequestById(String id) async {
    try {
      final response = await apiClient.getJoinRequestById(id);
      print('Get join request by ID API response: success=${response.success}, data=${response.data}, error=${response.error}');
      
      if (response.success && response.data != null) {
        return response.data!;
      } else {
        throw Exception(response.error ?? 'Failed to get join request');
      }
    } catch (e) {
      print('Get join request by ID error: $e');
      throw Exception('Failed to get join request: $e');
    }
  }

  @override
  Future<JoinRequestModel> approveJoinRequest(String id, JoinRequestAction action) async {
    try {
      final response = await apiClient.approveJoinRequest(id, action);
      print('Approve join request API response: success=${response.success}, data=${response.data}, error=${response.error}');
      
      if (response.success && response.data != null) {
        return response.data!;
      } else {
        throw Exception(response.error ?? 'Failed to approve join request');
      }
    } catch (e) {
      print('Approve join request error: $e');
      throw Exception('Failed to approve join request: $e');
    }
  }

  @override
  Future<JoinRequestModel> denyJoinRequest(String id, JoinRequestAction action) async {
    try {
      final response = await apiClient.denyJoinRequest(id, action);
      print('Deny join request API response: success=${response.success}, data=${response.data}, error=${response.error}');
      
      if (response.success && response.data != null) {
        return response.data!;
      } else {
        throw Exception(response.error ?? 'Failed to deny join request');
      }
    } catch (e) {
      print('Deny join request error: $e');
      throw Exception('Failed to deny join request: $e');
    }
  }

  @override
  Future<void> deleteJoinRequest(String id) async {
    try {
      final response = await apiClient.deleteJoinRequest(id);
      print('Delete join request API response: success=${response.success}, error=${response.error}');
      
      if (!response.success) {
        throw Exception(response.error ?? 'Failed to delete join request');
      }
    } catch (e) {
      print('Delete join request error: $e');
      throw Exception('Failed to delete join request: $e');
    }
  }
}