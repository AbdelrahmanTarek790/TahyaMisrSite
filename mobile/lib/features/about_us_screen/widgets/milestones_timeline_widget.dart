import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../core/constants/app_theme.dart';
import '../../../gen_l10n/app_localizations.dart';
import '../../timeline/presentation/cubits/timeline_cubit.dart';
import 'build_milestones_widget.dart';

class MilestonesTimelineWidget extends StatefulWidget {
  const MilestonesTimelineWidget({super.key});

  @override
  State<MilestonesTimelineWidget> createState() =>
      _MilestonesTimelineWidgetState();
}

class _MilestonesTimelineWidgetState extends State<MilestonesTimelineWidget> {
  @override
  void initState() {
    super.initState();
    // Fetch timeline data when widget initializes
    context.read<TimelineCubit>().getTimeline();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(
              height: 5,
            ),
            Text(
              l10n.unionJourneyTitle,
              style: AppTheme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
                color: Theme.of(context).colorScheme.primary,
              ),
            ),
            const SizedBox(
              height: 5,
            ),
            Text(
              l10n.unionJourneySubtitle,
              style: AppTheme.textTheme.titleLarge?.copyWith(),
            ),
            const SizedBox(
              height: 5,
            ),
            BlocBuilder<TimelineCubit, TimelineState>(
              builder: (context, state) {
                if (state is TimelineInitial) {
                  return const SizedBox.shrink();
                } else if (state is TimelineLoading) {
                  return const Center(
                    child: Padding(
                      padding: EdgeInsets.all(20.0),
                      child: CircularProgressIndicator(),
                    ),
                  );
                } else if (state is TimelineLoaded) {
                  if (state.timeline.isEmpty) {
                    return Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: Center(
                        child: Text(
                          'لا توجد أحداث خط زمن',
                          style: AppTheme.textTheme.bodyLarge,
                        ),
                      ),
                    );
                  }
                  return Column(
                    children: state.timeline.map((item) {
                      // Parse achievement into bullet points
                      // Split by newlines and filter empty lines
                      final bulletPoints = item.achievement
                          .split('\n')
                          .where((line) => line.trim().isNotEmpty)
                          .toList();

                      return Column(
                        children: [
                          BuildMilestonesWidget(
                            title: '${item.year} - ${item.title}',
                            description: item.description,
                            bulletPoints: bulletPoints,
                          ),
                          const SizedBox(height: 5),
                        ],
                      );
                    }).toList(),
                  );
                } else if (state is TimelineError) {
                  return Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Center(
                      child: Column(
                        children: [
                          Text(
                            'خطأ في تحميل الأحداث',
                            style: AppTheme.textTheme.bodyLarge?.copyWith(
                              color: Colors.red,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            state.message,
                            style: AppTheme.textTheme.bodyMedium,
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 16),
                          ElevatedButton(
                            onPressed: () {
                              context.read<TimelineCubit>().refreshTimeline();
                            },
                            child: const Text('إعادة المحاولة'),
                          ),
                        ],
                      ),
                    ),
                  );
                }
                return const SizedBox.shrink();
              },
            ),
          ],
        ),
      ),
    );
  }
}

