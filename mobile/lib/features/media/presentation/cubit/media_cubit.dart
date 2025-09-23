import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../domain/usecases/get_media_usecase.dart';
import '../bloc/media_state.dart';

@injectable
class MediaCubit extends Cubit<MediaState> {
  final GetMediaUseCase getMediaUseCase;

  MediaCubit({
    required this.getMediaUseCase,
  }) : super(const MediaState.initial());

  Future<void> getMedia() async {
    emit(const MediaState.loading());

    final result = await getMediaUseCase(const MediaParams());

    result.fold(
      (failure) => emit(MediaState.error(message: failure.message)),
      (media) => emit(MediaState.loaded(media: media)),
    );
  }

  Future<void> refreshMedia() async {
    getMedia();
  }

  Future<void> getMediaById(String id) async {
    emit(const MediaState.loading());
    
    // For now, just reload all media
    // In a real implementation, you might have a separate use case for getting by ID
    final result = await getMediaUseCase(const MediaParams());
    
    result.fold(
      (failure) => emit(MediaState.error(message: failure.message)),
      (media) {
        // Filter to find the specific media item
        final specificMedia = media.where((item) => item.id == id).toList();
        emit(MediaState.loaded(media: specificMedia));
      },
    );
  }
}