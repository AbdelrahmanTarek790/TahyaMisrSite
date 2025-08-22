import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../../../auth/data/models/user_model.dart';
import '../repositories/user_management_repository.dart';

class CreateUser implements UseCase<UserModel, CreateUserParams> {
  final UserManagementRepository repository;

  CreateUser(this.repository);

  @override
  Future<Either<Failure, UserModel>> call(CreateUserParams params) async {
    return await repository.createUser(params.userData);
  }
}

class CreateUserParams extends Equatable {
  final Map<String, dynamic> userData;

  const CreateUserParams({required this.userData});

  @override
  List<Object?> get props => [userData];
}