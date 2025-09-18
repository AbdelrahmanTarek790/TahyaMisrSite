import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';

import '../../domain/entities/news.dart';
import '../bloc/news_bloc.dart';
import '../bloc/news_event.dart';
import '../bloc/news_state.dart';

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
  late NewsBloc _newsBloc;
  News news = News(
    id: '',
    title: '',
    content: '',
    author: '',
    createdAt: DateTime(1970),
    updatedAt: DateTime(1970),
  );

  @override
  void initState() {
    super.initState();
    _newsBloc = GetIt.instance<NewsBloc>();

    _newsBloc.add(NewsEvent.getNewsById(widget.newsId));
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider.value(
      value: _newsBloc,
      child: BlocConsumer<NewsBloc, NewsState>(
        listener: (context, state) {
          state.whenOrNull(
            loaded: (news) {

            },
            error: (message) {},
          );
        },
        builder: (context, state) {
          return SafeArea(
            child: Scaffold(
              body: state.when(
                initial: () => const Center(child: CircularProgressIndicator()),
                loading: () => const Center(child: CircularProgressIndicator()),
                loaded: (newsData) {
                  if (newsData.isEmpty) {
                    return Center(
                      child: Text(
                        'لم يتم العثور على الخبر',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                    );
                  }
                  final news = newsData.first;
                  return CustomScrollView(
                  slivers: [
                    SliverAppBar(
                      expandedHeight: 400,
                      pinned: true,
                      flexibleSpace: FlexibleSpaceBar(
                        background: Image.network(
                          news.imageUrl ?? '',
                          fit: BoxFit.fill,
                          errorBuilder: (context, error, stackTrace) =>
                              Container(
                            color: Theme.of(context).colorScheme.surfaceContainerHighest,
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
                              news.title,
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
                                    color:
                                        Theme.of(context).colorScheme.onPrimary,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        news.author,
                                        style: Theme.of(context)
                                            .textTheme
                                            .titleMedium
                                            ?.copyWith(
                                              fontWeight: FontWeight.w600,
                                            ),
                                      ),
                                      Text(
                                        'منذ ${DateTime.now().difference(news.createdAt).inHours} ساعات',
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
                              news.content,
                              style: Theme.of(context)
                                  .textTheme
                                  .bodyLarge
                                  ?.copyWith(
                                    height: 1.6,
                                  ),
                            ).animate().fadeIn(delay: 400.ms),

                            const SizedBox(height: 32),

/*                          // Tags
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children:
                                ['أخبار', 'طلاب', 'مصر', 'تعليم'].map((tag) {
                              return Chip(
                                label: Text(tag),
                                backgroundColor: Theme.of(context)
                                    .colorScheme
                                    .secondaryContainer,
                                labelStyle: TextStyle(
                                  color: Theme.of(context)
                                      .colorScheme
                                      .onSecondaryContainer,
                                ),
                              );
                            }).toList(),
                          )
                              .animate()
                              .fadeIn(delay: 600.ms)
                              .slideY(begin: 0.3, end: 0),

                          const SizedBox(height: 32),

                          // Related News Section
                          Text(
                            'أخبار ذات صلة',
                            style:
                                Theme.of(context).textTheme.titleLarge?.copyWith(
                                      fontWeight: FontWeight.bold,
                                    ),
                          ).animate().fadeIn(delay: 800.ms),

                          const SizedBox(height: 16),

                          // Related News List
                          ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: 3,
                            itemBuilder: (context, index) {
                              return ListTile(
                                leading: ClipRRect(
                                  borderRadius: BorderRadius.circular(8),
                                  child: Image.network(
                                    'https://picsum.photos/60/60?random=${index + 100}',
                                    width: 60,
                                    height: 60,
                                    fit: BoxFit.cover,
                                    errorBuilder: (context, error, stackTrace) =>
                                        Container(
                                      width: 60,
                                      height: 60,
                                      color: Theme.of(context)
                                          .colorScheme
                                          .surfaceVariant,
                                      child: Icon(
                                        Icons.image_not_supported,
                                        color: Theme.of(context)
                                            .colorScheme
                                            .onSurfaceVariant,
                                      ),
                                    ),
                                  ),
                                ),
                                title: Text(
                                  'خبر ذو صلة رقم ${index + 1}',
                                  style: Theme.of(context).textTheme.titleMedium,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                subtitle: Text(
                                  'منذ ${index + 1} ساعات',
                                  style: Theme.of(context)
                                      .textTheme
                                      .bodySmall
                                      ?.copyWith(
                                        color: Theme.of(context)
                                            .colorScheme
                                            .onSurface
                                            .withOpacity(0.6),
                                      ),
                                ),
                                onTap: () {
                                  // TODO: Navigate to related news
                                },
                              )
                                  .animate()
                                  .fadeIn(delay: (1000 + index * 200).ms)
                                  .slideX(begin: 0.3, end: 0);
                            },
                          ),*/
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
