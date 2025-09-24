part of 'media_cubit.dart';

@freezed
class MediaState with _$MediaState {
  const factory MediaState.initial() = _Initial;
  const factory MediaState.loading() = _Loading;
  const factory MediaState.loaded({
    required List<MediaModel> media,
  }) = _Loaded;
  const factory MediaState.error({
    required String message,
  }) = _Error;
}