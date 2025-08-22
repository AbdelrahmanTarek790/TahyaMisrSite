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
  Future<List<NewsModel>> getNews(
    @Query('page') int page,
    @Query('limit') int limit,
  );

  @GET('/news/{id}')
  Future<NewsModel> getNewsById(@Path('id') String id);

  // Events endpoints
  @GET('/events')
  Future<List<EventModel>> getEvents(
    @Query('page') int page,
    @Query('limit') int limit,
  );

  @GET('/events/{id}')
  Future<EventModel> getEventById(@Path('id') String id);

  @POST('/events/{id}/register')
  Future<void> registerForEvent(@Path('id') String id);

  // Media endpoints
  @GET('/media')
  Future<List<MediaModel>> getMedia(
    @Query('page') int page,
    @Query('limit') int limit,
  );

  @GET('/media/{id}')
  Future<MediaModel> getMediaById(@Path('id') String id);

  // Upload endpoints
  @POST('/media')
  @MultiPart()
  Future<MediaModel> uploadMedia(
    @Part() File file,
    @Part() String caption,
  );

  // Dashboard endpoints
  @GET('/dashboard/stats')
  Future<DashboardStatsModel> getDashboardStats();

  @GET('/dashboard/activity')
  Future<List<RecentActivityModel>> getRecentActivity(
    @Query('page') int page,
    @Query('limit') int limit,
  );
}