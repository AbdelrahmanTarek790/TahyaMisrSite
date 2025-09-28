import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:go_router/go_router.dart';
import 'package:infinite_scroll_pagination/infinite_scroll_pagination.dart';
import 'package:skeletonizer/skeletonizer.dart';
import 'package:tahya_misr_app/core/constants/app_theme.dart';
import 'package:tahya_misr_app/core/dependency_injection/injection.dart';
import 'package:tahya_misr_app/shared/widgets/main_navigation.dart';
import 'package:toastification/toastification.dart';

import '../../../../../gen_l10n/app_localizations.dart';
import '../../../../news/data/models/news_model.dart';
import '../../../../news/presentation/cubits/news_cubit.dart';
import '../../../../news/presentation/pages/news_list_page.dart';
import 'create_news_page.dart';
import 'edit_news_page.dart';

class MangeNews extends StatefulWidget {
  const MangeNews({super.key});

  @override
  State<MangeNews> createState() => _MangeNewsState();
}

class _MangeNewsState extends State<MangeNews> {
  final PagingController<int, NewsModel> _pagingController =
      PagingController(firstPageKey: 0);

  late NewsCubit _newsBloc;

  @override
  void initState() {
    super.initState();
    _newsBloc = GetIt.instance<NewsCubit>();

    _pagingController.addPageRequestListener((pageKey) {
      _newsBloc.getNews();
    });
  }

  @override
  void dispose() {
    _pagingController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return BlocProvider.value(
      value: _newsBloc,
      child: BlocConsumer<NewsCubit, NewsState>(
        listener: (context, state) {
          state.whenOrNull(
            loaded: (news) {
              final isLastPage = news.length < 10;
              if (isLastPage) {
                _pagingController.appendLastPage(news);
              } else {
                final nextPageKey = _pagingController.nextPageKey! + 1;
                _pagingController.appendPage(news, nextPageKey);
              }
            },
            error: (message) {
              _pagingController.error = message;
            },
            newsCreated: (newNews) {
              getIt<ShowToast>().showToast(
                context: context,
                message: 'تم إنشاء الخبر بنجاح',
                type: ToastificationType.success,
              );

              final currentList = List<NewsModel>.from(_pagingController.itemList ?? []);
              currentList.insert(0, newNews);

              _pagingController.itemList = currentList;

              Navigator.of(context).pop();
            },
            deletingNews: (id) {
              getIt<ShowToast>().showToast(
                context: context,
                message: 'جاري حذف الخبر...',
                type: ToastificationType.info,
              );
              final currentList = List<NewsModel>.from(_pagingController.itemList ?? []);
              currentList.removeWhere((news) => news.id == id);

              _pagingController.itemList = currentList;
            },
            newsUpdated: (updatedNews) {
              getIt<ShowToast>().showToast(
                context: context,
                message: 'تم تحديث الخبر بنجاح',
                type: ToastificationType.success,
              );

              final currentList = List<NewsModel>.from(_pagingController.itemList ?? []);
              final index = currentList.indexWhere((news) => news.id == updatedNews.id);
              if (index != -1) {
                currentList[index] = updatedNews;
                _pagingController.itemList = currentList;
              }
            },
          );
        },
        builder: (context, state) => Scaffold(
          appBar: AppBar(
            title: const Text('الأخبار'),
            actions: [
              TextButton(
                child: Text(
                  l10n.addNews,
                  style: const TextStyle(color: AppTheme.primaryColor),
                ),
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (context) =>  BlocProvider.value(
                          value: _newsBloc,
                          child: const CreateNewsPage(),),
                    ),
                  );
                },
              ),
            ],
          ),
          body: RefreshIndicator(
            onRefresh: () => Future.sync(_pagingController.refresh),
            child: PagedListView<int, NewsModel>(
              pagingController: _pagingController,
              builderDelegate: PagedChildBuilderDelegate<NewsModel>(
                itemBuilder: (context, news, index) => MangeNewsCard(
                  news: news,
                  index: index,
                  newsCubit: _newsBloc,
                ),
                firstPageProgressIndicatorBuilder: (context) =>
                    _buildSkeleton(),
                newPageProgressIndicatorBuilder: (context) => const Center(
                  child: Padding(
                    padding: EdgeInsets.all(16.0),
                    child: CircularProgressIndicator(),
                  ),
                ),
                noItemsFoundIndicatorBuilder: (context) => Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.article_outlined,
                        size: 64,
                        color: Theme.of(context)
                            .colorScheme
                            .onSurface
                            .withValues(alpha: 0.5),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'لا توجد أخبار متاحة',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              color: Theme.of(context)
                                  .colorScheme
                                  .onSurface
                                  .withValues(alpha: 0.7),
                            ),
                      ),
                    ],
                  ),
                ),
                firstPageErrorIndicatorBuilder: (context) => Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.error_outline,
                        size: 64,
                        color: Theme.of(context).colorScheme.error,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'حدث خطأ في تحميل الأخبار',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              color: Theme.of(context).colorScheme.error,
                            ),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _pagingController.refresh,
                        child: const Text('إعادة المحاولة'),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSkeleton() {
    return Skeletonizer(
      enabled: true,
      child: ListView.builder(
        itemCount: 5,
        itemBuilder: (context, index) => NewsCard(
          news: NewsModel(
            id: 'skeleton',
            title: 'عنوان الخبر التجريبي',
            content: 'محتوى الخبر التجريبي للعرض التوضيحي',
            createdAt: DateTime.now(),
            updatedAt: DateTime.now(),
            author: 'كاتب تجريبي',
          ),
          index: index,
        ),
      ),
    );
  }
}

