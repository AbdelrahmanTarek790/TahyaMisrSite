import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../../../auth/data/models/user_model.dart';
import '../repositories/user_management_repository.dart';

class UpdateUser implements UseCase<UserModel, UpdateUserParams> {
  final UserManagementRepository repository;

  UpdateUser(this.repository);

  @override
  Future<Either<Failure, UserModel>> call(UpdateUserParams params) async {
    return await repository.updateUser(params.userId, params.userData);
  }
}

class UpdateUserParams extends Equatable {
  final String userId;
  final Map<String, dynamic> userData;

  const UpdateUserParams({
    required this.userId,
    required this.userData,
  });

  @override
  List<Object?> get props => [userId, userData];
}