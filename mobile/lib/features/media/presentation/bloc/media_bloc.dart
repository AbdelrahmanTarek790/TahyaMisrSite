import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../../../core/usecases/usecase.dart';
import '../../domain/usecases/get_media_usecase.dart';
import 'media_event.dart';
import 'media_state.dart';

@injectable
class MediaBloc extends Bloc<MediaEvent, MediaState> {
  final GetMediaUseCase getMediaUseCase;

  MediaBloc({
    required this.getMediaUseCase,
  }) : super(const MediaState.initial()) {
    on<GetMedia>(_onGetMedia);
    on<RefreshMedia>(_onRefreshMedia);
    on<GetMediaById>(_onGetMediaById);
  }

  Future<void> _onGetMedia(
    GetMedia event,
    Emitter<MediaState> emit,
  ) async {
    emit(const MediaState.loading());

    final result = await getMediaUseCase(const MediaParams());

    result.fold(
      (failure) => emit(MediaState.error(message: failure.message)),
      (media) => emit(MediaState.loaded(media: media)),
    );
  }

  Future<void> _onRefreshMedia(
    RefreshMedia event,
    Emitter<MediaState> emit,
  ) async {
    add(const MediaEvent.getMedia());
  }

  Future<void> _onGetMediaById(
    GetMediaById event,
    Emitter<MediaState> emit,
  ) async {
    // This would need a separate usecase for getting single media item
    // For now, just refresh the list
    add(const MediaEvent.getMedia());
  }
}