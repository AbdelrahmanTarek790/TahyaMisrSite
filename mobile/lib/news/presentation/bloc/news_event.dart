import 'package:freezed_annotation/freezed_annotation.dart';

part 'news_event.freezed.dart';

@freezed
class NewsEvent with _$NewsEvent {
  const factory NewsEvent.getNews() = GetNews;
  const factory NewsEvent.refreshNews() = RefreshNews;
  const factory NewsEvent.getNewsById(String id) = GetNewsById;
}