import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';
import 'dart:io';

import '../../features/auth/data/models/login_request.dart';
import '../../features/auth/data/models/login_response.dart';
import '../../features/auth/data/models/register_request.dart';
import '../../features/auth/data/models/user_model.dart';
import '../../features/join_request/data/models/join_request_action_request.dart';
import '../../features/join_request/data/models/join_request_model.dart';
import '../../features/join_request/data/models/join_request_response.dart';
import '../../features/news/data/models/news_model.dart';
import '../../features/events/data/models/event_model.dart';
import '../../features/media/data/models/media_model.dart';
import '../../features/user_management/data/models/user_management_model.dart';
import 'api_response.dart';

part 'api_client.g.dart';

@RestApi()
abstract class ApiClient {
  factory ApiClient(Dio dio, {String baseUrl}) = _ApiClient;

  // Authentication endpoints
  @POST('/auth/login')
  Future<ApiResponse<LoginResponse>> login(@Body() LoginRequest request);

  @POST('/auth/register')
  Future<ApiResponse<UserModel>> register(@Body() RegisterRequest request);

  @GET('/users/me')
  Future<ApiResponse<UserModel>> getCurrentUser();

  @PUT('/users/me')
  Future<ApiResponse<UserModel>> updateProfile(
    @Body() Map<String, dynamic> data,
  );

  // News endpoints
  @GET('/news')
  Future<ApiResponse<dynamic>> getNews(
    @Query('page') int page,
    @Query('limit') int limit,
  );

  @GET('/news/{id}')
  Future<ApiResponse<dynamic>> getNewsById(@Path('id') String id);

  // Events endpoints
  @GET('/events')
  Future<ApiResponse<dynamic>> getEvents(
    @Query('page') int page,
    @Query('limit') int limit,
  );

  @GET('/events/{id}')
  Future<ApiResponse<EventModel>> getEventById(@Path('id') String id);

  @POST('/events/{id}/register')
  Future<void> registerForEvent(@Path('id') String id);

  // Media endpoints
  @GET('/media')
  Future<ApiResponse<dynamic>> getMedia(
    @Query('page') int page,
    @Query('limit') int limit,
  );

  @GET('/media/{id}')
  Future<ApiResponse<MediaModel>> getMediaById(@Path('id') String id);

  // Upload endpoints
  @POST('/media')
  @MultiPart()
  Future<ApiResponse<MediaModel>> uploadMedia(
    @Part() File file,
    @Part() String caption,
  );

  // User Management endpoints (Admin only)
  @GET('/users')
  Future<ApiResponse<dynamic>> getUsers(
    @Query('page') int page,
    @Query('limit') int limit,
    @Query('role') String? role,
    @Query('search') String? search,
  );

  @GET('/users/{id}')
  Future<ApiResponse<UserModel>> getUserById(@Path('id') String id);

  // User creation by admin uses register endpoint
  // @POST('/users') - No direct user creation endpoint, use register

  @PUT('/users/{id}')
  Future<ApiResponse<UserManagementModel>> updateUser(
    @Path('id') String id,
    @Body() Map<String, dynamic> userData,
  );

  @DELETE('/users/{id}')
  Future<ApiResponse<dynamic>> deleteUser(@Path('id') String id);

  // Position Management endpoints
  // search by name or isActive or isGlobal
  @GET('/positions')
  Future<ApiResponse<dynamic>> getPositions(
    @Query('name') String? name,
    @Query('isActive') bool? isActive,
    @Query('isGlobal') bool? isGlobal,
  );

  @GET('/positions/{id}')
  Future<ApiResponse<dynamic>> getPositionById(@Path('id') String id);

  @POST('/positions')
  Future<ApiResponse<dynamic>> createPosition(
    @Body() Map<String, dynamic> positionData,
  );

  @PUT('/positions/{id}')
  Future<ApiResponse<dynamic>> updatePosition(
    @Path('id') String id,
    @Body() Map<String, dynamic> positionData,
  );

  @DELETE('/positions/{id}')
  Future<ApiResponse<dynamic>> deletePosition(@Path('id') String id);

  // Content Creation endpoints (Admin only)
  @MultiPart()
  @POST('/news')
  Future<ApiResponse<NewsModel>> createNews(@Body() FormData body);

  @MultiPart()
  @PUT('/news/{id}')
  Future<ApiResponse<NewsModel>> updateNews(
    @Path('id') String id,
    @Body() FormData body,
  );

  @DELETE('/news/{id}')
  Future<ApiResponse<dynamic>> deleteNews(@Path('id') String id);

