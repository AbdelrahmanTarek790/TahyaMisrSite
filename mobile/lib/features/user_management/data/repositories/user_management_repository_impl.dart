import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/network/network_info.dart';
import '../../../auth/data/models/user_model.dart';
import '../../domain/repositories/user_management_repository.dart';
import '../../domain/usecases/get_users.dart';
import '../datasources/user_management_remote_data_source.dart';

class UserManagementRepositoryImpl implements UserManagementRepository {
  final UserManagementRemoteDataSource remoteDataSource;
  final NetworkInfo networkInfo;

  UserManagementRepositoryImpl({
    required this.remoteDataSource,
    required this.networkInfo,
  });

  @override
  Future<Either<Failure, GetUsersResponse>> getUsers({
    required int page,
    required int limit,
    String? search,
    String? role,
  }) async {
    if (await networkInfo.isConnected) {
      try {
        final users = await remoteDataSource.getUsers(
          page: page,
          limit: limit,
          search: search,
          role: role,
        );
        
        // For now, return basic pagination info
        // This should be enhanced to get actual pagination from API response
        final totalUsers = users.length;
        final totalPages = (totalUsers / limit).ceil();
        
        return Right(GetUsersResponse(
          users: users,
          total: totalUsers,
          currentPage: page,
          totalPages: totalPages,
        ),);
      } catch (e) {
        return Left(ServerFailure(e.toString()));
      }
    } else {
      return const Left(NetworkFailure('No internet connection'));
    }
  }

  @override
  Future<Either<Failure, UserModel>> getUserById(String id) async {
    if (await networkInfo.isConnected) {
      try {
        final user = await remoteDataSource.getUserById(id);
        return Right(user);
      } catch (e) {
        return Left(ServerFailure(e.toString()));
      }
    } else {
      return const Left(NetworkFailure('No internet connection'));
    }
  }

  @override
  Future<Either<Failure, UserModel>> createUser(Map<String, dynamic> userData) async {
    if (await networkInfo.isConnected) {
      try {
        final user = await remoteDataSource.createUser(userData);
        return Right(user);
      } catch (e) {
        return Left(ServerFailure(e.toString()));
      }
    } else {
      return const Left(NetworkFailure('No internet connection'));
    }
  }

  @override
  Future<Either<Failure, UserModel>> updateUser(String id, Map<String, dynamic> userData) async {
    if (await networkInfo.isConnected) {
      try {
        final user = await remoteDataSource.updateUser(id, userData);
        return Right(user);
      } catch (e) {
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
        await remoteDataSource.deleteUser(id);
        return const Right(true);
      } catch (e) {
        return Left(ServerFailure(e.toString()));
      }
    } else {
      return const Left(NetworkFailure('No internet connection'));
    }
  }
}