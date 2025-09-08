import 'package:dartz/dartz.dart';

import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/user.dart';
import '../repositories/auth_repository.dart';

class RegisterUseCase implements UseCase<User, RegisterParams> {
  final AuthRepository repository;

  RegisterUseCase(this.repository);

  @override
  Future<Either<Failure, User>> call(RegisterParams params) async {
    return await repository.register(
      name: params.name,
      email: params.email,
      password: params.password,
      phone: params.phone,
      university: params.university,
      nationalId: params.nationalId,
      governorate: params.governorate,
      // position: params.position,
      membershipNumber: params.membershipNumber,
    );
  }
}

class RegisterParams {
  String name;
  String email;
  String password;
  String phone;
  String university;
  String nationalId;
  String governorate;
  // String position;
  String membershipNumber;

  RegisterParams({
    required this.name,
    required this.email,
    required this.password,
    required this.phone,
    required this.university,
    required this.nationalId,
    required this.governorate,
    // required this.position,
    this.membershipNumber = '',
  });
}
