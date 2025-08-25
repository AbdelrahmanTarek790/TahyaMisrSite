import 'package:dartz/dartz.dart';

import '../../../core/error/failures.dart';
import '../../../core/usecases/usecase.dart';
import '../entities/user.dart';
import '../repositories/auth_repository.dart';

class RegisterUseCase implements UseCase<User, RegisterParams> {
  final AuthRepository repository;

  RegisterUseCase(this.repository);

  @override
  Future<Either<Failure, User>> call(RegisterParams params) async {
    return await repository.register(
      email: params.email,
      password: params.password,
      name: params.name,
      role: params.role,
      governorate: params.governorate,
      phoneNumber: params.phoneNumber,
    );
  }
}

class RegisterParams {
  final String email;
  final String password;
  final String name;
  final String role;
  final String? governorate;
  final String? phoneNumber;

  RegisterParams({
    required this.email,
    required this.password,
    required this.name,
    required this.role,
    this.governorate,
    this.phoneNumber,
  });
}