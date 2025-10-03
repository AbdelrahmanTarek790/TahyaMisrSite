import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:infinite_scroll_pagination/infinite_scroll_pagination.dart';
import 'package:tahya_misr_app/core/constants/app_theme.dart';
import 'package:tahya_misr_app/core/dependency_injection/injection.dart';
import 'package:tahya_misr_app/shared/widgets/main_navigation.dart';
import 'package:toastification/toastification.dart';

import '../../../../../gen_l10n/app_localizations.dart';
import '../../../../timeline/data/models/timeline_model.dart';
import '../../../../timeline/presentation/cubits/timeline_cubit.dart';
import 'create_timeline_page.dart';
import 'edit_timeline_page.dart';

class ManageTimeline extends StatefulWidget {
  const ManageTimeline({super.key});

  @override
  State<ManageTimeline> createState() => _ManageTimelineState();
}

class _ManageTimelineState extends State<ManageTimeline> {
  final PagingController<int, TimelineModel> _pagingController =
      PagingController(firstPageKey: 0);

  late TimelineCubit _timelineCubit;

  @override
  void initState() {
    super.initState();
    _timelineCubit = GetIt.instance<TimelineCubit>();

    _pagingController.addPageRequestListener((pageKey) {
      _timelineCubit.getTimeline();
    });
  }

  @override
  void dispose() {
    _pagingController.dispose();
    _timelineCubit.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return BlocProvider.value(
      value: _timelineCubit,
      child: BlocConsumer<TimelineCubit, TimelineState>(
        listener: (context, state) {
          if (state is TimelineLoaded) {
            final isLastPage = state.timeline.length < 100;
            if (isLastPage) {
              _pagingController.appendLastPage(state.timeline);
            } else {
              final nextPageKey = _pagingController.nextPageKey! + 1;
              _pagingController.appendPage(state.timeline, nextPageKey);
            }
          }
          else if (state is TimelineError) {
            _pagingController.error = state.message;
          }
          else if(state is TimelineDeleted) {
            getIt<ShowToast>().showToast(
              context: context,
              message: 'تم حذف الحدث بنجاح',
              type: ToastificationType.success,
            );
            _pagingController.refresh();
          }
          else if(state is TimelineCreated) {
            _pagingController.refresh();
          }
          else if(state is TimelineUpdated) {
            _pagingController.refresh();
          }
        },
        builder: (context, state) {
          return Scaffold(
            appBar: AppBar(
              title: const Text('إدارة خط الزمن'),
              backgroundColor: AppTheme.primaryColor,
              foregroundColor: Colors.white,
            ),
            body: RefreshIndicator(
              onRefresh: () => Future.sync(
                _pagingController.refresh,
              ),
              child: PagedListView<int, TimelineModel>(
                pagingController: _pagingController,
                builderDelegate: PagedChildBuilderDelegate<TimelineModel>(
                  itemBuilder: (context, item, index) => Column(
                    children: [
                      _buildTimelineCard(
                        context,
                        item,
                        index,
                      ).animate().fadeIn(delay: (100 * index).ms).slideX(
                            begin: index.isEven ? -0.2 : 0.2,
                            end: 0,
                          ),

                      SizedBox(
                        height: index == _pagingController.itemList!.length - 1
                            ? 80
                            : 0,
                      ),
                    ],
                  ),
                  firstPageErrorIndicatorBuilder: (context) => Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          Icons.error_outline,
                          size: 48,
                          color: Colors.red,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          _pagingController.error.toString(),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _pagingController.refresh,
                          child: const Text('إعادة المحاولة'),
                        ),
                      ],
                    ),
                  ),
                  noItemsFoundIndicatorBuilder: (context) => Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.timeline,
                          size: 64,
                          color: Colors.grey[400],
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'لا توجد أحداث خط زمن',
                          style: AppTheme.textTheme.titleLarge,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'ابدأ بإضافة أول حدث',
                          style: AppTheme.textTheme.bodyMedium?.copyWith(
                                color: Colors.grey[600],
                              ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            floatingActionButton: FloatingActionButton.extended(
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => BlocProvider.value(
                      value: _timelineCubit,
                      child: const CreateTimelinePage(),
                    ),
                  ),
                );
              },
              icon: const Icon(Icons.add),
              label: const Text('إضافة حدث'),
              backgroundColor: AppTheme.primaryColor,
            ),
          );
        },
      ),
    );
  }

  Widget _buildTimelineCard(
    BuildContext context,
    TimelineModel timeline,
    int index,
  ) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryColor.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        Icons.calendar_today,
                        size: 14,
                        color: AppTheme.primaryColor,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        timeline.year,
                        style: const TextStyle(
                          color: AppTheme.primaryColor,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
                const Spacer(),
                IconButton(
                  icon: const Icon(Icons.delete, color: Colors.red),
                  onPressed: () => _showDeleteDialog(context, timeline),
                ),
                IconButton(
                  icon: const Icon(Icons.edit, color: Colors.blue),
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (context) => BlocProvider.value(
                          value: _timelineCubit,
                          child: EditTimelinePage(timeline: timeline),
                        ),
                      ),
                    );
                  },
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              timeline.title,
              style: AppTheme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 8),
            Text(
              timeline.description,
              style:AppTheme.textTheme.bodyMedium?.copyWith(
                    color: Colors.grey[600],
                  ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Icon(
                  Icons.check_circle_outline,
                  size: 16,
                  color: Colors.green[600],
                ),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    timeline.achievement.split('\n').first,
                    style: AppTheme.textTheme.bodySmall?.copyWith(
                          color: Colors.grey[700],
                        ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryColor.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    'الترتيب: ${timeline.order}',
                    style: AppTheme.textTheme.bodySmall?.copyWith(
                          fontWeight: FontWeight.w500,
                        ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _showDeleteDialog(BuildContext context, TimelineModel timeline) {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('حذف الحدث'),
        content: Text('هل أنت متأكد من حذف "${timeline.title}"؟'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogContext).pop(),
            child: const Text('إلغاء'),
          ),
          TextButton(
            onPressed: () {
              context.read<TimelineCubit>().deleteTimelineById(timeline.id);
              Navigator.of(dialogContext).pop();
            },
            child: const Text(
              'حذف',
              style: TextStyle(color: Colors.red),
            ),
          ),
        ],
      ),
    );
  }
}
