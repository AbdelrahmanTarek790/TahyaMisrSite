import 'package:freezed_annotation/freezed_annotation.dart';

part 'media_event.freezed.dart';

@freezed
class MediaEvent with _$MediaEvent {
  const factory MediaEvent.getMedia() = GetMedia;
  const factory MediaEvent.refreshMedia() = RefreshMedia;
  const factory MediaEvent.getMediaById(String id) = GetMediaById;
}