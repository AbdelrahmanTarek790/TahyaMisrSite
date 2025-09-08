import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';

import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/network/network_info.dart';
import '../../domain/entities/user.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_local_data_source.dart';
import '../datasources/auth_remote_data_source.dart';
import '../models/login_request.dart';
import '../models/register_request.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;
  final AuthLocalDataSource localDataSource;
  final NetworkInfo networkInfo;

  AuthRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
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
        final response = await remoteDataSource.login(loginRequest);

        // Cache token and user data
        await localDataSource.cacheToken(response.token);
        await localDataSource.cacheUser(response.user);

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
  Future<Either<Failure, User>> register({
    required String name,
    required String email,
    required String password,
    required String phone,
    required String university,
    required String nationalId,
    required String governorate,
    // required String position,
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
          // position: position,
          membershipNumber: membershipNumber,
        );
        final user = await remoteDataSource.register(registerRequest);

        // Cache user data
        await localDataSource.cacheUser(user);

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
  Future<Either<Failure, User>> getCurrentUser() async {
    try {
      // Try to get cached user first
      final cachedUser = await localDataSource.getCachedUser();
      if (cachedUser != null) {
        return Right(cachedUser);
      }

      // If no cached user and we have network, fetch from remote
      if (await networkInfo.isConnected) {
        final user = await remoteDataSource.getCurrentUser();
        await localDataSource.cacheUser(user);
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
  Future<Either<Failure, User>> updateProfile(Map<String, dynamic> data) async {
    if (await networkInfo.isConnected) {
      try {
        final user = await remoteDataSource.updateProfile(data);
        await localDataSource.cacheUser(user);
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
      await localDataSource.clearToken();
      await localDataSource.clearUser();
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
      final token = await localDataSource.getToken();
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
      final isLoggedIn = await localDataSource.isLoggedIn();
      return Right(isLoggedIn);
    } catch (e) {
      return Left(CacheFailure('Failed to check login status: $e'));
    }
  }

  Failure _handleDioError(DioException e) {
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
