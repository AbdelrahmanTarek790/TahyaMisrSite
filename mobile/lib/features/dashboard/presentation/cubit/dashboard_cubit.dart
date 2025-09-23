import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/usecases/usecase.dart';
import '../../domain/usecases/get_dashboard_stats_usecase.dart';
import '../../domain/usecases/get_recent_activity_usecase.dart';
import '../bloc/dashboard_state.dart';

@injectable
class DashboardCubit extends Cubit<DashboardState> {
  final GetDashboardStatsUseCase getDashboardStatsUseCase;
  final GetRecentActivityUseCase getRecentActivityUseCase;

  DashboardCubit({
    required this.getDashboardStatsUseCase,
    required this.getRecentActivityUseCase,
  }) : super(const DashboardState.initial());

  Future<void> getDashboardStats() async {
    emit(const DashboardState.loading());

    final statsResult = await getDashboardStatsUseCase(NoParams());
    final activityResult = await getRecentActivityUseCase(
      const RecentActivityParams(),
    );

    statsResult.fold(
      (failure) => emit(DashboardState.error(message: failure.message)),
      (stats) {
        activityResult.fold(
          (failure) => emit(DashboardState.error(message: failure.message)),
          (activity) => emit(DashboardState.loaded(
            stats: stats,
            recentActivity: activity,
          )),
        );
      },
    );
  }

  Future<void> getRecentActivity({
    int page = 1,
    int limit = 10,
  }) async {
    final result = await getRecentActivityUseCase(
      RecentActivityParams(page: page, limit: limit),
    );

    result.fold(
      (failure) => emit(DashboardState.error(message: failure.message)),
      (activity) {
        // For now, just update with recent activity
        // In a real app, you might want to preserve existing stats
        emit(DashboardState.loaded(
          stats: null, // You might want to preserve existing stats here
          recentActivity: activity,
        ));
      },
    );
  }

  Future<void> refreshDashboard() async {
    getDashboardStats();
  }
}