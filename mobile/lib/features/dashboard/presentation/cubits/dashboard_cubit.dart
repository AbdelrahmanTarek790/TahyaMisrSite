import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:injectable/injectable.dart';
import '../../data/models/dashboard_stats_model.dart';
import '../../data/models/recent_activity_model.dart';
import '../../data/repositories/dashboard_repository.dart';

part 'dashboard_state.dart';
part 'dashboard_cubit.freezed.dart';

@injectable
class DashboardCubit extends Cubit<DashboardState> {
  final DashboardRepository dashboardRepository;

  DashboardCubit({required this.dashboardRepository}) : super(const DashboardState.initial());

  Future<void> getDashboardStats() async {
    emit(const DashboardState.loading());
    final result = await dashboardRepository.getDashboardStats();
    result.fold(
      (failure) => emit(DashboardState.error(message: failure.message)),
      (stats) {
        emit(DashboardState.statsLoaded(stats: stats));
      },
    );
  }

  Future<void> getRecentActivity({int page = 1, int limit = 10}) async {
    emit(const DashboardState.loading());
    final result = await dashboardRepository.getRecentActivity(page: page, limit: limit);
    result.fold(
      (failure) => emit(DashboardState.error(message: failure.message)),
      (activities) => emit(DashboardState.activitiesLoaded(activities: activities)),
    );
  }

  Future<void> getDashboardData() async {
    emit(const DashboardState.loading());
    
    final statsResult = await dashboardRepository.getDashboardStats();
    final activitiesResult = await dashboardRepository.getRecentActivity();
    
    if (statsResult.isLeft()) {
      final failure = statsResult.swap().getOrElse(() => throw Exception());
      emit(DashboardState.error(message: failure.message));
      return;
    }
    
    if (activitiesResult.isLeft()) {
      final failure = activitiesResult.swap().getOrElse(() => throw Exception());
      emit(DashboardState.error(message: failure.message));
      return;
    }
    
    final stats = statsResult.getOrElse(() => throw Exception());
    final activities = activitiesResult.getOrElse(() => throw Exception());
    
    emit(DashboardState.loaded(stats: stats, activities: activities));
  }

  Future<void> refreshDashboard() async {
    await getDashboardData();
  }




}