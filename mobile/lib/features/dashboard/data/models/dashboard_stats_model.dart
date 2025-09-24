import 'package:json_annotation/json_annotation.dart';
import 'package:equatable/equatable.dart';

part 'dashboard_stats_model.g.dart';

@JsonSerializable()
class DashboardStatsModel extends Equatable {
  final int totalUsers;
  final int totalNews;
  final int totalEvents;
  final int totalMedia;
  final int activeUsers;
  final int pendingEvents;

  const DashboardStatsModel({
    required this.totalUsers,
    required this.totalNews,
    required this.totalEvents,
    required this.totalMedia,
    required this.activeUsers,
    required this.pendingEvents,
  });

  @override
  List<Object?> get props => [
    totalUsers,
    totalNews,
    totalEvents,
    totalMedia,
    activeUsers,
    pendingEvents,
  ];

  factory DashboardStatsModel.fromJson(Map<String, dynamic> json) =>
      _$DashboardStatsModelFromJson(json);

  Map<String, dynamic> toJson() => _$DashboardStatsModelToJson(this);
}