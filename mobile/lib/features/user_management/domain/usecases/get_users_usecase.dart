import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../entities/user.dart';
import '../repositories/user_management_repository.dart';

class GetUsersParams {
  final int page;
  final int limit;
  final String? search;
  final String? role;

  const GetUsersParams({
    this.page = 1,
    this.limit = 10,
    this.search,
    this.role,
  });
}

class GetUsersUseCase implements UseCase<List<User>, GetUsersParams> {
  final UserManagementRepository repository;

  GetUsersUseCase(this.repository);

  @override
  Future<Either<Failure, List<User>>> call(GetUsersParams params) async {
    return await repository.getUsers(
      page: params.page,
      limit: params.limit,
      search: params.search,
      role: params.role,
    );
  }
}