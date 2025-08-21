// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'dashboard_stats_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

DashboardStatsModel _$DashboardStatsModelFromJson(Map<String, dynamic> json) =>
    DashboardStatsModel(
      totalUsers: json['totalUsers'] as int,
      totalNews: json['totalNews'] as int,
      totalEvents: json['totalEvents'] as int,
      totalMedia: json['totalMedia'] as int,
      activeUsers: json['activeUsers'] as int,
      pendingEvents: json['pendingEvents'] as int,
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