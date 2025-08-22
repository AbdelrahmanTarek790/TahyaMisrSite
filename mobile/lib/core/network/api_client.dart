import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';
import 'dart:io';

import '../../features/auth/data/models/login_request.dart';
import '../../features/auth/data/models/login_response.dart';
import '../../features/auth/data/models/register_request.dart';
import '../../features/auth/data/models/user_model.dart';
import '../../features/news/data/models/news_model.dart';
import '../../features/events/data/models/event_model.dart';
import '../../features/media/data/models/media_model.dart';
import '../../features/dashboard/data/models/dashboard_stats_model.dart';
import '../../features/dashboard/data/models/recent_activity_model.dart';
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
  Future<ApiResponse<UserModel>> updateProfile(@Body() Map<String, dynamic> data);

  // News endpoints
  @GET('/news')
  Future<ApiResponse<Map<String, dynamic>>> getNews(
    @Query('page') int page,
    @Query('limit') int limit,
  );

  @GET('/news/{id}')
  Future<ApiResponse<NewsModel>> getNewsById(@Path('id') String id);

  // Events endpoints
  @GET('/events')
  Future<ApiResponse<Map<String, dynamic>>> getEvents(
    @Query('page') int page,
    @Query('limit') int limit,
  );

  @GET('/events/{id}')
  Future<ApiResponse<EventModel>> getEventById(@Path('id') String id);

  @POST('/events/{id}/register')
  Future<ApiResponse<void>> registerForEvent(@Path('id') String id);

  // Media endpoints
  @GET('/media')
  Future<ApiResponse<Map<String, dynamic>>> getMedia(
    @Query('page') int page,
    @Query('limit') int limit,
  );

  @GET('/media/{id}')
  Future<ApiResponse<MediaModel>> getMediaById(@Path('id') String id);

  // Upload endpoints  
  @POST('/media')
  @MultiPart()
  Future<ApiResponse<MediaModel>> uploadMedia(
    @Part(name: "file") File file,
    @Part(name: "caption") String caption,
  );

  // Dashboard endpoints
  @GET('/dashboard/stats')
  Future<ApiResponse<DashboardStatsModel>> getDashboardStats();

  @GET('/dashboard/activity')
  Future<ApiResponse<List<RecentActivityModel>>> getRecentActivity(
    @Query('page') int page,
    @Query('limit') int limit,
  );
}