class MangeNewsCard extends StatelessWidget {
  final NewsModel news;
  final int index;
  final NewsCubit newsCubit ;

  const MangeNewsCard({
    super.key,
    required this.news,
    required this.index,
    required this.newsCubit,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (news.imageUrl != null)
            ClipRRect(
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(16),
                topRight: Radius.circular(16),
              ),
              child: AspectRatio(
                aspectRatio: 16 / 9,
                child: Image.network(
                  news.imageUrl!,
                  fit: BoxFit.fill,
                  errorBuilder: (context, error, stackTrace) => Container(
                    color:
                        Theme.of(context).colorScheme.surfaceContainerHighest,
                    child: Icon(
                      Icons.image_not_supported,
                      size: 48,
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
                  ),
                ),
              ),
            ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  news.title,
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 8),
                Text(
                  news.content,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Theme.of(context)
                            .colorScheme
                            .onSurface
                            .withValues(alpha: 0.7),
                      ),
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Icon(
                      Icons.person_outline,
                      size: 16,
                      color: Theme.of(context)
                          .colorScheme
                          .onSurface
                          .withValues(alpha: 0.5),
                    ),
                    const SizedBox(width: 2),
                    Text(
                      news.author,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: Theme.of(context)
                                .colorScheme
                                .onSurface
                                .withValues(alpha: 0.5),
                          ),
                    ),
                    const Spacer(),
                    IconButton(
                      icon: const Icon(Icons.edit, size: 20),
                      onPressed: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (context) =>  BlocProvider.value(
                                value: newsCubit,
                                child: EditNewsPage(newsId: news.id,newsBloc: newsCubit,),),
                          ),
                        );
                      },
                    ),
                    IconButton(
                      icon: const Icon(Icons.delete, size: 20),
                      onPressed: () {
                        context.read<NewsCubit>().deleteNews(news.id);
                      },
                    ),
                    IconButton(
                      icon: const Icon(Icons.remove_red_eye, size: 16),
                      onPressed: () {
                        context.push('/news/detail/${news.id}');
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    ).animate().fadeIn(delay: (index * 100).ms).slideY(begin: 0.3, end: 0);
  }
}
