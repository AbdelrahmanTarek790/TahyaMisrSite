import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/dashboard_stats.dart';

part 'dashboard_stats_model.g.dart';

@JsonSerializable()
class DashboardStatsModel extends DashboardStats {
  const DashboardStatsModel({
    required super.totalUsers,
    required super.totalNews,
    required super.totalEvents,
    required super.totalMedia,
    required super.activeUsers,
    required super.pendingEvents,
  });

  factory DashboardStatsModel.fromJson(Map<String, dynamic> json) =>
      _$DashboardStatsModelFromJson(json);

  Map<String, dynamic> toJson() => _$DashboardStatsModelToJson(this);

  factory DashboardStatsModel.fromEntity(DashboardStats stats) {
    return DashboardStatsModel(
      totalUsers: stats.totalUsers,
      totalNews: stats.totalNews,
      totalEvents: stats.totalEvents,
      totalMedia: stats.totalMedia,
      activeUsers: stats.activeUsers,
      pendingEvents: stats.pendingEvents,
    );
  }
}