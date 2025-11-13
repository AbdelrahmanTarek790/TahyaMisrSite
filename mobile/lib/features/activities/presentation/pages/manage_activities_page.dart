import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';

import '../../../../../core/constants/app_theme.dart';
import '../../../../../gen_l10n/app_localizations.dart';
import '../../../data/models/activity_model.dart';
import '../../cubits/activities_cubit.dart';
import '../../cubits/activities_state.dart';
import 'create_activity_page.dart';
import 'edit_activity_page.dart';

class ManageActivitiesPage extends StatefulWidget {
  const ManageActivitiesPage({super.key});

  @override
  State<ManageActivitiesPage> createState() => _ManageActivitiesPageState();
}

class _ManageActivitiesPageState extends State<ManageActivitiesPage> {
  late ActivitiesCubit _activitiesCubit;

  @override
  void initState() {
    super.initState();
    _activitiesCubit = GetIt.instance<ActivitiesCubit>();
    _activitiesCubit.getActivities();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      appBar: AppBar(
        title: const Text('إدارة الأنشطة'),
        actions: [
          TextButton(
            child: const Text(
              'إضافة نشاط',
              style: TextStyle(color: AppTheme.primaryColor),
            ),
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => BlocProvider.value(
                    value: _activitiesCubit,
                    child: const CreateActivityPage(),
                  ),
                ),
              );
            },
          ),
        ],
      ),
      body: BlocProvider.value(
        value: _activitiesCubit,
        child: BlocBuilder<ActivitiesCubit, ActivitiesState>(
          builder: (context, state) {
            return state.when(
              loadedDetails: (_) => const SizedBox.shrink(),
              initial: () => const Center(
                child: CircularProgressIndicator(),
              ),
              loading: () => const Center(
                child: CircularProgressIndicator(),
              ),
              loaded: (activitiesList) => activitiesList.isEmpty
                  ? const Center(
                      child: Text('لا توجد أنشطة متاحة'),
                    )
                  : RefreshIndicator(
                      onRefresh: () async {
                        _activitiesCubit.refreshActivities();
                      },
                      child: ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: activitiesList.length,
                        itemBuilder: (context, index) {
                          final activity = activitiesList[index];
                          return _ActivityCard(
                            activity: activity,
                            activitiesCubit: _activitiesCubit,
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
                      onPressed: () => _activitiesCubit.getActivities(),
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
    _activitiesCubit.close();
    super.dispose();
  }
}

class _ActivityCard extends StatelessWidget {
  final ActivityModel activity;
  final ActivitiesCubit activitiesCubit;

  const _ActivityCard({
    required this.activity,
    required this.activitiesCubit,
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
                value: activitiesCubit,
                child: EditActivityPage(activity: activity),
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
                  // Activity Image
                  if (activity.image != null)
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.network(
                        activity.image!,
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
                      child: const Icon(Icons.category, size: 30),
                    ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          activity.title,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'الترتيب: ${activity.order}',
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
                      color: activity.isActive
                          ? Colors.green.withValues(alpha: 0.1)
                          : Colors.red.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      activity.isActive ? 'نشط' : 'غير نشط',
                      style: TextStyle(
                        color:
                            activity.isActive ? Colors.green : Colors.red,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              // Action Buttons
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  // Toggle Status Button
                  TextButton.icon(
                    onPressed: () async {
                      final success = await activitiesCubit
                          .toggleActivityStatus(activity.id);
                      if (success) {
                        activitiesCubit.refreshActivities();
                      }
                    },
                    icon: Icon(
                      activity.isActive
                          ? Icons.visibility_off
                          : Icons.visibility,
                      size: 18,
                    ),
                    label: Text(
                      activity.isActive ? 'إخفاء' : 'إظهار',
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
                              'هل أنت متأكد من حذف هذا النشاط؟'),
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
                            await activitiesCubit.deleteActivity(activity.id);
                        if (success) {
                          activitiesCubit.refreshActivities();
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
