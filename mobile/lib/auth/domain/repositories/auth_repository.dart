import 'package:dartz/dartz.dart';

import '../../../../core/error/failures.dart';
import '../entities/user.dart';

abstract class AuthRepository {
  Future<Either<Failure, String>> login({
    required String email,
    required String password,
  });

  Future<Either<Failure, User>> register({
    required String email,
    required String password,
    required String name,
    required String role,
    String? governorate,
    String? phoneNumber,
  });

  Future<Either<Failure, User>> getCurrentUser();

  Future<Either<Failure, User>> updateProfile(Map<String, dynamic> data);

  Future<Either<Failure, void>> logout();

  Future<Either<Failure, String?>> getStoredToken();

  Future<Either<Failure, bool>> isLoggedIn();
}
