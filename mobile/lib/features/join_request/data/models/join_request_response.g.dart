// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'join_request_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

JoinRequestResponse _$JoinRequestResponseFromJson(Map<String, dynamic> json) =>
    JoinRequestResponse(
      joinRequests: (json['joinRequests'] as List<dynamic>)
          .map((e) => JoinRequestModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      pagination:
          Pagination.fromJson(json['pagination'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$JoinRequestResponseToJson(
        JoinRequestResponse instance) =>
    <String, dynamic>{
      'joinRequests': instance.joinRequests,
      'pagination': instance.pagination,
    };

Pagination _$PaginationFromJson(Map<String, dynamic> json) => Pagination(
      current: json['current'] as int,
      total: json['total'] as int,
      count: json['count'] as int,
      totalCount: json['totalCount'] as int,
    );

Map<String, dynamic> _$PaginationToJson(Pagination instance) =>
    <String, dynamic>{
      'current': instance.current,
      'total': instance.total,
      'count': instance.count,
      'totalCount': instance.totalCount,
    };