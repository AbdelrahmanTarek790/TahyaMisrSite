import 'package:flutter_mediaCubit.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:injectable/injectable.dart';
import '../../data/models/media_model.dart';
import '../../data/repositories/media_repository.dart';

part 'media_state.dart';
part 'media_cubit.freezed.dart';

@injectable
class MediaCubit extends Cubit<MediaState> {
  final MediaRepository mediaRepository;

  MediaCubit({required this.mediaRepository}) : super(const MediaState.initial());

  Future<void> getMedia({int page = 1, int limit = 10}) async {
    emit(const MediaState.loading());
    final result = await mediaRepository.getMedia(page: page, limit: limit);
    result.fold(
      (failure) => emit(MediaState.error(message: failure.message)),
      (media) => emit(MediaState.loaded(media: media)),
    );
  }

  Future<void> refreshMedia() async {
    await getMedia();
  }
}