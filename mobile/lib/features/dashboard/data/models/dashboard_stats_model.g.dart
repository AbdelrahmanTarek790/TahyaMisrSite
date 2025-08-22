// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'dashboard_stats_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

DashboardStatsModel _$DashboardStatsModelFromJson(Map<String, dynamic> json) =>
    DashboardStatsModel(
      totalUsers: (json['totalUsers'] as num).toInt(),
      totalNews: (json['totalNews'] as num).toInt(),
      totalEvents: (json['totalEvents'] as num).toInt(),
      totalMedia: (json['totalMedia'] as num).toInt(),
      activeUsers: (json['activeUsers'] as num).toInt(),
      pendingEvents: (json['pendingEvents'] as num).toInt(),
    );

Map<String, dynamic> _$DashboardStatsModelToJson(
        DashboardStatsModel instance) =>
    <String, dynamic>{
      'totalUsers': instance.totalUsers,
      'totalNews': instance.totalNews,
      'totalEvents': instance.totalEvents,
      'totalMedia': instance.totalMedia,
      'activeUsers': instance.activeUsers,
      'pendingEvents': instance.pendingEvents,
    };
