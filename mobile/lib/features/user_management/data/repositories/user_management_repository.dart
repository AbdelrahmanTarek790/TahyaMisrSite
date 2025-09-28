import 'package:dartz/dartz.dart';

import '../../../../core/error/failures.dart';
import '../../../../core/network/network_info.dart';
import '../models/user_management_model.dart';
import '../services/user_management_api_service.dart';

abstract class UserManagementRepository {
  Future<Either<Failure, List<UserManagementModel>>> getUsers({
    required int page,
    required int limit,
    String? search,
    String? role,
  });

  Future<Either<Failure, UserManagementModel>> getUserById(String id);
  Future<Either<Failure, UserManagementModel>> createUser(Map<String, dynamic> userData);
  Future<Either<Failure, UserManagementModel>> updateUser(String id, Map<String, dynamic> userData);
  Future<Either<Failure, bool>> deleteUser(String id);
}

class UserManagementRepositoryImpl implements UserManagementRepository {
  final UserManagementApiService apiService;
  final NetworkInfo networkInfo;

  UserManagementRepositoryImpl({
    required this.apiService,
    required this.networkInfo,
  });

  @override
  Future<Either<Failure, List<UserManagementModel>>> getUsers({
    required int page,
    required int limit,
    String? search,
    String? role,
  }) async {
    if (await networkInfo.isConnected) {
      try {
        final users = await apiService.getUsers(
          page: page,
          limit: limit,
          search: search ?? '',
          role: role ?? '',
        );
        return Right(users);
      } catch (e) {
        return Left(ServerFailure(e.toString()));
      }
    } else {
      return const Left(NetworkFailure('No internet connection'));
    }
  }

  @override
  Future<Either<Failure, UserManagementModel>> getUserById(String id) async {
    if (await networkInfo.isConnected) {
      try {
        final user = await apiService.getUserById(id);
        return Right(user);
      } catch (e) {
        return Left(ServerFailure(e.toString()));
      }
    } else {
      return const Left(NetworkFailure('No internet connection'));
    }
  }

  @override
  Future<Either<Failure, UserManagementModel>> createUser(dynamic userData) async {
    if (await networkInfo.isConnected) {
      try {
        final user = await apiService.createUser(userData);
        return Right(user);
      } catch (e) {
        return Left(ServerFailure(e.toString()));
      }
    } else {
      return const Left(NetworkFailure('No internet connection'));
    }
  }

  @override
  Future<Either<Failure, UserManagementModel>> updateUser(String id, Map<String, dynamic> userData) async {
    print('userData in repo');
    if (await networkInfo.isConnected) {
      try {
        final user = await apiService.updateUser(id, userData);
        return Right(user);
      } catch (e) {
        print('error in repo: $e');
        return Left(ServerFailure(e.toString()));
      }
    } else {
      return const Left(NetworkFailure('No internet connection'));
    }
  }

  @override
  Future<Either<Failure, bool>> deleteUser(String id) async {
    if (await networkInfo.isConnected) {
      try {
        await apiService.deleteUser(id);
        return const Right(true);
      } catch (e) {
        return Left(ServerFailure(e.toString()));
      }
    } else {
      return const Left(NetworkFailure('No internet connection'));
    }
  }
}