import 'package:freezed_annotation/freezed_annotation.dart';
import '../../domain/entities/news.dart';

part 'news_state.freezed.dart';

@freezed
class NewsState with _$NewsState {
  const factory NewsState.initial() = _Initial;
  const factory NewsState.loading() = _Loading;
  const factory NewsState.loaded({
    required List<News> news,
  }) = _Loaded;
  const factory NewsState.error({
    required String message,
  }) = _Error;

}