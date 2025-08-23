import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../../../auth/data/models/user_model.dart';
import '../repositories/user_management_repository.dart';

class GetUserById implements UseCase<UserModel, GetUserByIdParams> {
  final UserManagementRepository repository;

  GetUserById(this.repository);

  @override
  Future<Either<Failure, UserModel>> call(GetUserByIdParams params) async {
    return await repository.getUserById(params.userId);
  }
}

class GetUserByIdParams extends Equatable {
  final String userId;

  const GetUserByIdParams({required this.userId});

  @override
  List<Object?> get props => [userId];
}