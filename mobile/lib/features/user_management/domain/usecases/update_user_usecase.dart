import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../../../auth/data/models/user_model.dart';
import '../repositories/user_management_repository.dart';

class UpdateUserUseCase implements UseCase<UserModel, UpdateUserParams> {
  final UserManagementRepository repository;

  UpdateUserUseCase(this.repository);

  @override
  Future<Either<Failure, UserModel>> call(UpdateUserParams params) async {
    return await repository.updateUser(params.id, params.userData);
  }
}

class UpdateUserParams {
  final String id;
  final Map<String, dynamic> userData;

  UpdateUserParams({required this.id, required this.userData});
}