  @MultiPart()
  @POST('/events')
  Future<ApiResponse<EventModel>> createEvent(@Body() FormData body);

  @MultiPart()
  @PUT('/events/{id}')
  Future<ApiResponse<EventModel>> updateEvent(
    @Path('id') String id,
    @Body() FormData body,
  );

  @DELETE('/events/{id}')
  Future<ApiResponse<dynamic>> deleteEvent(@Path('id') String id);

  @DELETE('/media/{id}')
  Future<ApiResponse<dynamic>> deleteMedia(@Path('id') String id);

// Join Request endpoints
  @POST('/join-requests')
  Future<ApiResponse<dynamic>> createJoinRequest(
    @Body() Map<String, dynamic> body,
  );

  @GET('/join-requests')
  Future<ApiResponse<JoinRequestResponse>> getJoinRequests(
    @Query('page') int? page,
    @Query('limit') int? limit,
    @Query('status') String? status,
  );

  @GET('/join-requests/{id}')
  Future<ApiResponse<JoinRequestModel>> getJoinRequestById(
    @Path('id') String id,
  );

  @PATCH('/join-requests/{id}/approve')
  Future<ApiResponse<dynamic>> approveJoinRequest(
    @Path('id') String id,
    @Body() JoinRequestActionRequest request,
  );

  @PATCH('/join-requests/{id}/deny')
  Future<ApiResponse<dynamic>> denyJoinRequest(
    @Path('id') String id,
    @Body() JoinRequestActionRequest request,
  );

  @DELETE('/join-requests/{id}')
  Future<ApiResponse<dynamic>> deleteJoinRequest(@Path('id') String id);

  // Timeline endpoints
  @GET('/timeline')
  Future<ApiResponse<dynamic>> getTimeline(
    @Query('page') int page,
    @Query('limit') int limit,
  );

  @GET('/timeline/{id}')
  Future<ApiResponse<dynamic>> getTimelineById(@Path('id') String id);

  @POST('/timeline')
  Future<ApiResponse<dynamic>> createTimelineEntry(
    @Body() Map<String, dynamic> body,
  );

  @PUT('/timeline/{id}')
  Future<ApiResponse<dynamic>> updateTimelineEntry(
    @Path('id') String id,
    @Body() Map<String, dynamic> body,
  );

  @DELETE('/timeline/{id}')
  Future<ApiResponse<dynamic>> deleteTimelineEntry(@Path('id') String id);

  // Activities endpoints
  @GET('/activities')
  Future<ApiResponse<dynamic>> getActivities(
    @Query('isActive') bool? isActive,
  );

  @GET('/activities/{id}')
  Future<ApiResponse<dynamic>> getActivityById(@Path('id') String id);

  @MultiPart()
  @POST('/activities')
  Future<ApiResponse<dynamic>> createActivity(@Body() FormData body);

  @MultiPart()
  @PUT('/activities/{id}')
  Future<ApiResponse<dynamic>> updateActivity(
    @Path('id') String id,
    @Body() FormData body,
  );

  @DELETE('/activities/{id}')
  Future<ApiResponse<dynamic>> deleteActivity(@Path('id') String id);

  @PATCH('/activities/{id}/toggle')
  Future<ApiResponse<dynamic>> toggleActivityStatus(@Path('id') String id);

  @PUT('/activities/reorder')
  Future<ApiResponse<dynamic>> reorderActivities(
    @Body() Map<String, dynamic> body,
  );

  // Achievements endpoints
  @GET('/achievements')
  Future<ApiResponse<dynamic>> getAchievements(
    @Query('isActive') bool? isActive,
  );

  @GET('/achievements/{id}')
  Future<ApiResponse<dynamic>> getAchievementById(@Path('id') String id);

  @MultiPart()
  @POST('/achievements')
  Future<ApiResponse<dynamic>> createAchievement(@Body() FormData body);

  @MultiPart()
  @PUT('/achievements/{id}')
  Future<ApiResponse<dynamic>> updateAchievement(
    @Path('id') String id,
    @Body() FormData body,
  );

  @DELETE('/achievements/{id}')
  Future<ApiResponse<dynamic>> deleteAchievement(@Path('id') String id);

  @PATCH('/achievements/{id}/toggle')
  Future<ApiResponse<dynamic>> toggleAchievementStatus(@Path('id') String id);

  @PUT('/achievements/reorder')
  Future<ApiResponse<dynamic>> reorderAchievements(
    @Body() Map<String, dynamic> body,
  );
// Dashboard data will be aggregated from other endpoints
// No dedicated dashboard endpoints since dashboard.js was deleted
}
