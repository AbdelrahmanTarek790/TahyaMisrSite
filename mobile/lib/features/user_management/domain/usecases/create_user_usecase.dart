import 'package:dartz/dartz.dart';
import 'package:tahya_misr_app/features/auth/data/models/user_model.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../repositories/user_management_repository.dart';

class CreateUserUseCase implements UseCase<UserModel, CreateUserParams> {
  final UserManagementRepository repository;

  CreateUserUseCase(this.repository);

  @override
  Future<Either<Failure, UserModel>> call(CreateUserParams params) async {
    return await repository.createUser(params.userData);
  }
}

class CreateUserParams {
  final Map<String, dynamic> userData;

  CreateUserParams({required this.userData});
}