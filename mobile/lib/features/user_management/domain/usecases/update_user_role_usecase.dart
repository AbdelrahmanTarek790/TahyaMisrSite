import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/user.dart';
import '../repositories/user_management_repository.dart';

class UpdateUserRoleParams {
  final String userId;
  final String role;

  const UpdateUserRoleParams({
    required this.userId,
    required this.role,
  });
}

class UpdateUserRoleUseCase implements UseCase<User, UpdateUserRoleParams> {
  final UserManagementRepository repository;

  UpdateUserRoleUseCase(this.repository);

  @override
  Future<Either<Failure, User>> call(UpdateUserRoleParams params) async {
    return await repository.updateUserRole(params.userId, params.role);
  }
}