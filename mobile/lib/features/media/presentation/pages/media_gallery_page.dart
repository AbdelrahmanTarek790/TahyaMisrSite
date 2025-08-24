import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../domain/entities/media.dart';
import '../bloc/media_bloc.dart';
import '../bloc/media_state.dart';
import '../bloc/media_event.dart';

class MediaGalleryPage extends StatefulWidget {
  const MediaGalleryPage({super.key});

  @override
  State<MediaGalleryPage> createState() => _MediaGalleryPageState();
}

class _MediaGalleryPageState extends State<MediaGalleryPage> {
  late MediaBloc _mediaBloc;

  @override
  void initState() {
    super.initState();
    _mediaBloc = GetIt.instance<MediaBloc>();
    _mediaBloc.add(const MediaEvent.getMedia());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('معرض الصور'),
        backgroundColor: Theme.of(context).colorScheme.surface,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              _mediaBloc.add(const MediaEvent.refreshMedia());
            },
          ),
        ],
      ),
      body: BlocProvider.value(
        value: _mediaBloc,
        child: BlocBuilder<MediaBloc, MediaState>(
          builder: (context, state) {
            return state.when(
              initial: () => const Center(
                child: CircularProgressIndicator(),
              ),
              loading: () => const Center(
                child: CircularProgressIndicator(),
              ),
              loaded: (mediaList) => mediaList.isEmpty
                  ? const Center(
                      child: Text('لا توجد صور متاحة'),
                    )
                  : RefreshIndicator(
                      onRefresh: () async {
                        _mediaBloc.add(const MediaEvent.refreshMedia());
                      },
                      child: Padding(
                        padding: const EdgeInsets.all(8),
                        child: GridView.builder(
                          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            crossAxisSpacing: 8,
                            mainAxisSpacing: 8,
                          ),
                          itemCount: mediaList.length,
                          itemBuilder: (context, index) {
                            final media = mediaList[index];
                            return _MediaCard(media: media)
                                .animate(delay: (index * 50).ms)
                                .scale(begin: const Offset(0.8, 0.8))
                                .fadeIn();
                          },
                        ),
                      ),
                    ),
              error: (message) => Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(
                      Icons.error_outline,
                      size: 64,
                      color: Colors.red,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'حدث خطأ',
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      message,
                      style: Theme.of(context).textTheme.bodyMedium,
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton(
                      onPressed: () {
                        _mediaBloc.add(const MediaEvent.refreshMedia());
                      },
                      child: const Text('إعادة المحاولة'),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}

class _MediaCard extends StatelessWidget {
  final Media media;

  const _MediaCard({required this.media});

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () {
          // TODO: Open image viewer
          _showImageViewer(context, media);
        },
        child: Stack(
          fit: StackFit.expand,
          children: [
            media.url.isNotEmpty
                ? Image.network(
                    media.url,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => Container(
                      color: Theme.of(context).colorScheme.surfaceContainerHighest,
                      child: Icon(
                        Icons.image_not_supported,
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                        size: 48,
                      ),
                    ),
                  )
                : Container(
                    color: Theme.of(context).colorScheme.surfaceContainerHighest,
                    child: Icon(
                      Icons.photo_library,
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                      size: 48,
                    ),
                  ),
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.bottomCenter,
                    end: Alignment.topCenter,
                    colors: [
                      Colors.black.withValues(alpha: 0.7),
                      Colors.transparent,
                    ],
                  ),
                ),
                padding: const EdgeInsets.all(8),
                child: Text(
                  media.caption ?? 'صورة',
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                    fontSize: 12,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showImageViewer(BuildContext context, Media media) {
    showDialog(
      context: context,
      builder: (context) => Dialog(
        backgroundColor: Colors.transparent,
        child: Stack(
          children: [
            GestureDetector(
              onTap: () => Navigator.of(context).pop(),
              child: Container(
                width: double.infinity,
                height: double.infinity,
                color: Colors.black.withValues(alpha: 0.8),
                child: Center(
                  child: media.url.isNotEmpty
                      ? Image.network(
                          media.url,
                          fit: BoxFit.contain,
                        )
                      : const Icon(
                          Icons.image_not_supported,
                          color: Colors.white,
                          size: 64,
                        ),
                ),
              ),
            ),
            Positioned(
              top: 40,
              right: 20,
              child: IconButton(
                icon: const Icon(
                  Icons.close,
                  color: Colors.white,
                  size: 30,
                ),
                onPressed: () => Navigator.of(context).pop(),
              ),
            ),
            if (media.caption != null && media.caption!.isNotEmpty)
              Positioned(
                bottom: 40,
                left: 20,
                right: 20,
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.7),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    media.caption ?? 'صورة',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('معرض الصور'),
        actions: [
          IconButton(
            icon: const Icon(Icons.photo_camera),
            onPressed: () {
              // TODO: Implement camera functionality
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(8),
        child: GridView.builder(
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 8,
            mainAxisSpacing: 8,
          ),
          itemCount: 20,
          itemBuilder: (context, index) {
            return Card(
              clipBehavior: Clip.antiAlias,
              child: InkWell(
                onTap: () {
                  // TODO: Open image viewer
                },
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    Image.network(
                      'https://picsum.photos/300/300?random=$index',
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) => Container(
                        color: Theme.of(context).colorScheme.surfaceContainerHighest,
                        child: Icon(
                          Icons.image_not_supported,
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                        ),
                      ),
                    ),
                    Positioned(
                      bottom: 0,
                      left: 0,
                      right: 0,
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.bottomCenter,
                            end: Alignment.topCenter,
                            colors: [
                              Colors.black.withValues(alpha: 0.7),
                              Colors.transparent,
                            ],
                          ),
                        ),
                        padding: const EdgeInsets.all(8),
                        child: Text(
                          'صورة ${index + 1}',
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ).animate().fadeIn(delay: (index * 50).ms).scale(begin: const Offset(0.8, 0.8));
          },
        ),
      ),
    );
  }