import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:get_it/get_it.dart';

import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../../../auth/presentation/bloc/auth_state.dart';
import '../../../auth/presentation/bloc/auth_event.dart';

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('الإعدادات'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Colors.white,
      ),
      body: BlocProvider(
        create: (context) => GetIt.instance<AuthBloc>()..add(const AuthEvent.getCurrentUser()),
        child: BlocConsumer<AuthBloc, AuthState>(
          listener: (context, state) {
            state.when(
              initial: () {},
              loading: () {},
              authenticated: (user, token) {},
              unauthenticated: () {
                context.go('/login');
              },
              error: (message) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(message),
                    backgroundColor: Theme.of(context).colorScheme.error,
                  ),
                );
              },
            );
          },
          builder: (context, state) {
            return state.when(
              initial: () => const Center(
                child: CircularProgressIndicator(),
              ),
              loading: () => const Center(
                child: CircularProgressIndicator(),
              ),
              authenticated: (user, token) => SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    // Profile Summary Card
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            Theme.of(context).colorScheme.primary,
                            Theme.of(context).colorScheme.primary.withOpacity(0.8),
                          ],
                        ),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Row(
                        children: [
                          CircleAvatar(
                            radius: 30,
                            backgroundColor: Colors.white,
                            child: Icon(
                              Icons.person,
                              size: 40,
                              color: Theme.of(context).colorScheme.primary,
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  user.name,
                                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  user.email,
                                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                    color: Colors.white.withOpacity(0.9),
                                  ),
                                ),
                                Chip(
                                  label: Text(
                                    _getRoleDisplayName(user.role),
                                    style: TextStyle(
                                      color: Theme.of(context).colorScheme.primary,
                                      fontWeight: FontWeight.w600,
                                      fontSize: 12,
                                    ),
                                  ),
                                  backgroundColor: Colors.white,
                                  materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ).animate().fadeIn().slideY(begin: -0.3, end: 0),
                    
                    const SizedBox(height: 24),
                    
                    // Account Settings Section
                    _buildSectionCard(
                      context,
                      'إعدادات الحساب',
                      Icons.account_circle,
                      [
                        _buildSettingsTile(
                          context,
                          'تعديل الملف الشخصي',
                          'تحديث البيانات الشخصية والمعلومات',
                          Icons.edit,
                          () {
                            Navigator.of(context).pop();
                            // Navigate back to profile and then to edit
                            context.push('/profile/edit');
                          },
                        ),
                        _buildSettingsTile(
                          context,
                          'معلومات الحساب',
                          'عرض تفاصيل الحساب والإحصائيات',
                          Icons.info,
                          () {
                            _showAccountInfoDialog(context, user);
                          },
                        ),
                      ],
                    ).animate().fadeIn(delay: 200.ms).slideX(begin: -0.3, end: 0),
                    
                    const SizedBox(height: 16),
                    
                    // App Settings Section
                    _buildSectionCard(
                      context,
                      'إعدادات التطبيق',
                      Icons.settings,
                      [
                        _buildSettingsTile(
                          context,
                          'الإشعارات',
                          'إدارة إعدادات الإشعارات',
                          Icons.notifications,
                          () {
                            _showNotificationSettings(context);
                          },
                        ),
                        _buildSettingsTile(
                          context,
                          'اللغة',
                          'العربية (الافتراضي)',
                          Icons.language,
                          () {
                            _showLanguageSettings(context);
                          },
                        ),
                        _buildSettingsTile(
                          context,
                          'المظهر',
                          'فاتح / داكن / تلقائي',
                          Icons.palette,
                          () {
                            _showThemeSettings(context);
                          },
                        ),
                      ],
                    ).animate().fadeIn(delay: 400.ms).slideX(begin: 0.3, end: 0),
                    
                    const SizedBox(height: 16),
                    
                    // Support Section
                    _buildSectionCard(
                      context,
                      'الدعم والمساعدة',
                      Icons.help,
                      [
                        _buildSettingsTile(
                          context,
                          'الأسئلة الشائعة',
                          'الحصول على إجابات للأسئلة الشائعة',
                          Icons.quiz,
                          () {
                            _showFAQ(context);
                          },
                        ),
                        _buildSettingsTile(
                          context,
                          'تواصل معنا',
                          'إرسال ملاحظات أو طلب المساعدة',
                          Icons.contact_support,
                          () {
                            _showContactSupport(context);
                          },
                        ),
                        _buildSettingsTile(
                          context,
                          'حول التطبيق',
                          'معلومات حول تطبيق تحيا مصر',
                          Icons.info_outline,
                          () {
                            _showAboutDialog(context);
                          },
                        ),
                      ],
                    ).animate().fadeIn(delay: 600.ms).slideX(begin: -0.3, end: 0),
                    
                    const SizedBox(height: 32),
                    
                    // Logout Button
                    Card(
                      child: ListTile(
                        leading: Icon(
                          Icons.logout,
                          color: Theme.of(context).colorScheme.error,
                        ),
                        title: Text(
                          'تسجيل الخروج',
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            color: Theme.of(context).colorScheme.error,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        subtitle: const Text('الخروج من الحساب الحالي'),
                        trailing: Icon(
                          Icons.arrow_forward_ios,
                          size: 16,
                          color: Theme.of(context).colorScheme.error.withOpacity(0.7),
                        ),
                        onTap: () => _showLogoutDialog(context),
                      ),
                    ).animate().fadeIn(delay: 800.ms).slideY(begin: 0.3, end: 0),
                    
                    const SizedBox(height: 32),
                  ],
                ),
              ),
              unauthenticated: () => const SizedBox.shrink(),
              error: (message) => Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.error_outline,
                      size: 64,
                      color: Theme.of(context).colorScheme.error,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'حدث خطأ في تحميل الإعدادات',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () {
                        context.read<AuthBloc>().add(const AuthEvent.getCurrentUser());
                      },
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

  Widget _buildSectionCard(
    BuildContext context,
    String title,
    IconData icon,
    List<Widget> children,
  ) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  icon,
                  color: Theme.of(context).colorScheme.primary,
                ),
                const SizedBox(width: 12),
                Text(
                  title,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            ...children,
          ],
        ),
      ),
    );
  }

  Widget _buildSettingsTile(
    BuildContext context,
    String title,
    String subtitle,
    IconData icon,
    VoidCallback onTap,
  ) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      leading: CircleAvatar(
        backgroundColor: Theme.of(context).colorScheme.primary.withOpacity(0.1),
        child: Icon(
          icon,
          color: Theme.of(context).colorScheme.primary,
          size: 20,
        ),
      ),
      title: Text(
        title,
        style: Theme.of(context).textTheme.bodyLarge?.copyWith(
          fontWeight: FontWeight.w600,
        ),
      ),
      subtitle: Text(
        subtitle,
        style: Theme.of(context).textTheme.bodySmall,
      ),
      trailing: const Icon(
        Icons.arrow_forward_ios,
        size: 16,
      ),
      onTap: onTap,
    );
  }

  String _getRoleDisplayName(String role) {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'مدير';
      case 'volunteer':
        return 'متطوع';
      case 'student':
        return 'طالب';
      default:
        return role;
    }
  }

  void _showLogoutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('تسجيل الخروج'),
        content: const Text('هل أنت متأكد من رغبتك في تسجيل الخروج؟'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('إلغاء'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              context.read<AuthBloc>().add(const AuthEvent.logoutRequested());
            },
            child: Text(
              'تسجيل الخروج',
              style: TextStyle(color: Theme.of(context).colorScheme.error),
            ),
          ),
        ],
      ),
    );
  }

  void _showAccountInfoDialog(BuildContext context, user) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('معلومات الحساب'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildInfoRow('الاسم:', user.name),
            _buildInfoRow('البريد الإلكتروني:', user.email),
            _buildInfoRow('رقم الهاتف:', user.phone ?? 'غير محدد'),
            _buildInfoRow('المحافظة:', user.governorate ?? 'غير محدد'),
            _buildInfoRow('الجامعة:', user.university ?? 'غير محدد'),
            _buildInfoRow('الدور:', _getRoleDisplayName(user.role)),
            _buildInfoRow('تاريخ الانضمام:', _formatDate(user.createdAt)),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('إغلاق'),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              label,
              style: const TextStyle(fontWeight: FontWeight.w600),
            ),
          ),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }

  void _showNotificationSettings(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('إعدادات الإشعارات'),
        content: const Text('سيتم إضافة إعدادات الإشعارات في التحديث القادم.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('حسناً'),
          ),
        ],
      ),
    );
  }

  void _showLanguageSettings(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('إعدادات اللغة'),
        content: const Text('اللغة العربية هي اللغة الافتراضية والوحيدة المدعومة حالياً.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('حسناً'),
          ),
        ],
      ),
    );
  }

  void _showThemeSettings(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('إعدادات المظهر'),
        content: const Text('يتم تحديد المظهر تلقائياً حسب إعدادات النظام.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('حسناً'),
          ),
        ],
      ),
    );
  }

  void _showFAQ(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('الأسئلة الشائعة'),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'س: كيف يمكنني تعديل بياناتي الشخصية؟',
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
              const Text('ج: يمكنك الضغط على "تعديل الملف الشخصي" من الصفحة الرئيسية للملف الشخصي.'),
              const SizedBox(height: 12),
              const Text(
                'س: كيف يمكنني تسجيل الخروج؟',
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
              const Text('ج: يمكنك الضغط على "تسجيل الخروج" من الإعدادات أو من الملف الشخصي.'),
              const SizedBox(height: 12),
              const Text(
                'س: كيف يمكنني التسجيل في الأحداث؟',
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
              const Text('ج: يمكنك تصفح الأحداث من تبويب الأحداث والضغط على الحدث للتسجيل فيه.'),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('إغلاق'),
          ),
        ],
      ),
    );
  }

  void _showContactSupport(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('تواصل معنا'),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('يمكنك التواصل معنا عبر:'),
            SizedBox(height: 12),
            Text('📧 البريد الإلكتروني: support@tahyamisr.org'),
            SizedBox(height: 8),
            Text('📱 الهاتف: +20 100 123 4567'),
            SizedBox(height: 8),
            Text('🌐 الموقع: www.tahyamisr.org'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('إغلاق'),
          ),
        ],
      ),
    );
  }

  void _showAboutDialog(BuildContext context) {
    showAboutDialog(
      context: context,
      applicationName: 'تحيا مصر',
      applicationVersion: '1.0.0',
      applicationIcon: Icon(
        Icons.flag,
        color: Theme.of(context).colorScheme.primary,
        size: 48,
      ),
      children: [
        const Text('تطبيق تحيا مصر هو منصة للأنشطة الطلابية والتطوعية.'),
        const SizedBox(height: 8),
        const Text('يهدف التطبيق إلى ربط الطلاب والمتطوعين وتنظيم الأنشطة والفعاليات.'),
      ],
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}