import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/error/failures.dart';
import '../../../../core/error/exceptions.dart';
import '../../domain/entities/dashboard_stats.dart';
import '../../domain/entities/recent_activity.dart';
import '../../domain/repositories/dashboard_repository.dart';
import '../datasources/dashboard_remote_data_source.dart';

@LazySingleton(as: DashboardRepository)
class DashboardRepositoryImpl implements DashboardRepository {
  final DashboardRemoteDataSource remoteDataSource;

  DashboardRepositoryImpl({
    required this.remoteDataSource,
  });

  @override
  Future<Either<Failure, DashboardStats>> getDashboardStats() async {
    try {
      final result = await remoteDataSource.getDashboardStats();
      return Right(result);
    } on ServerException catch (e) {
      return Left(ServerFailure( e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure( e.message));
    } catch (e) {
      return const Left(ServerFailure( 'An unexpected error occurred'));
    }
  }

  @override
  Future<Either<Failure, List<RecentActivity>>> getRecentActivity({
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final result = await remoteDataSource.getRecentActivity(
        page: page,
        limit: limit,
      );
      return Right(result);
    } on ServerException catch (e) {
      return Left(ServerFailure( e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure( e.message));
    } catch (e) {
      return const Left(ServerFailure( 'An unexpected error occurred'));
    }
  }
}