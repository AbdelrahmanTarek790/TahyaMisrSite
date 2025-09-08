import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';

import '../../domain/entities/dashboard_stats.dart';
import '../../domain/entities/recent_activity.dart';
import 'stats_card.dart';
import 'recent_activity_list.dart';

class StudentDashboardView extends StatelessWidget {
  final DashboardStats stats;
  final List<RecentActivity> recentActivity;

  const StudentDashboardView({
    super.key,
    required this.stats,
    required this.recentActivity,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Welcome message
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Theme.of(context).colorScheme.tertiary,
                  Theme.of(context).colorScheme.tertiary.withOpacity(0.7),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'مرحباً بك في تحيا مصر',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: 8),
                Text(
                  'اكتشف الأخبار والفعاليات والمحتوى الجديد',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: Colors.white.withOpacity(0.9),
                      ),
                ),
              ],
            ),
          ).animate().fadeIn(duration: 500.ms).slideX(begin: -0.2),

          const SizedBox(height: 24),

          // Stats relevant to students
          Text(
            'ما الجديد؟',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 16),
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            children: [
              StatsCard(
                title: 'أخبار جديدة',
                value: '${stats.totalNews}',
                icon: Icons.article,
                color: Colors.green,
              ).animate(delay: 100.ms).scale(),
              StatsCard(
                title: 'فعاليات متاحة',
                value: '${stats.totalEvents}',
                icon: Icons.event,
                color: Colors.orange,
              ).animate(delay: 200.ms).scale(),
              StatsCard(
                title: 'معرض الصور',
                value: '${stats.totalMedia}',
                icon: Icons.photo_library,
                color: Colors.purple,
              ).animate(delay: 300.ms).scale(),
              StatsCard(
                title: 'أعضاء نشطون',
                value: '${stats.activeUsers}',
                icon: Icons.people,
                color: Colors.blue,
              ).animate(delay: 400.ms).scale(),
            ],
          ),

          const SizedBox(height: 24),

          // Quick navigation for students
          Text(
            'التصفح السريع',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 16),
          Column(
            children: [
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () {
                       context.go('/news');
                      },
                      icon: const Icon(Icons.article),
                      label: const Text('الأخبار'),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.all(16),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () {
                        context.go('/events');
                      },
                      icon: const Icon(Icons.event),
                      label: const Text('الفعاليات'),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.all(16),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () {
                        context.go('/media');
                      },
                      icon: const Icon(Icons.photo_library),
                      label: const Text('المعرض'),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.all(16),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () {
                        context.go('/profile');
                      },
                      icon: const Icon(Icons.person),
                      label: const Text('الملف الشخصي'),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.all(16),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ).animate(delay: 500.ms).slideY(begin: 0.2),

          const SizedBox(height: 24),

          // Recent activity
          Text(
            'النشاط الأخير',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 16),
          RecentActivityList(
            activities: recentActivity,
          ).animate(delay: 600.ms).fadeIn(),
        ],
      ),
    );
  }
}