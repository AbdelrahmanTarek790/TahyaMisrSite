import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/network/network_info.dart';
import '../../domain/entities/user.dart';
import '../../domain/repositories/user_management_repository.dart';
import '../datasources/user_management_remote_data_source.dart';

class UserManagementRepositoryImpl implements UserManagementRepository {
  final UserManagementRemoteDataSource remoteDataSource;
  final NetworkInfo networkInfo;

  UserManagementRepositoryImpl({
    required this.remoteDataSource,
    required this.networkInfo,
  });

  @override
  Future<Either<Failure, List<User>>> getUsers({
    int page = 1,
    int limit = 10,
    String? search,
    String? role,
    String? governorate,
    String? university,
  }) async {
    if (await networkInfo.isConnected) {
      try {
        final users = await remoteDataSource.getUsers(
          page: page,
          limit: limit,
          search: search,
          role: role,
        );
        return Right(users);
      } catch (e) {
        return Left(ServerFailure(e.toString()));
      }
    } else {
      return Left(NetworkFailure());
    }
  }

  @override
  Future<Either<Failure, User>> getUserById(String id) async {
    if (await networkInfo.isConnected) {
      try {
        final user = await remoteDataSource.getUserById(id);
        return Right(user);
      } catch (e) {
        return Left(ServerFailure(e.toString()));
      }
    } else {
      return Left(NetworkFailure());
    }
  }

  @override
  Future<Either<Failure, User>> createUser(Map<String, dynamic> userData) async {
    if (await networkInfo.isConnected) {
      try {
        final user = await remoteDataSource.createUser(userData);
        return Right(user);
      } catch (e) {
        return Left(ServerFailure(e.toString()));
      }
    } else {
      return Left(NetworkFailure());
    }
  }

  @override
  Future<Either<Failure, User>> updateUser(String id, Map<String, dynamic> userData) async {
    if (await networkInfo.isConnected) {
      try {
        final user = await remoteDataSource.updateUser(id, userData);
        return Right(user);
      } catch (e) {
        return Left(ServerFailure(e.toString()));
      }
    } else {
      return Left(NetworkFailure());
    }
  }

  @override
  Future<Either<Failure, void>> deleteUser(String id) async {
    if (await networkInfo.isConnected) {
      try {
        await remoteDataSource.deleteUser(id);
        return const Right(null);
      } catch (e) {
        return Left(ServerFailure(e.toString()));
      }
    } else {
      return Left(NetworkFailure());
    }
  }

  @override
  Future<Either<Failure, User>> updateUserRole(String id, String role) async {
    if (await networkInfo.isConnected) {
      try {
        final user = await remoteDataSource.updateUser(id, {'role': role});
        return Right(user);
      } catch (e) {
        return Left(ServerFailure(e.toString()));
      }
    } else {
      return Left(NetworkFailure());
    }
  }
}