import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:get_it/get_it.dart';

import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../../../auth/presentation/bloc/auth_state.dart';
import '../../../auth/presentation/bloc/auth_event.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('الملف الشخصي'),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {
              // TODO: Navigate to settings
            },
          ),
        ],
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
              initial: () => const Center(child: CircularProgressIndicator()),
              loading: () => const Center(child: CircularProgressIndicator()),
              authenticated: (user, token) => SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    // Profile Header
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            Theme.of(context).colorScheme.primary,
                            Theme.of(context).colorScheme.secondary,
                          ],
                        ),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Column(
                        children: [
                          CircleAvatar(
                            radius: 50,
                            backgroundColor: Colors.white,
                            child: Icon(
                              Icons.person,
                              size: 60,
                              color: Theme.of(context).colorScheme.primary,
                            ),
                          ),
                          const SizedBox(height: 16),
                          Text(
                            user.name,
                            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            user.email,
                            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                              color: Colors.white.withOpacity(0.9),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Chip(
                            label: Text(
                              user.role == 'student' ? 'طالب' : 'متطوع',
                              style: TextStyle(
                                color: Theme.of(context).colorScheme.primary,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            backgroundColor: Colors.white,
                          ),
                        ],
                      ),
                    ).animate().fadeIn().slideY(begin: -0.3, end: 0),
                    
                    const SizedBox(height: 24),
                    
                    // User Info Cards
                    _buildInfoCard(
                      context,
                      'المحافظة',
                      user.governorate ?? 'غير محدد',
                      Icons.location_on,
                    ).animate().fadeIn(delay: 200.ms).slideX(begin: -0.3, end: 0),
                    
                    const SizedBox(height: 16),
                    
                    _buildInfoCard(
                      context,
                      'رقم الهاتف',
                      user.phoneNumber ?? 'غير محدد',
                      Icons.phone,
                    ).animate().fadeIn(delay: 400.ms).slideX(begin: -0.3, end: 0),
                    
                    const SizedBox(height: 16),
                    
                    _buildInfoCard(
                      context,
                      'تاريخ الانضمام',
                      _formatDate(user.createdAt),
                      Icons.calendar_today,
                    ).animate().fadeIn(delay: 600.ms).slideX(begin: -0.3, end: 0),
                    
                    const SizedBox(height: 32),
                    
                    // Action Buttons
                    Column(
                      children: [
                        _buildActionButton(
                          context,
                          'تعديل الملف الشخصي',
                          Icons.edit,
                          () {
                            // TODO: Navigate to edit profile
                          },
                        ).animate().fadeIn(delay: 800.ms).slideY(begin: 0.3, end: 0),
                        
                        const SizedBox(height: 12),
                        
                        _buildActionButton(
                          context,
                          'الإعدادات',
                          Icons.settings,
                          () {
                            // TODO: Navigate to settings
                          },
                        ).animate().fadeIn(delay: 1000.ms).slideY(begin: 0.3, end: 0),
                        
                        const SizedBox(height: 12),
                        
                        _buildActionButton(
                          context,
                          'تسجيل الخروج',
                          Icons.logout,
                          () => _showLogoutDialog(context),
                          isDestructive: true,
                        ).animate().fadeIn(delay: 1200.ms).slideY(begin: 0.3, end: 0),
                      ],
                    ),
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
                      'حدث خطأ في تحميل الملف الشخصي',
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

  Widget _buildInfoCard(
    BuildContext context,
    String title,
    String value,
    IconData icon,
  ) {
    return Card(
      child: ListTile(
        leading: Icon(
          icon,
          color: Theme.of(context).colorScheme.primary,
        ),
        title: Text(
          title,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
            color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
          ),
        ),
        subtitle: Text(
          value,
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }

  Widget _buildActionButton(
    BuildContext context,
    String title,
    IconData icon,
    VoidCallback onTap, {
    bool isDestructive = false,
  }) {
    return Card(
      child: ListTile(
        leading: Icon(
          icon,
          color: isDestructive
              ? Theme.of(context).colorScheme.error
              : Theme.of(context).colorScheme.primary,
        ),
        title: Text(
          title,
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
            color: isDestructive
                ? Theme.of(context).colorScheme.error
                : Theme.of(context).colorScheme.onSurface,
            fontWeight: FontWeight.w600,
          ),
        ),
        trailing: Icon(
          Icons.arrow_forward_ios,
          size: 16,
          color: Theme.of(context).colorScheme.onSurface.withOpacity(0.5),
        ),
        onTap: onTap,
      ),
    );
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

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}