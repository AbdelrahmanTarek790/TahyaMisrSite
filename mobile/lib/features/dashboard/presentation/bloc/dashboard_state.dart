import 'package:freezed_annotation/freezed_annotation.dart';

import '../../domain/entities/dashboard_stats.dart';
import '../../domain/entities/recent_activity.dart';

part 'dashboard_state.freezed.dart';

@freezed
class DashboardState with _$DashboardState {
  const factory DashboardState.initial() = Initial;
  
  const factory DashboardState.loading() = Loading;
  
  const factory DashboardState.loaded({
    required DashboardStats stats,
    required List<RecentActivity> recentActivity,
  }) = Loaded;
  
  const factory DashboardState.error({
    required String message,
  }) = Error;
}