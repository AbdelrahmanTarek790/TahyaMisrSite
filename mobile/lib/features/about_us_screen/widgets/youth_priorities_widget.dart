import 'package:flutter/material.dart';
import 'package:tahya_misr_app/core/constants/app_constants.dart';

import '../../../core/constants/app_theme.dart';
import '../../../gen_l10n/app_localizations.dart';
import '../../home/presentation/widgets/custom_icon_widget.dart';

class YouthPrioritiesWidget extends StatefulWidget {
  const YouthPrioritiesWidget({super.key});

  @override
  State<YouthPrioritiesWidget> createState() => _YouthPrioritiesWidgetState();
}

class _YouthPrioritiesWidgetState extends State<YouthPrioritiesWidget>{
  bool _isExpanded = false;

  final List<Map<String, dynamic>> _youthPriorities = [
    {
      'title': 'جريدة تحيا مصر ',
      'image': AppConstants.active2
    },
    {
      'title': 'اتحاد طلاب مدارس تحيا مصر',
      'image':  AppConstants.active3
    },
    {
      'title':
          'أسرة اتحاد طلاب تحيا مصر بالأكاديمية المصرية للهندسة والتكنولوجيا المتقدمة',
      'image':  AppConstants.active4
    },
    {
      'title': 'راديو تحيا مصر',
      'image':  AppConstants.active1
    },
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
      child: Column(
        children: [
          InkWell(
            onTap: () {
              setState(() {
                _isExpanded = !_isExpanded;
              });
            },
            borderRadius: BorderRadius.circular(12),
            child: Container(
              padding: const EdgeInsets.all(4),
              child: Row(
                children: [
                  const SizedBox(width: 3),
                  Expanded(
                    child: Text(
                      l10n.activities,
                      style: AppTheme.lightTheme.textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: AppTheme.lightTheme.colorScheme.primary,
                      ),
                      textAlign: TextAlign.right,
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
          ),
          AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            curve: Curves.easeInOut,
            height: _isExpanded ? null : 0,
            child: _isExpanded
                ? Container(
                    padding: const EdgeInsets.all(6),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Divider(
                          color: AppTheme.lightTheme.dividerColor,
                          thickness: 1,
                        ),
                        const SizedBox(height: 2),
                        Text(
                          l10n.activitiesSubtitle,
                          style:
                              AppTheme.lightTheme.textTheme.bodyLarge?.copyWith(
                            height: 1.6,
                            color: AppTheme.lightTheme.colorScheme.onSurface,
                          ),
                        ),
                        const SizedBox(height: 3),
                        Center(
                          child: Text(
                            l10n.centralActivities,
                            style: AppTheme.textTheme.headlineMedium?.copyWith(
                              color: AppTheme.lightTheme.colorScheme.onSurface,
                            ),
                          ),
                        ),
                        const SizedBox(height: 3),
                        GridView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          gridDelegate:
                              const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            crossAxisSpacing: 3,
                            mainAxisSpacing: 2,
                            childAspectRatio: 0.85,
                          ),
                          itemCount: _youthPriorities.length,
                          itemBuilder: (context, index) {
                            final priority = _youthPriorities[index];
                            return StaggeredCard(
                             index: index,
                              child: TiltCard(
                                child: Container(
                                  padding: const EdgeInsets.all(3),
                                  decoration: BoxDecoration(
                                    color:
                                        AppTheme.lightTheme.colorScheme.surface,
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(
                                      color: AppTheme.lightTheme.dividerColor,
                                      width: 1.5,
                                    ),
                                  ),
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Image.asset(
                                        priority['image'] as String,
                                        width: 80,
                                        height: 80,
                                        fit: BoxFit.cover,
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        priority['title'] as String,
                                        style: AppTheme
                                            .lightTheme.textTheme.titleSmall
                                            ?.copyWith(
                                          fontWeight: FontWeight.bold,
                                          color: AppTheme
                                              .lightTheme.colorScheme.onSurface,
                                        ),
                                        textAlign: TextAlign.center,
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
                  )
                : const SizedBox.shrink(),
          ),
        ],
      ),
    );
  }
}

class StaggeredCard extends StatefulWidget {
  final Widget child;
  final int index;
  const StaggeredCard({super.key, required this.child, required this.index});

  @override
  State<StaggeredCard> createState() => _StaggeredCardState();
}

class _StaggeredCardState extends State<StaggeredCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _opacity;
  late Animation<Offset> _slide;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );

    _opacity = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );

    _slide = Tween<Offset>(begin: const Offset(0, 0.2), end: Offset.zero)
        .animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );

    Future.delayed(Duration(milliseconds: widget.index * 150), () {
      if (mounted) _controller.forward();
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _opacity,
      child: SlideTransition(
        position: _slide,
        child: widget.child,
      ),
    );
  }
}


class TiltCard extends StatefulWidget {
  final Widget child;
  const TiltCard({super.key, required this.child});

  @override
  State<TiltCard> createState() => _TiltCardState();
}

class _TiltCardState extends State<TiltCard> {
  double _x = 0, _y = 0;

  void _onHover(PointerEvent event, Size size) {
    final dx = (event.localPosition.dx - size.width / 2) / size.width;
    final dy = (event.localPosition.dy - size.height / 2) / size.height;
    setState(() {
      _x = dy * 0.15;
      _y = -dx * 0.15;
    });
  }

  // ignore: unnecessary_set_literal
  void _reset(_) => setState(() => {_x = 0, _y = 0});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (_, constraints) {
        return MouseRegion(
          onHover: (e) => _onHover(e, constraints.biggest),
          onExit: _reset,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            transform: Matrix4.identity()
              ..setEntry(3, 2, 0.001)
              ..rotateX(_x)
              ..rotateY(_y),
            child: widget.child,
          ),
        );
      },
    );
  }
}
