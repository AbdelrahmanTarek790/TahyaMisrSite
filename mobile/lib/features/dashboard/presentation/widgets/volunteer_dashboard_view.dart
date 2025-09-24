import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

import 'stats_card.dart';
import 'recent_activity_list.dart';

class VolunteerDashboardView extends StatelessWidget {
  final DashboardStats stats;
  final List<RecentActivity> recentActivity;

  const VolunteerDashboardView({
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
                  Theme.of(context).colorScheme.secondary,
                  Theme.of(context).colorScheme.secondary.withValues(alpha: 0.7),
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
                  'مرحباً بك متطوعنا العزيز',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: 8),
                Text(
                  'شكراً لمساهمتك في خدمة المجتمع',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: Colors.white.withValues(alpha: 0.9),
                      ),
                ),
              ],
            ),
          ).animate().fadeIn(duration: 500.ms).slideX(begin: -0.2),

          const SizedBox(height: 24),

          // Stats relevant to volunteers
          Text(
            'الإحصائيات',
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
                title: 'الفعاليات المتاحة',
                value: '${stats.totalEvents}',
                icon: Icons.event,
                color: Colors.orange,
              ).animate(delay: 100.ms).scale(),
              StatsCard(
                title: 'الأخبار الحديثة',
                value: '${stats.totalNews}',
                icon: Icons.article,
                color: Colors.green,
              ).animate(delay: 200.ms).scale(),
              StatsCard(
                title: 'محتوى الوسائط',
                value: '${stats.totalMedia}',
                icon: Icons.photo_library,
                color: Colors.purple,
              ).animate(delay: 300.ms).scale(),
              StatsCard(
                title: 'فعاليات معلقة',
                value: '${stats.pendingEvents}',
                icon: Icons.pending_actions,
                color: Colors.amber,
              ).animate(delay: 400.ms).scale(),
            ],
          ),

          const SizedBox(height: 24),

          // Quick actions for volunteers
          Text(
            'إجراءات سريعة',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 16),
          Column(
            children: [
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () {
                    // Navigate to create event
                  },
                  icon: const Icon(Icons.add_circle),
                  label: const Text('إنشاء فعالية جديدة'),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.all(16),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () {
                        // Navigate to manage content
                      },
                      icon: const Icon(Icons.edit),
                      label: const Text('إدارة المحتوى'),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.all(16),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () {
                        // Navigate to media upload
                      },
                      icon: const Icon(Icons.upload),
                      label: const Text('رفع وسائط'),
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