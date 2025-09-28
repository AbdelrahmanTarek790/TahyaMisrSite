import 'package:flutter/material.dart';

import '../../../core/constants/app_theme.dart';
import '../../../gen_l10n/app_localizations.dart';
import 'build_milestones_widget.dart';


class MilestonesTimelineWidget extends StatefulWidget {
  const MilestonesTimelineWidget({super.key});

  @override
  State<MilestonesTimelineWidget> createState() =>
      _MilestonesTimelineWidgetState();
}

class _MilestonesTimelineWidgetState extends State<MilestonesTimelineWidget> {


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
          crossAxisAlignment:  CrossAxisAlignment.start,
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
            BuildMilestonesWidget(
            title: l10n.unionJourneyItemTitle1,
            description: l10n.unionJourneyItemDescription1,
            bulletPoints: l10n.unionJourneyItemBulletPoints1,
            ),
            const SizedBox(
              height: 5,
            ),
            BuildMilestonesWidget(
              title: l10n.unionJourneyItemTitle2,
              description: l10n.unionJourneyItemDescription2,
              bulletPoints: l10n.unionJourneyItemBulletPoints2,

            ),
            const SizedBox(
              height: 5,
            ),
            BuildMilestonesWidget(
              title: l10n.unionJourneyItemTitle3,
              description: l10n.unionJourneyItemDescription3,
              bulletPoints: l10n.unionJourneyItemBulletPoints3,

            ),
            const SizedBox(
              height: 5,
            ),
          ],
        ),
      ),
    );
  }
}

