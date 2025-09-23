import 'dart:math';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:get_it/get_it.dart';
import 'package:intl/intl.dart';
import 'package:readmore/readmore.dart';
import 'package:tahya_misr_app/core/utils/settings_cubit.dart';
import 'package:tahya_misr_app/features/home/presentation/widgets/quick_access_cards_widget.dart';

import '../../../../core/constants/app_theme.dart';
import '../../../../core/utils/app_settings.dart';
import '../../../../gen_l10n/app_localizations.dart';
import '../../../news/presentation/cubit/news_cubit.dart';
import '../../../news/presentation/bloc/news_state.dart';
import '../../../events/presentation/cubit/events_cubit.dart';
import '../../../events/presentation/bloc/events_state.dart';
import '../../../media/presentation/cubit/media_cubit.dart';
import '../../../news/domain/entities/news.dart';
import '../../../events/domain/entities/event.dart';
import '../widgets/custom_icon_widget.dart';
import '../widgets/hero_banner_widget.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(
          create: (context) =>
              GetIt.instance<NewsCubit>()..getNews(),
        ),
        BlocProvider(
          create: (context) =>
              GetIt.instance<EventsCubit>()..getEvents(),
        ),
        BlocProvider(
          create: (context) =>
              GetIt.instance<MediaCubit>()..getMedia(),
        ),
      ],
      child: HomeView(),
    );
  }
}

class HomeView extends StatelessWidget {
  HomeView({super.key});

