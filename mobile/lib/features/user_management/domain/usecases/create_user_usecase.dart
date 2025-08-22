import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/user.dart';
import '../repositories/user_management_repository.dart';

class CreateUserUseCase implements UseCase<User, CreateUserParams> {
  final UserManagementRepository repository;

  CreateUserUseCase(this.repository);

  @override
  Future<Either<Failure, User>> call(CreateUserParams params) async {
    return await repository.createUser(params.userData);
  }
}

class CreateUserParams {
  final Map<String, dynamic> userData;

  CreateUserParams({required this.userData});
}