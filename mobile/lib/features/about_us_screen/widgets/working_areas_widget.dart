import 'dart:async';

import 'package:flutter/material.dart';

import '../../../core/constants/app_theme.dart';
import '../../../gen_l10n/app_localizations.dart';
import '../../home/presentation/widgets/custom_icon_widget.dart';

class WorkingAreasWidget extends StatefulWidget {
  const WorkingAreasWidget({super.key});

  @override
  State<WorkingAreasWidget> createState() => _WorkingAreasWidgetState();
}

class _WorkingAreasWidgetState extends State<WorkingAreasWidget> {
  bool _isExpanded = false;

  final List<Map<String, dynamic>> _workingAreas = [
    {
      'year': '2018',
      'title': 'إعادة الهيكلة وتعديل اللائحة الداخلية',
      'description': 'بداية مرحلة جديدة من التطوير والتحديث',
      'projects': 'إنجاز رئيسي',
      'beneficiaries': 'تحديث شامل للهيكل التنظيمي',
    },
    {
      'year': '2019',
      'title': 'الشراكات الاستراتيجية',
      'description':
          'مبادرات بالتعاون مع الهيئة العامة للاستعلامات ومؤسسة القادة',
      'projects': 'إنجاز رئيسي',
      'beneficiaries': 'تعزيز الشراكات الحكومية والمؤسسية',
    },
    {
      'year': '2020',
      'title': 'جائزة أفضل كيان شبابي للتميز',
      'description': 'برعاية الدكتور أشرف صبحي وزير الشباب والرياضة',
      'projects': 'إنجاز رئيسي',
      'beneficiaries': 'الحصول على أعلى جائزة للتميز الشبابي',
    },
    {
      'year': '2021',
      'title': 'رعاية دولة رئيس مجلس الوزراء',
      'description': 'الحصول على الرعاية الرسمية من أعلى المستويا',
      'projects': 'إنجاز رئيسي',
      'beneficiaries': 'اعتراف حكومي رسمي بالدور المؤثر',
    },
    {
      'year': '2022',
      'title': 'التوسع والإنجازات',
      'description': 'تنفيذ أكبر عدد من المبادرات والشراكات',
      'projects': 'إنجاز رئيسي',
      'beneficiaries': 'تسجيل أكبر منصة حوارية للشباب',
    },
    {
      'year': '2023',
      'title': 'المشاركة في الحملة الرئاسية',
      'description':
          'لجنة المتطوعين والكيانات الشبابية بالحملة الرسمية للرئيس عبد الفتاح السيسي',
      'projects': 'إنجاز رئيسي',
      'beneficiaries': 'دور محوري في الحملة الرئاسية',
    },
    {
      'year': '2024',
      'title': 'القمة الشبابية العربية',
      'description':
          'تنفيذ القمة الشبابية العربية بالتعاون مع جامعة الدول العربية',
      'projects': 'إنجاز رئيسي',
      'beneficiaries': 'استضافة أكبر تجمع شبابي عربي',
    },
    {
      'year': '2025',
      'title': 'الاتحاد المستقل',
      'description':
          'اشهار اتحاد شباب تحيا مصر هيئة شبابية مستقلة تابعة لوزارة الشباب والرياضة',
      'projects': 'إنجاز رئيسي',
      'beneficiaries': 'تحويل إلى هيئة شبابية مستقلة رسمية',
    },
  ];
  final ScrollController _scrollController = ScrollController();
  late Timer _timer;
  double _position = 0;

  @override
  void initState() {
    super.initState();
    _startAutoScroll();
  }

