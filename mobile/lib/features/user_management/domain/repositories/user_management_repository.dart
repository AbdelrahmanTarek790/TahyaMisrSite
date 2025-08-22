import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/user.dart';

abstract class UserManagementRepository {
  Future<Either<Failure, List<User>>> getUsers({
    int page = 1,
    int limit = 10,
    String? search,
    String? role,
    String? governorate,
    String? university,
  });

  Future<Either<Failure, User>> getUserById(String id);

  Future<Either<Failure, User>> createUser(Map<String, dynamic> userData);

  Future<Either<Failure, User>> updateUser(String id, Map<String, dynamic> userData);

  Future<Either<Failure, void>> deleteUser(String id);

  Future<Either<Failure, User>> updateUserRole(String id, String role);
}