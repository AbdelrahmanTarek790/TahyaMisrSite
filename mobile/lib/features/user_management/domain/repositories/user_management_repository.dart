import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../auth/data/models/user_model.dart';
import '../usecases/get_users.dart';

abstract class UserManagementRepository {
  Future<Either<Failure, GetUsersResponse>> getUsers({
    required int page,
    required int limit,
    String? search,
    String? role,
  });
  
  Future<Either<Failure, UserModel>> getUserById(String id);
  Future<Either<Failure, UserModel>> createUser(Map<String, dynamic> userData);
  Future<Either<Failure, UserModel>> updateUser(String id, Map<String, dynamic> userData);
  Future<Either<Failure, bool>> deleteUser(String id);
}