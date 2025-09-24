part of 'news_cubit.dart';

@freezed
class NewsState with _$NewsState {
  const factory NewsState.initial() = _Initial;
  const factory NewsState.loading() = _Loading;
  const factory NewsState.loaded({
    required List<NewsModel> news,
  }) = _Loaded;
  const factory NewsState.error({
    required String message,
  }) = _Error;

  const factory NewsState.loadedDetails({
    required NewsModel newsDetails,
  }) = _LoadedDetails;
}