  void _startAutoScroll() {
    _timer = Timer.periodic(const Duration(seconds: 3), (timer) {
      if (_scrollController.hasClients) {
        final maxScroll = _scrollController.position.maxScrollExtent;
        if (_position >= maxScroll) {
          // لما يوصل للنهاية يرجع للبداية
          _position = 0;
        } else {
          _position +=
              MediaQuery.of(context).size.width * 0.7; // يتحرك بمقدار كارت
        }

        _scrollController.animateTo(
          _position,
          duration: const Duration(milliseconds: 600),
          curve: Curves.easeInOut,
        );
      }
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    _scrollController.dispose();
    super.dispose();
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
      child: Column(
        children: [
          InkWell(
            onTap: () {
              setState(() {
                _isExpanded = !_isExpanded;
                if (!_isExpanded) {
                  // رجع الاسكرول لأول الليست
                  Future.delayed(const Duration(milliseconds: 300), () {
                    if (_scrollController.hasClients) {
                      _scrollController.jumpTo(0);
                    }
                    _position = 0;
                  });
                }
              });
            },
            borderRadius: BorderRadius.circular(12),
            child: Row(
              children: [
                Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const CustomIconWidget(
                    iconName: 'work_outline',
                    size: 24,
                  ),
                ),
                const SizedBox(width: 3),
                Expanded(
                  child: Text(
                    l10n.journeyUnion,
                    style: AppTheme.lightTheme.textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: AppTheme.lightTheme.colorScheme.primary,
                    ),
                  ),
                ),
                CustomIconWidget(
                  iconName: _isExpanded ? 'expand_less' : 'expand_more',
                  color: AppTheme.lightTheme.colorScheme.primary,
                  size: 24,
                ),
              ],
            ),
          ),
          AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            curve: Curves.easeInOut,
            height: _isExpanded ? null : 0,
            child: _isExpanded
                ? Container(
                    padding: const EdgeInsets.fromLTRB(4, 0, 4, 4),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Divider(
                          color: AppTheme.lightTheme.dividerColor,
                          thickness: 1,
                        ),
                        const SizedBox(height: 3),
                        AspectRatio(
                          key: const ValueKey('slider'),
                          aspectRatio: 20 / 13,
                          child: ListView.builder(
                            controller: _scrollController,
                            scrollDirection: Axis.horizontal,
                            itemCount: _workingAreas.length,
                            itemBuilder: (context, index) {
                              final area = _workingAreas[index];
                              return Container(
                                width: MediaQuery.of(context).size.width * 0.7,
                                margin: const EdgeInsets.all(8),
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color:
                                      AppTheme.lightTheme.colorScheme.surface,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(
                                    width: 1.5,
                                  ),
                                  boxShadow: const [
                                    BoxShadow(
                                      blurRadius: 8,
                                      offset: Offset(0, 4),
                                    ),
                                  ],
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        CircleAvatar(
                                          radius: 20,
                                          backgroundColor: AppTheme
                                              .lightTheme.colorScheme.primary,
                                          child: Text(
                                            area.containsKey('year')
                                                ? area['year'] as String
                                                : '',
                                            style: AppTheme.textTheme.bodyMedium
                                                ?.copyWith(
                                                    fontWeight: FontWeight.bold,
                                                    color: Colors.white),
                                          ),
                                        ),
                                        const SizedBox(width: 3),
                                        Expanded(
                                          child: Text(
                                            area['title'] as String,
                                            style: AppTheme.lightTheme.textTheme
                                                .titleMedium
                                                ?.copyWith(
                                              fontWeight: FontWeight.bold,
                                              color: AppTheme.lightTheme
                                                  .colorScheme.primary,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      area['description'] as String,
                                      style: AppTheme.textTheme.bodyMedium
                                          ?.copyWith(
                                        color: AppTheme.text,
                                        height: 1.5,
                                      ),
                                    ),
                                    const SizedBox(height: 3),
                                    Row(
                                      children: [
                                        const Icon(
                                          Icons.wine_bar,
                                          size: 16,
                                          color: AppTheme.primaryColor,
                                        ),
                                        const SizedBox(width: 4),
                                        Text(
                                          area['projects'] as String,
                                          style: AppTheme.textTheme.bodyMedium
                                              ?.copyWith(
                                            color: AppTheme.text,
                                            height: 1.5,
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 3),
                                    Text(
                                      area['beneficiaries'] as String,
                                      style: AppTheme.textTheme.bodyMedium
                                          ?.copyWith(
                                        color: AppTheme.text,
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                        ),
                      ],
                    ),
                  )
                : const SizedBox.shrink(),
          ),
        ],
      ),
    );
  }
}
