import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';

import '../../../../../core/constants/app_theme.dart';
import '../../../../../gen_l10n/app_localizations.dart';
import '../../../data/models/achievement_model.dart';
import '../../cubits/achievements_cubit.dart';
import '../../cubits/achievements_state.dart';
import 'create_achievement_page.dart';
import 'edit_achievement_page.dart';

class ManageAchievementsPage extends StatefulWidget {
  const ManageAchievementsPage({super.key});

  @override
  State<ManageAchievementsPage> createState() => _ManageAchievementsPageState();
}

class _ManageAchievementsPageState extends State<ManageAchievementsPage> {
  late AchievementsCubit _achievementsCubit;

  @override
  void initState() {
    super.initState();
    _achievementsCubit = GetIt.instance<AchievementsCubit>();
    _achievementsCubit.getAchievements();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      appBar: AppBar(
        title: const Text('إدارة الإنجازات'),
        actions: [
          TextButton(
            child: const Text(
              'إضافة إنجاز',
              style: TextStyle(color: AppTheme.primaryColor),
            ),
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => BlocProvider.value(
                    value: _achievementsCubit,
                    child: const CreateAchievementPage(),
                  ),
                ),
              );
            },
          ),
        ],
      ),
      body: BlocProvider.value(
        value: _achievementsCubit,
        child: BlocBuilder<AchievementsCubit, AchievementsState>(
          builder: (context, state) {
            return state.when(
              loadedDetails: (_) => const SizedBox.shrink(),
              initial: () => const Center(
                child: CircularProgressIndicator(),
              ),
              loading: () => const Center(
                child: CircularProgressIndicator(),
              ),
              loaded: (achievementsList) => achievementsList.isEmpty
                  ? const Center(
                      child: Text('لا توجد إنجازات متاحة'),
                    )
                  : RefreshIndicator(
                      onRefresh: () async {
                        _achievementsCubit.refreshAchievements();
                      },
                      child: ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: achievementsList.length,
                        itemBuilder: (context, index) {
                          final achievement = achievementsList[index];
                          return _AchievementCard(
                            achievement: achievement,
                            achievementsCubit: _achievementsCubit,
                          )
                              .animate(delay: (index * 100).ms)
                              .slideX(begin: 0.1)
                              .fadeIn();
                        },
                      ),
                    ),
              error: (message) => Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(
                      Icons.error_outline,
                      size: 64,
                      color: Colors.red,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      message,
                      style: const TextStyle(fontSize: 16),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () => _achievementsCubit.getAchievements(),
                      child: const Text('إعادة المحاولة'),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  @override
  void dispose() {
    _achievementsCubit.close();
    super.dispose();
  }
}

class _AchievementCard extends StatelessWidget {
  final AchievementModel achievement;
  final AchievementsCubit achievementsCubit;

  const _AchievementCard({
    required this.achievement,
    required this.achievementsCubit,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (context) => BlocProvider.value(
                value: achievementsCubit,
                child: EditAchievementPage(achievement: achievement),
              ),
            ),
          );
        },
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  // Achievement Image
                  if (achievement.image != null)
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.network(
                        achievement.image!,
                        width: 60,
                        height: 60,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return Container(
                            width: 60,
                            height: 60,
                            decoration: BoxDecoration(
                              color: Colors.grey[300],
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Icon(Icons.image, size: 30),
                          );
                        },
                      ),
                    )
                  else
                    Container(
                      width: 60,
                      height: 60,
                      decoration: BoxDecoration(
                        color: Colors.grey[300],
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(Icons.emoji_events, size: 30),
                    ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          achievement.title,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'الترتيب: ${achievement.order}',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ),
                  // Status Badge
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: achievement.isActive
                          ? Colors.green.withValues(alpha: 0.1)
                          : Colors.red.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      achievement.isActive ? 'نشط' : 'غير نشط',
                      style: TextStyle(
                        color:
                            achievement.isActive ? Colors.green : Colors.red,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              if (achievement.description.isNotEmpty) ...[
                const SizedBox(height: 12),
                Text(
                  achievement.description,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[700],
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
              const SizedBox(height: 12),
              // Action Buttons
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  // Toggle Status Button
                  TextButton.icon(
                    onPressed: () async {
                      final success = await achievementsCubit
                          .toggleAchievementStatus(achievement.id);
                      if (success) {
                        achievementsCubit.refreshAchievements();
                      }
                    },
                    icon: Icon(
                      achievement.isActive
                          ? Icons.visibility_off
                          : Icons.visibility,
                      size: 18,
                    ),
                    label: Text(
                      achievement.isActive ? 'إخفاء' : 'إظهار',
                    ),
                    style: TextButton.styleFrom(
                      foregroundColor: Colors.orange,
                    ),
                  ),
                  const SizedBox(width: 8),
                  // Delete Button
                  TextButton.icon(
                    onPressed: () async {
                      final confirmed = await showDialog<bool>(
                        context: context,
                        builder: (context) => AlertDialog(
                          title: const Text('تأكيد الحذف'),
                          content: const Text(
                              'هل أنت متأكد من حذف هذا الإنجاز؟'),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.of(context).pop(false),
                              child: const Text('إلغاء'),
                            ),
                            TextButton(
                              onPressed: () => Navigator.of(context).pop(true),
                              child: const Text('حذف'),
                              style: TextButton.styleFrom(
                                foregroundColor: Colors.red,
                              ),
                            ),
                          ],
                        ),
                      );

                      if (confirmed == true) {
                        final success =
                            await achievementsCubit.deleteAchievement(achievement.id);
                        if (success) {
                          achievementsCubit.refreshAchievements();
                        }
                      }
                    },
                    icon: const Icon(Icons.delete, size: 18),
                    label: const Text('حذف'),
                    style: TextButton.styleFrom(
                      foregroundColor: Colors.red,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
