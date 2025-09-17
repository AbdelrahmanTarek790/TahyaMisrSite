import 'package:flutter/material.dart';

import '../../../gen_l10n/app_localizations.dart';
import '../../home/presentation/widgets/custom_icon_widget.dart';
import '../../home/presentation/widgets/custom_image_widget.dart';


class MilestonesTimelineWidget extends StatefulWidget {
  const MilestonesTimelineWidget({super.key});

  @override
  State<MilestonesTimelineWidget> createState() =>
      _MilestonesTimelineWidgetState();
}

class _MilestonesTimelineWidgetState extends State<MilestonesTimelineWidget> {
  bool _isExpanded = false;

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
            Center(
              child: Text(
                l10n.unionJourneyTitle,
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: Theme.of(context).colorScheme.primary,
                ),
              ),
            ),
            const SizedBox(
              height: 5,
            ),
            Text(
              l10n.unionJourneySubtitle,
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
                color: Theme.of(context).colorScheme.primary,
              ),
            ),
            const SizedBox(
              height: 5,
            ),
            InkWell(
              onTap: () {
                setState(() {
                  _isExpanded = !_isExpanded;
                });
              },
              borderRadius: BorderRadius.circular(12),
              child: Container(
                padding: const EdgeInsets.all(8),
                child: Row(
                  children: [
                    Container(
                      width: 30,
                      height: 28,
                      decoration: BoxDecoration(
                        color: Theme.of(context).colorScheme.secondary,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: CustomIconWidget(
                        iconName: 'album',
                        color: Theme.of(context).colorScheme.onSecondary,
                        size: 24,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        l10n.unionJourneyTitle,
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: Theme.of(context).colorScheme.primary,
                        ),
                      ),
                    ),
                    CustomIconWidget(
                      iconName: _isExpanded ? 'expand_less' : 'expand_more',
                      color: Theme.of(context).colorScheme.primary,
                      size: 24,
                    ),
                  ],
                ),
              ),
            ),
            AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              curve: Curves.easeInOut,
              height: _isExpanded ? null : 0,
              child: _isExpanded
                  ? Container(
                padding: const EdgeInsets.fromLTRB(8, 0, 4, 8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Divider(
                      color: Theme.of(context).dividerColor,
                      thickness: 2,
                    ),
                    const SizedBox(height: 4),
                    const CustomImageWidget(
                      imageUrl:
                      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
                      width: double.infinity,
                      height: 100,
                      fit: BoxFit.cover,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      l10n.descriptionVision,
                      style:
                      Theme.of(context).textTheme.bodyLarge?.copyWith(
                        height: 1.6,
                        color: Theme.of(context).colorScheme.onSurface,
                      ),
                      textAlign: TextAlign.right,
                      textDirection: TextDirection.rtl,
                    ),
                  ],
                ),
              )
                  : const SizedBox.shrink(),
            ),
          ],
        ),
      ),
    );
  }
}