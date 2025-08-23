import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/usecases/usecase.dart';
import '../../domain/usecases/get_dashboard_stats_usecase.dart';
import '../../domain/usecases/get_recent_activity_usecase.dart';
import 'dashboard_event.dart';
import 'dashboard_state.dart';

@injectable
class DashboardBloc extends Bloc<DashboardEvent, DashboardState> {
  final GetDashboardStatsUseCase getDashboardStatsUseCase;
  final GetRecentActivityUseCase getRecentActivityUseCase;

  DashboardBloc({
    required this.getDashboardStatsUseCase,
    required this.getRecentActivityUseCase,
  }) : super(const DashboardState.initial()) {
    on<GetDashboardStats>(_onGetDashboardStats);
    on<GetRecentActivity>(_onGetRecentActivity);
    on<RefreshDashboard>(_onRefreshDashboard);
  }

  Future<void> _onGetDashboardStats(
    GetDashboardStats event,
    Emitter<DashboardState> emit,
  ) async {
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

  Future<void> _onGetRecentActivity(
    GetRecentActivity event,
    Emitter<DashboardState> emit,
  ) async {
    // For pagination, we might want to handle this differently
    // For now, just refresh the whole dashboard
    add(const DashboardEvent.getDashboardStats());
  }

  Future<void> _onRefreshDashboard(
    RefreshDashboard event,
    Emitter<DashboardState> emit,
  ) async {
    add(const DashboardEvent.getDashboardStats());
  }
}