  final List<Map<String, dynamic>> achievementsData = [
    {
      'id': 1,
      'title': 'منتدي الطريق الى الجمهوريه الجديدة ',
      'image': 'assets/images/Achievements1.jpg',
    },
    {
      'id': 2,
      'title': ' القمه الشبابية العربيه',
      'image': 'assets/images/Achievements2.jpg',
    },
    {
      'id': 3,
      'title': 'المنتدي الوطني لبناء الوعي',
      'image': 'assets/images/Achievements3.jpg',
    },
    {
      'id': 4,
      'title': 'المبادرة الوطنية للبناء والتمكين',
      'image': 'assets/images/Achievements4.jpg',
    }
  ];

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.appTitle),
        backgroundColor: Theme.of(context).colorScheme.surface,
        elevation: 0,
        actions: [
          BlocBuilder<SettingsCubit, AppSettings>(
            builder: (context, settings) {
              return Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.language),
                    onPressed: () {
                      context.read<SettingsCubit>().changeLanguage(
                            settings.language == AppLanguage.arabic
                                ? AppLanguage.english
                                : AppLanguage.arabic,
                          );
                    },
                  ),
                  IconButton(
                    icon: Icon(
                      settings.themeMode == AppThemeMode.dark
                          ? Icons.dark_mode_outlined
                          : Icons.light_mode_outlined,
                    ),
                    onPressed: () {
                      context.read<SettingsCubit>().changeThemeMode(
                            settings.themeMode == AppThemeMode.dark
                                ? AppThemeMode.light
                                : AppThemeMode.dark,
                          );
                    },
                  ),
                ],
              );
            },
          ),
        ],
        leading: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 4.0),
          child: Image.asset(
              'assets/images/Logo.png',
          ),
        ),
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          context.read<NewsCubit>().getNews();
          context.read<EventsCubit>().getEvents();
          context.read<MediaCubit>().getMedia();
        },
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome message
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Theme.of(context).colorScheme.primary,
                      Theme.of(context)
                          .colorScheme
                          .primary
                          .withValues(alpha: 0.7),
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      l10n.appTitle,
                      style:
                          Theme.of(context).textTheme.headlineSmall?.copyWith(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                              ),
                    ),
                    const SizedBox(height: 8),
                    ReadMoreText(
                      l10n.comprehensiveManagement,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight:  FontWeight.bold,
                      ),
                      trimMode: TrimMode.Line,
                      trimLines: 3,
                      trimCollapsedText:  l10n.showMore,
                      trimExpandedText: l10n.showLess,
                      moreStyle: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      color: Colors.grey,
                      fontWeight: FontWeight.bold,
                    ),
                      lessStyle: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      color: Colors.grey,
                      fontWeight: FontWeight.bold,
                    ),
                    ),
                  ],
                ),
              ).animate().fadeIn(duration: 250.ms).slideX(begin: -0.2),

              const SizedBox(height: 24),

              const HeroBannerWidget()
                  .animate()
                  .fadeIn(duration: 500.ms)
                  .slideX(begin: -0.2),

              const SizedBox(height: 32),

              const QuickAccessCardsWidget()
                  .animate()
                  .fadeIn(duration: 1000.ms)
                  .slideX(begin: -0.2),
              // Latest News Section
              _buildSectionHeader(
                context,
                title: l10n.latestNews,
                onViewAll: () => context.push('/news'),
              ),

              const SizedBox(height: 16),
              BlocBuilder<NewsCubit, NewsState>(
                builder: (context, state) {
                  return state.when(
                    initial: () => const SizedBox.shrink(),
                    loading: () => _buildLoadingCards(3),
                    loaded: (newsList) =>
                        _buildNewsSection(context, newsList.toList()),
                    loadedDetails:  (_) =>
                        const SizedBox.shrink(),
                    error: (message) => _buildErrorCard(context, message),
                  );
                },
              ),

              const SizedBox(height: 32),

              // Upcoming Events Section
              _buildSectionHeader(
                context,
                title: l10n.upcomingEvents,
                onViewAll: () => context.push('/events'),
              ),
              const SizedBox(height: 16),
              BlocBuilder<EventsCubit, EventsState>(
                builder: (context, state) {
                  return state.when(
                    initial: () => const SizedBox.shrink(),
                    loading: () => _buildLoadingCards(3),
                    loadedDetails: (_) => const SizedBox.shrink(),
                    loaded: (
                      eventsList,
                    ) =>
                        _buildEventsSection(
                      context,
                      eventsList.take(3).toList(),
                    ),
                    error: (message) => _buildErrorCard(context, message),
                    registeredSuccessfully: (_) => const SizedBox.shrink(),
                  );
                },
              ),

              const SizedBox(height: 32),

              // Recent Media Section
              _buildSectionHeader(
                context,
                title: l10n.recentMedia,
                onViewAll: () => context.push('/media'),
              ),
              const SizedBox(height: 16),
              _buildMediaSection(context, achievementsData.take(4).toList()),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(
    BuildContext context, {
    required String title,
    required VoidCallback onViewAll,
  })
  {
    final l10n = AppLocalizations.of(context)!;

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        TextButton(
          onPressed: onViewAll,
          child: Text(l10n.viewAll),
        ),
      ],
    );
  }

  Widget _buildNewsSection(BuildContext context, List<News> newsList)
  {
    // ناخد العرض من الشاشة (80% مثلا)
    final double cardWidth = MediaQuery.of(context).size.width * 0.8;

    final double cardHeight = cardWidth * 1.3;
    if (newsList.isEmpty) {
      return _buildEmptyCard(context);
    }
    return SizedBox(
      height: cardHeight,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: min(newsList.length, 5),
        itemBuilder: (context, index) =>
            InkWell(
                onTap: () {
                  context.push('/news/detail/${newsList[index].id}');
                },
                child: _buildNewsCard(context, newsList[index]),),
      ),
    );
  }

  Widget _buildNewsCard(BuildContext context, News news)
  {
    final l10n = AppLocalizations.of(context)!;
    return LayoutBuilder(
      builder: (context, constraints) {
        return Container(
          width: MediaQuery.of(context).size.width * 0.8,
          margin: const EdgeInsets.symmetric(horizontal: 8),
          child: Card(
            margin: const EdgeInsets.only(bottom: 2),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (news.imageUrl!.isNotEmpty)
                  ClipRRect(
                    borderRadius: const BorderRadius.vertical(
                      top: Radius.circular(12),
                    ),
                    child: AspectRatio(
                      aspectRatio: 16 / 9,
                      child: CachedNetworkImage(
                        imageUrl: news.imageUrl ?? '',
                        fit: BoxFit.fill,
                        errorWidget: (context, error, stackTrace) => Container(
                          width: double.infinity,
                          height: 150,
                          color: Theme.of(context)
                              .colorScheme
                              .surfaceContainerHighest,
                          child: const Icon(Icons.image_not_supported),
                        ),
                      ),
                    ),
                  ),
                const SizedBox(height: 12),
                Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16.0,
                    vertical: 10,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 2,
                          vertical: 1,
                        ),
                        decoration: BoxDecoration(
                          color: AppTheme.lightTheme.colorScheme.primary
                              .withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                      const SizedBox(
                        height: 5,
                      ),
                      Text(
                        news.title,
                        style:
                            Theme.of(context).textTheme.titleMedium?.copyWith(
                                  fontWeight: FontWeight.bold,
                                ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        news.content,
                        style: Theme.of(context).textTheme.bodySmall,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Icon(
                            Icons.person,
                            size: 16,
                            color:
                                Theme.of(context).colorScheme.onSurfaceVariant,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            news.author,
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          CustomIconWidget(
                            iconName: 'access_time',
                            color:
                                Theme.of(context).colorScheme.onSurfaceVariant,
                            size: 16,
                          ),
                          const SizedBox(width: 1),
                          Text(
                            news.createdAt.toString().split(' ')[0],
                            style: AppTheme.textTheme.labelSmall,
                          ),
                          const Spacer(),
                          TextButton(
                            onPressed: () =>
                                context.push('/news/detail/${news.id}'),
                            child: Text(
                              l10n.readMore,
                              style: Theme.of(context)
                                  .textTheme
                                  .bodySmall
                                  ?.copyWith(
                                    color:
                                        Theme.of(context).colorScheme.primary,
                                    fontWeight: FontWeight.w500,
                                  ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ).animate().fadeIn().slideY(begin: 0.1, end: 0),
        );
      },
    );
  }

  Widget _buildEventsSection(BuildContext context, List<Event> eventsList)
  {
    if (eventsList.isEmpty) {
      return _buildEmptyCard(context);
    }

    return Column(
      children: eventsList
          .take(3)
          .map(
            (event) => _buildEventCard(context, event),
          )
          .toList(),
    );
  }

  Widget _buildEventCard(BuildContext context, Event event) {
    final l10n = AppLocalizations.of(context)!;
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: AppTheme.lightTheme.dividerColor,
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
        image: event.imageUrl != null && event.imageUrl!.isNotEmpty
            ? DecorationImage(
                image: NetworkImage(event.imageUrl!),
                fit: BoxFit.cover,
                colorFilter: ColorFilter.mode(
                  Colors.black.withValues(alpha: 0.6),
                  BlendMode.darken,
                ),
              )
            : null,
      ),
      child: InkWell(
        onTap: () => context.push('/events/detail/${event.id}'),
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              /*   if (event.imageUrl != null && event.imageUrl!.isNotEmpty)
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.network(
                    event.imageUrl ?? '',
                    width: double.infinity,
                    height: 150,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => Container(
                      width: double.infinity,
                      height: 150,
                      color: Theme.of(context).colorScheme.surfaceContainerHighest,
                      child: const Icon(Icons.event),
                    ),
                  ),
                ),
              const SizedBox(height: 12),*/
              Row(
                children: [
                  Container(
                    width: 30,
                    height: 30,
                    decoration: BoxDecoration(
                      color: Colors.white12,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Center(
                      child: CustomIconWidget(
                        iconName: 'event',
                        color: AppTheme.primaryColor,
                        size: 18,
                      ),
                    ),
                  ),
                  const Spacer(),
                  Text(
                    event.title,
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                event.description,
                style: Theme.of(context).textTheme.bodyMedium!.copyWith(
                      color: Colors.white,
                    ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(
                    Icons.schedule,
                    size: 16,
                    color: Colors.white,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    DateFormat(
                      'd MMMM y - h:mm a',
                      Localizations.localeOf(context)
                          .languageCode
                          .toLowerCase(),
                    ).format(event.eventDate),
                    style: Theme.of(context).textTheme.bodySmall!.copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.w500,
                        ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(
                    Icons.location_on,
                    size: 16,
                    color: Colors.white,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    event.location,
                    style: Theme.of(context).textTheme.bodySmall!.copyWith(
                          color: Colors.white,
                        ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  const CustomIconWidget(
                    iconName: 'people',
                    color: Colors.white,
                    size: 16,
                  ),
                  const SizedBox(width: 5),
                  Text(
                    '${event.registeredUsers.length} ${l10n.participant}',
                    style: AppTheme.textTheme.bodySmall!.copyWith(
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    ).animate().fadeIn().slideY(begin: 0.1, end: 0);
  }

  Widget _buildMediaSection(BuildContext context, mediaList) {
    if (mediaList.isEmpty) {
      return _buildEmptyCard(context);
    }

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 3,
        mainAxisSpacing: 2,
        childAspectRatio: 2 / 2,
      ),
      itemCount: 4,
      itemBuilder: (context, index) =>
          _buildMediaCard(context, mediaList[index]),
    );
  }

  Widget _buildMediaCard(BuildContext context, media) {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(10),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.08),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: InkWell(
        onTap: () => context.push('/media'),
        borderRadius: BorderRadius.circular(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Image.asset(
                media['image'] as String,
                width: double.infinity,
                height: double.infinity,
                fit: BoxFit.fill,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              media['title'] as String,
              style: AppTheme.textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.w900,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ).animate().fadeIn().scale(),
    );
  }

  Widget _buildLoadingCards(int count) {
    return Column(
      children: List.generate(
        count,
        (index) => Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: Container(
            height: 200,
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  height: 100,
                  decoration: BoxDecoration(
                    color: Colors.grey[300],
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                const SizedBox(height: 12),
              ],
            ),
          ),
        ),
      ),
    );
  }


  Widget _buildErrorCard(BuildContext context, String message) {
    final l10n = AppLocalizations.of(context)!;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Icon(
              Icons.error_outline,
              size: 48,
              color: Theme.of(context).colorScheme.error,
            ),
            const SizedBox(height: 8),
            Text(
              l10n.error,
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 4),
            Text(
              message,
              style: Theme.of(context).textTheme.bodyMedium,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyCard(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          children: [
            Icon(
              Icons.inbox_outlined,
              size: 48,
              color: Theme.of(context).colorScheme.onSurfaceVariant,
            ),
            const SizedBox(height: 8),
            Text(
              l10n.noData,
              style: Theme.of(context).textTheme.titleMedium,
            ),
          ],
        ),
      ),
    );
  }
}
