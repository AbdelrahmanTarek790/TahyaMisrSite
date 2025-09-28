import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';

import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/network/network_info.dart';
import '../models/login_request.dart';
import '../models/register_request.dart';
import '../models/user_model.dart';
import '../services/auth_api_service.dart';
import '../local/auth_local_storage.dart';

abstract class AuthRepository {
  Future<Either<Failure, String>> login({
    required String email,
    required String password,
  });

  Future<Either<Failure, UserModel>> register({
    required String name,
    required String email,
    required String password,
    required String phone,
    required String university,
    required String nationalId,
    required String governorate,
    String membershipNumber,
  });

  Future<Either<Failure, UserModel>> getCurrentUser();
  Future<Either<Failure, UserModel>> updateProfile(Map<String, dynamic> data);
  Future<Either<Failure, void>> logout();
  Future<Either<Failure, String?>> getStoredToken();
  Future<Either<Failure, bool>> isLoggedIn();
}

class AuthRepositoryImpl implements AuthRepository {
  final AuthApiService apiService;
  final AuthLocalStorage localStorage;
  final NetworkInfo networkInfo;

  AuthRepositoryImpl({
    required this.apiService,
    required this.localStorage,
    required this.networkInfo,
  });

  @override
  Future<Either<Failure, String>> login({
    required String email,
    required String password,
  }) async {
    if (await networkInfo.isConnected) {
      try {
        final loginRequest = LoginRequest(email: email, password: password);
        final response = await apiService.login(loginRequest);

        // Cache token and user data
        await localStorage.cacheToken(response.token);
        await localStorage.cacheUser(response.user);

        return Right(response.token);
      } on DioException catch (e) {
        return Left(_handleDioError(e));
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      } catch (e) {
        return Left(ServerFailure('Unexpected error occurred: $e'));
      }
    } else {
      return const Left(NetworkFailure('No internet connection'));
    }
  }

  @override
  Future<Either<Failure, UserModel>> register({
    required String name,
    required String email,
    required String password,
    required String phone,
    required String university,
    required String nationalId,
    required String governorate,
    String membershipNumber = '',
  }) async {
    if (await networkInfo.isConnected) {
      try {
        final registerRequest = RegisterRequest(
          name: name,
          email: email,
          password: password,
          phone: phone,
          university: university,
          nationalId: nationalId,
          governorate: governorate,
          membershipNumber: membershipNumber,
        );
        final user = await apiService.register(registerRequest);

        // Cache user data
        await localStorage.cacheUser(user);

        return Right(user);
      } on DioException catch (e) {
        return Left(_handleDioError(e));
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      } catch (e) {
        return Left(ServerFailure('Unexpected error occurred: $e'));
      }
    } else {
      return const Left(NetworkFailure('No internet connection'));
    }
  }

  @override
  Future<Either<Failure, UserModel>> getCurrentUser() async {
    try {
      // Try to get cached user first
      final cachedUser = await localStorage.getCachedUser();
      if (cachedUser != null) {
        return Right(cachedUser);
      }

      // If no cached user and we have network, fetch from remote
      if (await networkInfo.isConnected) {
        final user = await apiService.getCurrentUser();
        await localStorage.cacheUser(user);
        return Right(user);
      } else {
        return const Left(NetworkFailure('No internet connection'));
      }
    } on DioException catch (e) {
      return Left(_handleDioError(e));
    } on CacheException catch (e) {
      return Left(CacheFailure(e.message));
    } catch (e) {
      return Left(ServerFailure('Unexpected error occurred: $e'));
    }
  }

  @override
  Future<Either<Failure, UserModel>> updateProfile(Map<String, dynamic> data) async {
    if (await networkInfo.isConnected) {
      try {
        final user = await apiService.updateProfile(data);
        await localStorage.cacheUser(user);
        return Right(user);
      } on DioException catch (e) {
        return Left(_handleDioError(e));
      } on ServerException catch (e) {
        return Left(ServerFailure(e.message));
      } catch (e) {
        return Left(ServerFailure('Unexpected error occurred: $e'));
      }
    } else {
      return const Left(NetworkFailure('No internet connection'));
    }
  }

  @override
  Future<Either<Failure, void>> logout() async {
    try {
      await localStorage.clearToken();
      await localStorage.clearUser();
      return const Right(null);
    } on CacheException catch (e) {
      return Left(CacheFailure(e.message));
    } catch (e) {
      return Left(CacheFailure('Failed to logout: $e'));
    }
  }

  @override
  Future<Either<Failure, String?>> getStoredToken() async {
    try {
      final token = await localStorage.getToken();
      return Right(token);
    } on CacheException catch (e) {
      return Left(CacheFailure(e.message));
    } catch (e) {
      return Left(CacheFailure('Failed to get stored token: $e'));
    }
  }

  @override
  Future<Either<Failure, bool>> isLoggedIn() async {
    try {
      final isLoggedIn = await localStorage.isLoggedIn();
      return Right(isLoggedIn);
    } catch (e) {
      return Left(CacheFailure('Failed to check login status: $e'));
    }
  }

  Failure _handleDioError(DioException e) {
    print(e.response!.data);
    switch (e.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return const NetworkFailure('Connection timeout');
      case DioExceptionType.badResponse:
        final statusCode = e.response?.statusCode;
        final responseData = e.response?.data;
        
        // Handle backend error format {success: false, error: "message", data: null}
        String message = 'Server error';
        if (responseData is Map<String, dynamic>) {
          message = responseData['error']?.toString() ?? 
                    responseData['message']?.toString() ?? 
                    'Server error';
        }

        switch (statusCode) {
          case 400:
            return ValidationFailure(message);
          case 401:
            return UnauthorizedFailure(message);
          case 404:
            return NotFoundFailure(message);
          case 500:
          default:
            return ServerFailure(message);
        }
      case DioExceptionType.connectionError:
        return const NetworkFailure('No internet connection');
      case DioExceptionType.cancel:
        return const ServerFailure('Request cancelled');
      default:
        return ServerFailure('Unexpected error: ${e.message}');
    }
  }
}