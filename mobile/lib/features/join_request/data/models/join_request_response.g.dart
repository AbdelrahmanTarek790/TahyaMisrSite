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
      current: (json['current'] as num).toInt(),
      total: (json['total'] as num).toInt(),
      count: (json['count'] as num).toInt(),
      totalCount: (json['totalCount'] as num).toInt(),
    );

Map<String, dynamic> _$PaginationToJson(Pagination instance) =>
    <String, dynamic>{
      'current': instance.current,
      'total': instance.total,
      'count': instance.count,
      'totalCount': instance.totalCount,
    };
