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

  const factory NewsState.newsCreated({
    required NewsModel news,
  }) = _NewsCreated;
  const factory NewsState.deletingNews({
    required String newsId,
}) = _DeletingNews;


  const factory NewsState.newsUpdated({
    required NewsModel news,
  }) = _NewsUpdated;

}