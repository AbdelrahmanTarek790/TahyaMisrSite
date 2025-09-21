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

  final List<Map<String, dynamic>> _milestones = [
    {
      'year': '2014',
      'title': 'تأسيس تحيا مصر الشباب',
      'description': 'إطلاق المبادرة الرئاسية لتمكين الشباب المصري',
      'icon': 'flag',
      'isCompleted': true,
    },
    {
      'year': '2016',
      'title': 'أول مؤتمر شبابي وطني',
      'description': 'تنظيم أكبر تجمع شبابي في تاريخ مصر الحديث',
      'icon': 'event',
      'isCompleted': true,
    },
    {
      'year': '2018',
      'title': 'إطلاق برنامج رواد المستقبل',
      'description': 'تدريب 10,000 شاب على ريادة الأعمال والابتكار',
      'icon': 'rocket_launch',
      'isCompleted': true,
    },
    {
      'year': '2020',
      'title': 'التحول الرقمي',
      'description': 'رقمنة جميع الخدمات والبرامج الشبابية',
      'icon': 'computer',
      'isCompleted': true,
    },
    {
      'year': '2022',
      'title': 'مبادرة مصر الخضراء',
      'description': 'إطلاق أكبر مبادرة بيئية شبابية في الشرق الأوسط',
      'icon': 'eco',
      'isCompleted': true,
    },
    {
      'year': '2024',
      'title': 'الذكاء الاصطناعي للشباب',
      'description': 'تدريب 50,000 شاب على تقنيات الذكاء الاصطناعي',
      'icon': 'psychology',
      'isCompleted': true,
    },
    {
      'year': '2025',
      'title': 'رؤية مصر 2030',
      'description': 'تحقيق أهداف التنمية المستدامة للشباب',
      'icon': 'visibility',
      'isCompleted': false,
    }
  ];

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

