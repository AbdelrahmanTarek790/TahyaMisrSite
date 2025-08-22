import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';

import '../../domain/entities/dashboard_stats.dart';
import '../../domain/entities/recent_activity.dart';
import 'stats_card.dart';
import 'recent_activity_list.dart';

class AdminDashboardView extends StatelessWidget {
  final DashboardStats stats;
  final List<RecentActivity> recentActivity;

  const AdminDashboardView({
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
                  Theme.of(context).colorScheme.primary,
                  Theme.of(context).colorScheme.primary.withOpacity(0.7),
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
                  'مرحباً بك في لوحة الإدارة',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: 8),
                Text(
                  'إدارة شاملة لمنصة تحيا مصر',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: Colors.white.withOpacity(0.9),
                      ),
                ),
              ],
            ),
          ).animate().fadeIn(duration: 500.ms).slideX(begin: -0.2),

          const SizedBox(height: 24),

          // Stats grid for admin (all stats)
          Text(
            'إحصائيات عامة',
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
                title: 'إجمالي المستخدمين',
                value: '${stats.totalUsers}',
                icon: Icons.people,
                color: Colors.blue,
              ).animate(delay: 100.ms).scale(),
              StatsCard(
                title: 'الأخبار المنشورة',
                value: '${stats.totalNews}',
                icon: Icons.article,
                color: Colors.green,
              ).animate(delay: 200.ms).scale(),
              StatsCard(
                title: 'الفعاليات',
                value: '${stats.totalEvents}',
                icon: Icons.event,
                color: Colors.orange,
              ).animate(delay: 300.ms).scale(),
              StatsCard(
                title: 'ملفات الوسائط',
                value: '${stats.totalMedia}',
                icon: Icons.photo_library,
                color: Colors.purple,
              ).animate(delay: 400.ms).scale(),
            ],
          ),

          const SizedBox(height: 24),

          // Active users and pending events for admin
          Row(
            children: [
              Expanded(
                child: StatsCard(
                  title: 'المستخدمون النشطون',
                  value: '${stats.activeUsers}',
                  icon: Icons.person_pin,
                  color: Colors.teal,
                ).animate(delay: 500.ms).scale(),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: StatsCard(
                  title: 'فعاليات معلقة',
                  value: '${stats.pendingEvents}',
                  icon: Icons.pending_actions,
                  color: Colors.red,
                ).animate(delay: 600.ms).scale(),
              ),
            ],
          ),

          const SizedBox(height: 24),

          // Quick actions for admin
          Text(
            'إجراءات سريعة',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    // Navigate to user management
                    context.push('/user-management');
                  },
                  icon: const Icon(Icons.manage_accounts),
                  label: const Text('إدارة المستخدمين'),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.all(16),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    // Navigate to content management
                    context.push('/content-management');
                  },
                  icon: const Icon(Icons.edit_note),
                  label: const Text('إدارة المحتوى'),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.all(16),
                  ),
                ),
              ),
            ],
          ).animate(delay: 700.ms).slideY(begin: 0.2),

          const SizedBox(height: 16),

          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    // Navigate to send notifications
                  },
                  icon: const Icon(Icons.notifications_active),
                  label: const Text('إرسال إشعار'),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.all(16),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    // Navigate to position management
                    context.push('/position-management');
                  },
                  icon: const Icon(Icons.work),
                  label: const Text('إدارة المناصب'),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.all(16),
                  ),
                ),
              ),
            ],
          ).animate(delay: 800.ms).slideY(begin: 0.2),

          const SizedBox(height: 16),

          ElevatedButton.icon(
            onPressed: () {
              // Navigate to analytics
            },
            icon: const Icon(Icons.analytics),
            label: const Text('التقارير والتحليلات'),
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.all(16),
              minimumSize: const Size(double.infinity, 48),
            ),
          ).animate(delay: 900.ms).slideY(begin: 0.2),

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
          ).animate(delay: 800.ms).fadeIn(),
        ],
      ),
    );
  }
}