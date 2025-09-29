import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:tahya_misr_app/gen_l10n/app_localizations.dart';

import '../../../../core/constants/app_theme.dart';
import 'custom_icon_widget.dart';

class QuickAccessCardsWidget extends StatelessWidget {
  const QuickAccessCardsWidget({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> quickAccessData = [
      {
        'id': 1,
        'title': 'الرؤية',
        'subtitle': 'رؤية تحيا مصر للشباب',
        'icon': 'visibility',
        'color': AppTheme.primaryColor,
        'route': '/about-us',
      },
      {
        'id': 2,
        'title': 'الرسالة',
        'subtitle': 'رسالة الاتحاد',
        'icon': 'flag',
        'color': Colors.redAccent,
        'route': '/about-us',
      },
      {
        'id': 3,
        'title': 'الأهداف',
        'subtitle': 'أهدافنا الاستراتيجية',
        'icon': 'track_changes',
        'color': AppTheme.lightGold,
        'route': '/about-us',
      },
      {
        'id': 4,
        'title': 'الأنشطة المندرجة',
        'subtitle':
            'الأنشطة والكيانات المركزية التي تعمل تحت مظلة اتحاد شباب تحيا مصر',
        'icon': 'priority_high',
        'color': Colors.yellow,
        'route': '/about-us',
      },
      {
        'id': 5,
        'title': 'طلب انضمام',
        'subtitle': 'انضم إلى اتحاد شباب تحيا مصر',
        'icon': 'person_add',
        'color': Colors.green,
        'route': '/join-request',
      }
    ];
    final l10n = AppLocalizations.of(context)!;
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            l10n.quickAccess,
            style: AppTheme.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
              childAspectRatio: 1.4,
            ),
            itemCount: quickAccessData.length,
            itemBuilder: (context, index) {
              final item = quickAccessData[index];
              return GestureDetector(
                onTap: () {
                  context.push(item['route'] as String);
                },
                onLongPress: () {
                  _showPreviewBottomSheet(context, item);
                },
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: AppTheme.beige,
                      width: 1,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.05),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(4),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 50,
                          height: 50,
                          decoration: BoxDecoration(
                            color:
                                (item['color'] as Color).withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Center(
                            child: CustomIconWidget(
                              iconName: item['icon'] as String,
                              color: item['color'] as Color,
                              size: 25,
                            ),
                          ),
                        ),
                        const SizedBox(height: 5),
                        Text(
                          item['title'] as String,
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.textTheme.titleLarge?.color,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          item['subtitle'] as String,
                          style: TextStyle(
                            color: AppTheme.textTheme.titleMedium?.color,
                            fontSize: 10,
                          ),
                          textAlign: TextAlign.center,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  void _showPreviewBottomSheet(
    BuildContext context,
    Map<String, dynamic> item,
  ) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        decoration: BoxDecoration(
          color: AppTheme.lightTheme.colorScheme.surface,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
        ),
        padding: const EdgeInsets.all(6),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: CustomIconWidget(
                    iconName: 'close',
                    color: AppTheme.lightTheme.colorScheme.onSurface,
                    size: 6,
                  ),
                ),
                Container(
                  width: 12,
                  height: 12,
                  decoration: BoxDecoration(
                    color: (item['color'] as Color).withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Center(
                    child: CustomIconWidget(
                      iconName: item['icon'] as String,
                      color: item['color'] as Color,
                      size: 6,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 2),
            Text(
              item['title'] as String,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: AppTheme.lightTheme.colorScheme.onSurface,
              ),
              textDirection: TextDirection.rtl,
            ),
            const SizedBox(height: 1),
            Text(
              "معاينة سريعة لمحتوى ${item["title"]}. اضغط للوصول إلى التفاصيل الكاملة والمعلومات الشاملة حول هذا القسم.",
              style: AppTheme.lightTheme.textTheme.bodyMedium,
              textDirection: TextDirection.rtl,
            ),
            const SizedBox(height: 3),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(context);
                  Navigator.pushNamed(context, item['route'] as String);
                },
                child: const Text(
                  'عرض التفاصيل',
                  textDirection: TextDirection.rtl,
                ),
              ),
            ),
            const SizedBox(height: 2),
          ],
        ),
      ),
    );
  }
}
