import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/dependency_injection/injection.dart';
import '../../../../gen_l10n/app_localizations.dart';
import '../../../dashboard/presentation/bloc/dashboard_bloc.dart';
import '../../../dashboard/presentation/bloc/dashboard_event.dart';
import '../../../dashboard/presentation/bloc/dashboard_state.dart';
import 'create_news/create_news_page.dart';

class ContentManagementPage extends StatefulWidget {
  const ContentManagementPage({super.key});

  @override
  State<ContentManagementPage> createState() => _ContentManagementPageState();
}

class _ContentManagementPageState extends State<ContentManagementPage> {
  late DashboardBloc _dashboardBloc;

  @override
  void initState() {
    super.initState();
    _dashboardBloc = getIt<DashboardBloc>();
    _loadDashboardStats();
  }

  @override
  void dispose() {
    _dashboardBloc.close();
    super.dispose();
  }

  void _loadDashboardStats() {
    _dashboardBloc.add(GetDashboardStatsEvent());
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
                      Theme.of(context).colorScheme.primary.withOpacity(0.7),
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Theme.of(context).colorScheme.primary.withOpacity(0.3),
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
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Manage news, events, and media content',
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                            color: Colors.white70,
                          ),
                    ),
                  ],
                ),
              ).animate().slideInUp(duration: 600.ms),

              const SizedBox(height: 24),

              // Management Options
              Text(
                'Content Management',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 16),

              // News Management
              _buildManagementCard(
                context,
                title: l10n.manageNews,
                subtitle: 'Create, edit, and manage news articles',
                icon: Icons.article,
                color: Colors.blue,
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (context) => const CreateNewsPage(),
                    ),
                  );
                },
              ).animate().fadeIn(delay: 200.ms).slideX(begin: -0.3, end: 0),

              const SizedBox(height: 12),

              // Events Management
              _buildManagementCard(
                context,
                title: l10n.manageEvents,
                subtitle: 'Create, edit, and manage events',
                icon: Icons.event,
                color: Colors.orange,
                onTap: () {
                  _showCreateEventDialog(context, l10n);
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

              BlocBuilder<DashboardBloc, DashboardState>(
                builder: (context, state) {
                  if (state is DashboardStatsLoaded) {
                    return _buildStatsGrid(context, state);
                  } else if (state is DashboardLoading) {
                    return const Center(child: CircularProgressIndicator());
                  } else if (state is DashboardError) {
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
                            state.message,
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
                  } else {
                    return _buildStatsGrid(context, null);
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatsGrid(BuildContext context, DashboardStatsLoaded? state) {
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
              ).animate().fadeIn(delay: 800.ms).scale(begin: const Offset(0.8, 0.8)),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildStatCard(
                context,
                title: 'Events',
                count: state?.stats.totalEvents.toString() ?? '0',
                icon: Icons.event,
                color: Colors.orange,
              ).animate().fadeIn(delay: 1000.ms).scale(begin: const Offset(0.8, 0.8)),
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
              ).animate().fadeIn(delay: 1200.ms).scale(begin: const Offset(0.8, 0.8)),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildStatCard(
                context,
                title: 'Users',
                count: state?.stats.totalUsers.toString() ?? '0',
                icon: Icons.people,
                color: Colors.green,
              ).animate().fadeIn(delay: 1400.ms).scale(begin: const Offset(0.8, 0.8)),
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
                color.withOpacity(0.1),
                color.withOpacity(0.05),
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
                  color: color.withOpacity(0.2),
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
              color.withOpacity(0.1),
              color.withOpacity(0.05),
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
                  subtitle: Text('${selectedDate.day}/${selectedDate.month}/${selectedDate.year}'),
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
                    content: Text('Event creation will be implemented with backend integration'),
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
                  content: Text('Media upload will be implemented with backend integration'),
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
                  Text(
                    'إدارة شاملة لجميع محتويات المنصة',
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                          color: Colors.white.withOpacity(0.9),
                        ),
                  ),
                ],
              ),
            ).animate().fadeIn(duration: 500.ms).slideX(begin: -0.2),

            const SizedBox(height: 24),

            // Management Options
            Text(
              'أقسام الإدارة',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 16),

            // News Management
            _buildManagementCard(
              context,
              title: l10n.manageNews,
              subtitle: 'إضافة وتعديل وحذف الأخبار',
              icon: Icons.article,
              color: Colors.blue,
              onTap: () {
                _showManageNewsDialog(context);
              },
            ).animate().fadeIn(delay: 200.ms).slideX(begin: -0.3, end: 0),

            const SizedBox(height: 12),

            // Events Management
            _buildManagementCard(
              context,
              title: l10n.manageEvents,
              subtitle: 'إضافة وتعديل وحذف الفعاليات',
              icon: Icons.event,
              color: Colors.orange,
              onTap: () {
                _showManageEventsDialog(context);
              },
            ).animate().fadeIn(delay: 400.ms).slideX(begin: 0.3, end: 0),

            const SizedBox(height: 12),

            // Media Management
            _buildManagementCard(
              context,
              title: l10n.manageMedia,
              subtitle: 'إضافة وتعديل وحذف ملفات الوسائط',
              icon: Icons.photo_library,
              color: Colors.purple,
              onTap: () {
                _showManageMediaDialog(context);
              },
            ).animate().fadeIn(delay: 600.ms).slideX(begin: -0.3, end: 0),

            const SizedBox(height: 24),

            // Statistics Cards
            Text(
              'إحصائيات المحتوى',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 16),

            Row(
              children: [
                Expanded(
                  child: _buildStatCard(
                    'الأخبار المنشورة',
                    '45',
                    Icons.article,
                    Colors.blue,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard(
                    'الفعاليات النشطة',
                    '12',
                    Icons.event,
                    Colors.orange,
                  ),
                ),
              ],
            ).animate().fadeIn(delay: 800.ms).slideY(begin: 0.3, end: 0),

            const SizedBox(height: 12),

            Row(
              children: [
                Expanded(
                  child: _buildStatCard(
                    'ملفات الوسائط',
                    '128',
                    Icons.photo_library,
                    Colors.purple,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildStatCard(
                    'التفاعلات',
                    '892',
                    Icons.thumb_up,
                    Colors.green,
                  ),
                ),
              ],
            ).animate().fadeIn(delay: 1000.ms).slideY(begin: 0.3, end: 0),

            const SizedBox(height: 24),

            // Quick Actions
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
                      _showAddContentDialog(context);
                    },
                    icon: const Icon(Icons.add),
                    label: const Text('إضافة محتوى'),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.all(16),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      _showBulkActionsDialog(context);
                    },
                    icon: const Icon(Icons.edit_note),
                    label: const Text('إجراءات مجمعة'),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.all(16),
                    ),
                  ),
                ),
              ],
            ).animate().fadeIn(delay: 1200.ms).slideY(begin: 0.3, end: 0),
          ],
        ),
      ),
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
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Row(
            children: [
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  icon,
                  size: 30,
                  color: color,
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
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: Theme.of(context).colorScheme.onSurfaceVariant,
                          ),
                    ),
                  ],
                ),
              ),
              Icon(
                Icons.arrow_forward_ios,
                size: 16,
                color: Theme.of(context).colorScheme.onSurfaceVariant,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Icon(
              icon,
              size: 32,
              color: color,
            ),
            const SizedBox(height: 8),
            Text(
              value,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
            Text(
              title,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w500,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  void _showManageNewsDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('إدارة الأخبار'),
        content: const Text('سيتم إضافة وظائف إدارة الأخبار (إضافة، تعديل، حذف) في التحديث القادم.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('حسناً'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              context.push('/news');
            },
            child: const Text('عرض الأخبار'),
          ),
        ],
      ),
    );
  }

  void _showManageEventsDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('إدارة الفعاليات'),
        content: const Text('سيتم إضافة وظائف إدارة الفعاليات (إضافة، تعديل، حذف) في التحديث القادم.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('حسناً'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              context.push('/events');
            },
            child: const Text('عرض الفعاليات'),
          ),
        ],
      ),
    );
  }

  void _showManageMediaDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('إدارة الوسائط'),
        content: const Text('سيتم إضافة وظائف إدارة الوسائط (إضافة، تعديل، حذف) في التحديث القادم.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('حسناً'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              context.push('/media');
            },
            child: const Text('عرض المعرض'),
          ),
        ],
      ),
    );
  }

  void _showAddContentDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('إضافة محتوى'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.article, color: Colors.blue),
              title: const Text('إضافة خبر'),
              onTap: () {
                Navigator.of(context).pop();
                _showAddNewsForm(context);
              },
            ),
            ListTile(
              leading: const Icon(Icons.event, color: Colors.orange),
              title: const Text('إضافة فعالية'),
              onTap: () {
                Navigator.of(context).pop();
                _showAddEventForm(context);
              },
            ),
            ListTile(
              leading: const Icon(Icons.photo_library, color: Colors.purple),
              title: const Text('إضافة وسائط'),
              onTap: () {
                Navigator.of(context).pop();
                _showAddMediaForm(context);
              },
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('إلغاء'),
          ),
        ],
      ),
    );
  }

  void _showBulkActionsDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('إجراءات مجمعة'),
        content: const Text('سيتم إضافة الإجراءات المجمعة (النشر، الحذف، التعديل الجماعي) في التحديث القادم.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('حسناً'),
          ),
        ],
      ),
    );
  }

  void _showAddNewsForm(BuildContext context) {
    final titleController = TextEditingController();
    final excerptController = TextEditingController();
    final contentController = TextEditingController();
    final imageUrlController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('إضافة خبر جديد'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: titleController,
                decoration: const InputDecoration(
                  labelText: 'عنوان الخبر *',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: excerptController,
                decoration: const InputDecoration(
                  labelText: 'مقتطف الخبر *',
                  border: OutlineInputBorder(),
                ),
                maxLines: 2,
              ),
              const SizedBox(height: 12),
              TextField(
                controller: contentController,
                decoration: const InputDecoration(
                  labelText: 'محتوى الخبر *',
                  border: OutlineInputBorder(),
                ),
                maxLines: 5,
              ),
              const SizedBox(height: 12),
              TextField(
                controller: imageUrlController,
                decoration: const InputDecoration(
                  labelText: 'رابط الصورة',
                  border: OutlineInputBorder(),
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('إلغاء'),
          ),
          TextButton(
            onPressed: () {
              if (titleController.text.isNotEmpty && 
                  excerptController.text.isNotEmpty &&
                  contentController.text.isNotEmpty) {
                
                final newsData = {
                  'title': titleController.text,
                  'excerpt': excerptController.text,
                  'content': contentController.text,
                  'image': imageUrlController.text.isNotEmpty ? imageUrlController.text : null,
                };
                
                // TODO: Call create news API
                Navigator.of(context).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('تم إنشاء الخبر بنجاح')),
                );
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('يرجى ملء جميع الحقول المطلوبة'),
                    backgroundColor: Colors.red,
                  ),
                );
              }
            },
            child: const Text('إنشاء'),
          ),
        ],
      ),
    );
  }

  void _showAddEventForm(BuildContext context) {
    final titleController = TextEditingController();
    final descriptionController = TextEditingController();
    final locationController = TextEditingController();
    final imageUrlController = TextEditingController();
    DateTime? selectedDate;
    TimeOfDay? selectedTime;

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          title: const Text('إضافة فعالية جديدة'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: titleController,
                  decoration: const InputDecoration(
                    labelText: 'عنوان الفعالية *',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: descriptionController,
                  decoration: const InputDecoration(
                    labelText: 'وصف الفعالية *',
                    border: OutlineInputBorder(),
                  ),
                  maxLines: 3,
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: locationController,
                  decoration: const InputDecoration(
                    labelText: 'المكان *',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 12),
                ListTile(
                  title: const Text('تاريخ الفعالية'),
                  subtitle: Text(
                    selectedDate != null 
                        ? '${selectedDate!.day}/${selectedDate!.month}/${selectedDate!.year}'
                        : 'اختر التاريخ',
                  ),
                  trailing: const Icon(Icons.calendar_today),
                  onTap: () async {
                    final date = await showDatePicker(
                      context: context,
                      initialDate: DateTime.now(),
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
                ListTile(
                  title: const Text('وقت الفعالية'),
                  subtitle: Text(
                    selectedTime != null 
                        ? '${selectedTime!.hour}:${selectedTime!.minute.toString().padLeft(2, '0')}'
                        : 'اختر الوقت',
                  ),
                  trailing: const Icon(Icons.access_time),
                  onTap: () async {
                    final time = await showTimePicker(
                      context: context,
                      initialTime: TimeOfDay.now(),
                    );
                    if (time != null) {
                      setState(() {
                        selectedTime = time;
                      });
                    }
                  },
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: imageUrlController,
                  decoration: const InputDecoration(
                    labelText: 'رابط الصورة',
                    border: OutlineInputBorder(),
                  ),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('إلغاء'),
            ),
            TextButton(
              onPressed: () {
                if (titleController.text.isNotEmpty && 
                    descriptionController.text.isNotEmpty &&
                    locationController.text.isNotEmpty &&
                    selectedDate != null &&
                    selectedTime != null) {
                  
                  final eventDateTime = DateTime(
                    selectedDate!.year,
                    selectedDate!.month,
                    selectedDate!.day,
                    selectedTime!.hour,
                    selectedTime!.minute,
                  );
                  
                  final eventData = {
                    'title': titleController.text,
                    'description': descriptionController.text,
                    'location': locationController.text,
                    'date': eventDateTime.toIso8601String(),
                    'image': imageUrlController.text.isNotEmpty ? imageUrlController.text : null,
                  };
                  
                  // TODO: Call create event API
                  Navigator.of(context).pop();
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('تم إنشاء الفعالية بنجاح')),
                  );
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('يرجى ملء جميع الحقول المطلوبة'),
                      backgroundColor: Colors.red,
                    ),
                  );
                }
              },
              child: const Text('إنشاء'),
            ),
          ],
        ),
      ),
    );
  }

  void _showAddMediaForm(BuildContext context) {
    final captionController = TextEditingController();
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('إضافة وسائط جديدة'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('اختر ملف الصورة أو الفيديو:'),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: () {
                // TODO: Implement file picker
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('سيتم إضافة اختيار الملفات قريباً')),
                );
              },
              icon: const Icon(Icons.upload_file),
              label: const Text('اختيار ملف'),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: captionController,
              decoration: const InputDecoration(
                labelText: 'وصف الوسائط',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('إلغاء'),
          ),
          TextButton(
            onPressed: () {
              // TODO: Upload media via API
              Navigator.of(context).pop();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('سيتم إضافة رفع الملفات قريباً')),
              );
            },
            child: const Text('رفع'),
          ),
        ],
      ),
    );
  }
}