import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/user.dart';
import '../repositories/user_management_repository.dart';

class UpdateUserUseCase implements UseCase<User, UpdateUserParams> {
  final UserManagementRepository repository;

  UpdateUserUseCase(this.repository);

  @override
  Future<Either<Failure, User>> call(UpdateUserParams params) async {
    return await repository.updateUser(params.id, params.userData);
  }
}

class UpdateUserParams {
  final String id;
  final Map<String, dynamic> userData;

  UpdateUserParams({required this.id, required this.userData});
}