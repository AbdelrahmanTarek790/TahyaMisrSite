import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tahya_misr_app/features/content_management/presentation/pages/manage_event/mange_events.dart';
import 'package:tahya_misr_app/features/dashboard/presentation/cubits/dashboard_cubit.dart';

import '../../../../core/dependency_injection/injection.dart';
import '../../../../gen_l10n/app_localizations.dart';
import 'manage_news/mange_news.dart';

class ContentManagementPage extends StatefulWidget {
  const ContentManagementPage({super.key});

  @override
  State<ContentManagementPage> createState() => _ContentManagementPageState();
}

class _ContentManagementPageState extends State<ContentManagementPage> {
  late DashboardCubit _dashboardBloc;
  @override
  void initState() {
    super.initState();
    _dashboardBloc = getIt<DashboardCubit>();
    _loadDashboardStats();
  }

  void _loadDashboardStats() {
    _dashboardBloc.getDashboardStats();
  }

  @override
  void dispose() {
    _dashboardBloc.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    return BlocProvider.value(
      value: _dashboardBloc,
      child: Scaffold(
        appBar: AppBar(
          title: Text(l10n.contentManagement),
          backgroundColor: Theme.of(context).colorScheme.primary,
          foregroundColor: Colors.white,
        ),
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Theme.of(context).colorScheme.primary,
                      Theme.of(context)
                          .colorScheme
                          .primary
                          .withValues(alpha: 0.7),
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Theme.of(context)
                          .colorScheme
                          .primary
                          .withValues(alpha: 0.3),
                      blurRadius: 8,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      l10n.contentManagement,
                      style:
                          Theme.of(context).textTheme.headlineSmall?.copyWith(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                              ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      l10n.contentManagementDescription,
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                            color: Colors.white70,
                          ),
                    ),
                  ],
                ),
              ).animate(),

              const SizedBox(height: 24),

              // Management Options
              Text(
                l10n.contentManagement.toUpperCase(),
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 16),

              // News Management
              _buildManagementCard(
                context,
                title: l10n.manageNews,
                subtitle: l10n.mangeNewsDescription,
                icon: Icons.article,
                color: Colors.blue,
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (context) =>  const MangeNews(),
                    ),
                  );
                },
              ).animate().fadeIn(delay: 200.ms).slideX(begin: -0.3, end: 0),

              const SizedBox(height: 12),

              // Events Management
              _buildManagementCard(
                context,
                title: l10n.manageEvents,
                subtitle: l10n.manageEventsDescription,
                icon: Icons.event,
                color: Colors.orange,
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (context) =>  const MangeEvents(),
                    ),
                  );
                 /* _showCreateEventDialog(context, l10n);*/
                },
              ).animate().fadeIn(delay: 400.ms).slideX(begin: 0.3, end: 0),

              const SizedBox(height: 12),

              // Media Management
              _buildManagementCard(
                context,
                title: l10n.manageMedia,
                subtitle: 'Upload and manage media files',
                icon: Icons.photo_library,
                color: Colors.purple,
                onTap: () {
                  _showUploadMediaDialog(context, l10n);
                },
              ).animate().fadeIn(delay: 600.ms).slideX(begin: -0.3, end: 0),

              const SizedBox(height: 24),

              // Statistics Cards
              Text(
                'Content Statistics',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 16),

              BlocBuilder<DashboardCubit, DashboardState>(
                builder: (context, state) {
                  return state.when(
                    initial: () {
                      return _buildStatsGrid(context, null);
                    },
                    loading: () {
                      return const Center(child: CircularProgressIndicator());
                    },
                    loaded: (stats, activities) {
                      return _buildStatsGrid(context, state);
                    },
                    statsLoaded: (stats) {
                      return _buildStatsGrid(context, state);
                    },
                    activitiesLoaded: (activities) {
                      return const SizedBox(); /*_buildStatsGrid(context, null);*/
                    },
                    error: (message) {
                      return Center(
                        child: Column(
                          children: [
                            Icon(
                              Icons.error_outline,
                              size: 48,
                              color: Theme.of(context).colorScheme.error,
                            ),
                            const SizedBox(height: 16),
                            Text(
                              message,
                              style: Theme.of(context).textTheme.bodyMedium,
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 16),
                            ElevatedButton(
                              onPressed: _loadDashboardStats,
                              child: const Text('Retry'),
                            ),
                          ],
                        ),
                      );
                    },
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatsGrid(BuildContext context, state) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: _buildStatCard(
                context,
                title: 'News',
                count: state?.stats.totalNews.toString() ?? '0',
                icon: Icons.article,
                color: Colors.blue,
              )
                  .animate()
                  .fadeIn(delay: 800.ms)
                  .scale(begin: const Offset(0.8, 0.8)),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildStatCard(
                context,
                title: 'Events',
                count: state?.stats.totalEvents.toString() ?? '0',
                icon: Icons.event,
                color: Colors.orange,
              )
                  .animate()
                  .fadeIn(delay: 1000.ms)
                  .scale(begin: const Offset(0.8, 0.8)),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildStatCard(
                context,
                title: 'Media',
                count: state?.stats.totalMedia.toString() ?? '0',
                icon: Icons.photo_library,
                color: Colors.purple,
              )
                  .animate()
                  .fadeIn(delay: 1200.ms)
                  .scale(begin: const Offset(0.8, 0.8)),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildStatCard(
                context,
                title: 'Users',
                count: state?.stats.totalUsers.toString() ?? '0',
                icon: Icons.people,
                color: Colors.green,
              )
                  .animate()
                  .fadeIn(delay: 1400.ms)
                  .scale(begin: const Offset(0.8, 0.8)),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildManagementCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            gradient: LinearGradient(
              colors: [
                color.withValues(alpha: 0.1),
                color.withValues(alpha: 0.05),
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  icon,
                  color: color,
                  size: 28,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      subtitle,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: Colors.grey[600],
                          ),
                    ),
                  ],
                ),
              ),
              Icon(
                Icons.arrow_forward_ios,
                color: color,
                size: 20,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatCard(
    BuildContext context, {
    required String title,
    required String count,
    required IconData icon,
    required Color color,
  }) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          gradient: LinearGradient(
            colors: [
              color.withValues(alpha: 0.1),
              color.withValues(alpha: 0.05),
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Column(
          children: [
            Icon(
              icon,
              color: color,
              size: 32,
            ),
            const SizedBox(height: 8),
            Text(
              count,
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: color,
                  ),
            ),
            Text(
              title,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Colors.grey[600],
                  ),
            ),
          ],
        ),
      ),
    );
  }

  void _showCreateEventDialog(BuildContext context, AppLocalizations l10n) {
    final titleController = TextEditingController();
    final descriptionController = TextEditingController();
    final locationController = TextEditingController();
    DateTime selectedDate = DateTime.now();

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          title: Text(l10n.createEvent),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: titleController,
                  decoration: InputDecoration(
                    labelText: l10n.title,
                    border: const OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: descriptionController,
                  decoration: InputDecoration(
                    labelText: l10n.description,
                    border: const OutlineInputBorder(),
                  ),
                  maxLines: 3,
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: locationController,
                  decoration: InputDecoration(
                    labelText: l10n.location,
                    border: const OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                ListTile(
                  title: Text(l10n.date),
                  subtitle: Text(
                      '${selectedDate.day}/${selectedDate.month}/${selectedDate.year}',),
                  trailing: const Icon(Icons.calendar_today),
                  onTap: () async {
                    final date = await showDatePicker(
                      context: context,
                      initialDate: selectedDate,
                      firstDate: DateTime.now(),
                      lastDate: DateTime.now().add(const Duration(days: 365)),
                    );
                    if (date != null) {
                      setState(() {
                        selectedDate = date;
                      });
                    }
                  },
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text(l10n.cancel),
            ),
            ElevatedButton(
              onPressed: () {
                // TODO: Create event using EventsBloc
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text(
                        'Event creation will be implemented with backend integration',),
                    backgroundColor: Colors.orange,
                  ),
                );
                Navigator.of(context).pop();
              },
              child: Text(l10n.create),
            ),
          ],
        ),
      ),
    );
  }

  void _showUploadMediaDialog(BuildContext context, AppLocalizations l10n) {
    final captionController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(l10n.uploadMedia),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: double.infinity,
              height: 150,
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.cloud_upload,
                    size: 48,
                    color: Colors.grey[600],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Click to select file',
                    style: TextStyle(color: Colors.grey[600]),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: captionController,
              decoration: InputDecoration(
                labelText: l10n.caption,
                border: const OutlineInputBorder(),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text(l10n.cancel),
          ),
          ElevatedButton(
            onPressed: () {
              // TODO: Upload media using MediaBloc
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text(
                    'Media upload will be implemented with backend integration',
                  ),
                  backgroundColor: Colors.orange,
                ),
              );
              Navigator.of(context).pop();
            },
            child: Text(l10n.upload),
          ),
        ],
      ),
    );
  }
}
