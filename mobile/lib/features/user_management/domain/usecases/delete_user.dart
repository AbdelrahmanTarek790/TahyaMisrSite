import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../repositories/user_management_repository.dart';

class DeleteUser implements UseCase<bool, DeleteUserParams> {
  final UserManagementRepository repository;

  DeleteUser(this.repository);

  @override
  Future<Either<Failure, bool>> call(DeleteUserParams params) async {
    return await repository.deleteUser(params.userId);
  }
}

class DeleteUserParams extends Equatable {
  final String userId;

  const DeleteUserParams({required this.userId});

  @override
  List<Object?> get props => [userId];
}