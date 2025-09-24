import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';

import '../cubits/news_cubit.dart';
import '../../data/models/news_model.dart';

class NewsDetailPage extends StatefulWidget {
  final String newsId;

  const NewsDetailPage({
    super.key,
    required this.newsId,
  });

  @override
  State<NewsDetailPage> createState() => _NewsDetailPageState();
}

class _NewsDetailPageState extends State<NewsDetailPage> {
  late NewsCubit _newsCubit;

  @override
  void initState() {
    super.initState();
    _newsCubit = GetIt.instance<NewsCubit>();

    _newsCubit.getNewsById(widget.newsId);
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider.value(
      value: _newsCubit,
      child: BlocConsumer<NewsCubit, NewsState>(
        listener: (context, state) {
          state.whenOrNull(
            loaded: (news) {},
            error: (message) {},
          );
        },
        builder: (context, state) {
          return SafeArea(
            child: Scaffold(
              body: state.when(
                initial: () => const Center(child: CircularProgressIndicator()),
                loading: () => const Center(child: CircularProgressIndicator()),
                  loaded: (_) => const Center(child: CircularProgressIndicator()),
                loadedDetails: (newsData) {
                  if (newsData.id.isEmpty) {
                    return Center(
                      child: Text(
                        'لم يتم العثور على الخبر',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                    );
                  }
                  return CustomScrollView(
                    slivers: [
                      SliverAppBar(
                        expandedHeight: 400,
                        pinned: true,
                        flexibleSpace: FlexibleSpaceBar(
                          background: Image.network(
                            newsData.imageUrl ?? '',
                            fit: BoxFit.fill,
                            errorBuilder: (context, error, stackTrace) =>
                                Container(
                              color: Theme.of(context)
                                  .colorScheme
                                  .surfaceContainerHighest,
                              child: Icon(
                                Icons.image_not_supported,
                                size: 64,
                                color: Theme.of(context)
                                    .colorScheme
                                    .onSurfaceVariant,
                              ),
                            ),
                          ),
                        ),
                      ),
                      SliverToBoxAdapter(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Title
                              Text(
                                newsData.title,
                                style: Theme.of(context)
                                    .textTheme
                                    .headlineMedium
                                    ?.copyWith(
                                      fontWeight: FontWeight.bold,
                                    ),
                              ).animate().fadeIn().slideY(begin: 0.3, end: 0),

                              const SizedBox(height: 16),

                              // Meta Info
                              Row(
                                children: [
                                  CircleAvatar(
                                    radius: 20,
                                    backgroundColor:
                                        Theme.of(context).colorScheme.primary,
                                    child: Icon(
                                      Icons.person,
                                      color: Theme.of(context)
                                          .colorScheme
                                          .onPrimary,
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          newsData.author,
                                          style: Theme.of(context)
                                              .textTheme
                                              .titleMedium
                                              ?.copyWith(
                                                fontWeight: FontWeight.w600,
                                              ),
                                        ),
                                        Text(
                                          'منذ ${DateTime.now().difference( newsData.createdAt).inHours} ساعات',
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodySmall
                                              ?.copyWith(
                                                color: Theme.of(context)
                                                    .colorScheme
                                                    .onSurface
                                                    .withValues(alpha: 0.6),
                                              ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  IconButton(
                                    icon: const Icon(Icons.share),
                                    onPressed: () {
                                      // TODO: Implement share functionality
                                    },
                                  ),
                                  IconButton(
                                    icon: const Icon(Icons.bookmark_outline),
                                    onPressed: () {},
                                  ),
                                ],
                              )
                                  .animate()
                                  .fadeIn(delay: 200.ms)
                                  .slideX(begin: -0.3, end: 0),

                              const SizedBox(height: 24),

                              // Content
                              Text(
                                newsData.content,
                                style: Theme.of(context)
                                    .textTheme
                                    .bodyLarge
                                    ?.copyWith(
                                      height: 1.6,
                                    ),
                              ).animate().fadeIn(delay: 400.ms),

                              const SizedBox(height: 10),
                            ],
                          ),
                        ),
                      ),
                    ],
                  );
                },
                error: (String message) {
                  return null;
                },
              ),
            ),
          );
        },
      ),
    );
  }
}
