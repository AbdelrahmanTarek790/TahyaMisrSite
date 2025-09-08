import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecases/usecase.dart';
import '../../../auth/data/models/user_model.dart';
import '../repositories/user_management_repository.dart';

class GetUsersResponse extends Equatable {
  final List<UserModel> users;
  final int total;
  final int currentPage;
  final int totalPages;

  const GetUsersResponse({
    required this.users,
    required this.total,
    required this.currentPage,
    required this.totalPages,
  });

  @override
  List<Object?> get props => [users, total, currentPage, totalPages];
}

class GetUsers implements UseCase<GetUsersResponse, GetUsersParams> {
  final UserManagementRepository repository;

  GetUsers(this.repository);

  @override
  Future<Either<Failure, GetUsersResponse>> call(GetUsersParams params) async {
    return await repository.getUsers(
      page: params.page,
      limit: params.limit,
      search: params.search,
      role: params.role,
    );
  }
}

class GetUsersParams extends Equatable {
  final int page;
  final int limit;
  final String? search;
  final String? role;

  const GetUsersParams({
    required this.page,
    required this.limit,
    this.search,
    this.role,
  });

  @override
  List<Object?> get props => [page, limit, search, role];
}