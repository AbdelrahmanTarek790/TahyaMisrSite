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
  Future<ApiResponse<dynamic>> getNews(
      @Query('page') int page,
      @Query('limit') int limit,
      );

  @GET('/news/{id}')
  Future<ApiResponse<NewsModel>> getNewsById(@Path('id') String id);

  // Events endpoints
  @GET('/events')
  Future<ApiResponse<dynamic>> getEvents(
      @Query('page') int page,
      @Query('limit') int limit,
      );

  @GET('/events/{id}')
  Future<ApiResponse<EventModel>> getEventById(@Path('id') String id);

  @POST('/events/{id}/register')
  Future<ApiResponse<String>> registerForEvent(@Path('id') String id);

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
  Future<ApiResponse<UserModel>> updateUser(@Path('id') String id, @Body() Map<String, dynamic> userData);

  @DELETE('/users/{id}')
  Future<ApiResponse<dynamic>> deleteUser(@Path('id') String id);

  // Position Management endpoints
  @GET('/positions')
  Future<ApiResponse<dynamic>> getPositions(@Query('governorate') String? governorate);

  @GET('/positions/{id}')
  Future<ApiResponse<dynamic>> getPositionById(@Path('id') String id);

  @POST('/positions')
  Future<ApiResponse<dynamic>> createPosition(@Body() Map<String, dynamic> positionData);

  @PUT('/positions/{id}')
  Future<ApiResponse<dynamic>> updatePosition(@Path('id') String id, @Body() Map<String, dynamic> positionData);

  @DELETE('/positions/{id}')
  Future<ApiResponse<dynamic>> deletePosition(@Path('id') String id);

  // Content Creation endpoints (Admin only)
  @POST('/news')
  Future<ApiResponse<NewsModel>> createNews(@Body() Map<String, dynamic> newsData);

  @PUT('/news/{id}')
  Future<ApiResponse<NewsModel>> updateNews(@Path('id') String id, @Body() Map<String, dynamic> newsData);

  @DELETE('/news/{id}')
  Future<ApiResponse<dynamic>> deleteNews(@Path('id') String id);

  @POST('/events')
  Future<ApiResponse<EventModel>> createEvent(@Body() Map<String, dynamic> eventData);

  @PUT('/events/{id}')
  Future<ApiResponse<EventModel>> updateEvent(@Path('id') String id, @Body() Map<String, dynamic> eventData);

  @DELETE('/events/{id}')
  Future<ApiResponse<dynamic>> deleteEvent(@Path('id') String id);

  @DELETE('/media/{id}')
  Future<ApiResponse<dynamic>> deleteMedia(@Path('id') String id);

  // Dashboard data will be aggregated from other endpoints
  // No dedicated dashboard endpoints since dashboard.js was deleted
}