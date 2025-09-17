import 'package:freezed_annotation/freezed_annotation.dart';
import '../../domain/entities/media.dart';

part 'media_state.freezed.dart';

@freezed
class MediaState with _$MediaState {
  const factory MediaState.initial() = _Initial;
  const factory MediaState.loading() = _Loading;
  const factory MediaState.loaded({
    required List<Media> media,
  }) = _Loaded;
  const factory MediaState.error({
    required String message,
  }) = _Error;
}