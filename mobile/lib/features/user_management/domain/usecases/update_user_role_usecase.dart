import 'package:dartz/dartz.dart';
import 'package:tahya_misr_app/features/auth/data/models/user_model.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../repositories/user_management_repository.dart';

class UpdateUserRoleParams {
  final String userId;
  final String role;

  const UpdateUserRoleParams({
    required this.userId,
    required this.role,
  });
}

class UpdateUserRoleUseCase implements UseCase<UserModel, UpdateUserRoleParams> {
  final UserManagementRepository repository;

  UpdateUserRoleUseCase(this.repository);

  @override
  Future<Either<Failure, UserModel>> call(UpdateUserRoleParams params) async {
    return await repository.updateUser(params.userId,{'role': params.role});
  }
}