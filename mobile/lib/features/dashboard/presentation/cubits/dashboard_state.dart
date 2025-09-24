part of 'dashboard_cubit.dart';

@freezed
class DashboardState with _$DashboardState {
  const factory DashboardState.initial() = _Initial;
  const factory DashboardState.loading() = _Loading;
  const factory DashboardState.loaded({
    required DashboardStatsModel stats,
    required List<RecentActivityModel> activities,
  }) = _Loaded;
  const factory DashboardState.statsLoaded({
    required DashboardStatsModel stats,
  }) = _StatsLoaded;
  const factory DashboardState.activitiesLoaded({
    required List<RecentActivityModel> activities,
  }) = _ActivitiesLoaded;
  const factory DashboardState.error({
    required String message,
  }) = _Error;
}