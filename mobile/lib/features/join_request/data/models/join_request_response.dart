import 'package:json_annotation/json_annotation.dart';
import 'join_request_model.dart';

part 'join_request_response.g.dart';

@JsonSerializable()
class JoinRequestResponse {
  final List<JoinRequestModel> joinRequests;
  final Pagination pagination;

  JoinRequestResponse({
    required this.joinRequests,
    required this.pagination,
  });

  factory JoinRequestResponse.fromJson(Map<String, dynamic> json) =>
      _$JoinRequestResponseFromJson(json);

  Map<String, dynamic> toJson() => _$JoinRequestResponseToJson(this);
}

@JsonSerializable()
class Pagination {
  final int current;
  final int total;
  final int count;
  final int totalCount;

  Pagination({
    required this.current,
    required this.total,
    required this.count,
    required this.totalCount,
  });

  factory Pagination.fromJson(Map<String, dynamic> json) =>
      _$PaginationFromJson(json);

  Map<String, dynamic> toJson() => _$PaginationToJson(this);
}