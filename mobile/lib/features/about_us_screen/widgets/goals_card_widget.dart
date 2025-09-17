import 'package:flutter/material.dart';

import '../../../gen_l10n/app_localizations.dart';
import '../../home/presentation/widgets/custom_icon_widget.dart';

class GoalsCardWidget extends StatefulWidget {
  const GoalsCardWidget({super.key});

  @override
  State<GoalsCardWidget> createState() => _GoalsCardWidgetState();
}

class _GoalsCardWidgetState extends State<GoalsCardWidget> {
  bool _isExpanded = false;

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
                  Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: CustomIconWidget(
                      iconName: 'track_changes',
                      color:Theme.of(context).colorScheme.onTertiary,
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 3),
                  Expanded(
                    child: Text(
                      l10n.goals,
                      style:Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                        color:Theme.of(context).colorScheme.primary,
                      ),
                    ),
                  ),
                  CustomIconWidget(
                    iconName: _isExpanded ? 'expand_less' : 'expand_more',
                    color:Theme.of(context).colorScheme.primary,
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
                    padding: const EdgeInsets.fromLTRB(4, 0, 4, 4),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Divider(
                          color:Theme.of(context).dividerColor,
                          thickness: 1,
                        ),
                        const SizedBox(height: 2),
                        Text(
                          l10n.descriptionGoal
                          ,style:
                             Theme.of(context).textTheme.bodyLarge?.copyWith(
                            height: 1.6,
                            color:Theme.of(context).colorScheme.onSurface,
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
