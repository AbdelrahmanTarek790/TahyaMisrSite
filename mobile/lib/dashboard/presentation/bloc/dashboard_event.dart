import 'package:freezed_annotation/freezed_annotation.dart';

part 'dashboard_event.freezed.dart';

@freezed
class DashboardEvent with _$DashboardEvent {
  const factory DashboardEvent.getDashboardStats() = GetDashboardStats;
  
  const factory DashboardEvent.getRecentActivity({
    @Default(1) int page,
    @Default(10) int limit,
  }) = GetRecentActivity;
  
  const factory DashboardEvent.refreshDashboard() = RefreshDashboard;
}