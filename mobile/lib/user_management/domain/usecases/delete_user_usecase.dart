import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../repositories/user_management_repository.dart';

class DeleteUserUseCase implements UseCase<void, String> {
  final UserManagementRepository repository;

  DeleteUserUseCase(this.repository);

  @override
  Future<Either<Failure, void>> call(String userId) async {
    return await repository.deleteUser(userId);
  }
}