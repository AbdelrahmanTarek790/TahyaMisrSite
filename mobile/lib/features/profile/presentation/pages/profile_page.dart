import 'package:flutter/material.dart';
import 'package:flutter_mediaCubit.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';

import '../../../../gen_l10n/app_localizations.dart';
import '../../../auth/presentation/bloc/auth_mediaCubit.dart';
import 'edit_profile_page.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      appBar: AppBar(
        title:  Text(l10n.profile),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {
              context.push('/profile/settings');
            },
          ),
        ],
      ),
      body: BlocConsumer<AuthCubit, AuthState>(
        listener: (context, state) {
          state.when(
            initial: () {},
            loading: () {},
            authenticated: (user, token) {},
            unauthenticated: () {
              context.go('/splash');
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
                            color: Colors.white.withValues(alpha: 0.9),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Chip(
                          label: Text(
                            user.role,
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
                    l10n.governorate,
                    user.governorate ?? 'غير محدد',
                    Icons.location_on,
                  ).animate().fadeIn(delay: 200.ms).slideX(begin: -0.3, end: 0),

                  const SizedBox(height: 16),

                  _buildInfoCard(
                    context,
                    l10n.phone,
                    user.phone ?? 'غير محدد',
                    Icons.phone,
                  ).animate().fadeIn(delay: 400.ms).slideX(begin: -0.3, end: 0),

                  const SizedBox(height: 16),

                  _buildInfoCard(
                    context,
                    l10n.university,
                    user.university ?? 'غير محدد',
                    Icons.school,
                  ).animate().fadeIn(delay: 500.ms).slideX(begin: -0.3, end: 0),

                  const SizedBox(height: 16),

                  _buildInfoCard(
                    context,
                    l10n.createdAt,
                    _formatDate(user.createdAt),
                    Icons.calendar_today,
                  ).animate().fadeIn(delay: 600.ms).slideX(begin: -0.3, end: 0),

                  const SizedBox(height: 16),

                  _buildInfoCard(
                    context,
                    l10n.nationalId,
                    user.nationalId ?? 'غير محدد',
                    Icons.badge,
                  ).animate().fadeIn(delay: 600.ms).slideX(begin: -0.3, end: 0),


                  const SizedBox(height: 16),

                  _buildInfoCard(
                    context,
                    l10n.membershipNumber,
                    user.membershipNumber ?? 'غير محدد',
                    Icons.card_membership,
                  ).animate().fadeIn(delay: 600.ms).slideX(begin: -0.3, end: 0),
                  const SizedBox(height: 32),

                  // Action Buttons
                  Column(
                    children: [
                      _buildActionButton(
                        context,
                        l10n.editProfile,
                        Icons.edit,
                        () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (context) => EditProfilePage(user: user),
                            ),
                          );
                        },
                      ).animate().fadeIn(delay: 800.ms).slideY(begin: 0.3, end: 0),

                      const SizedBox(height: 12),

                      _buildActionButton(
                        context,
                        l10n.settings,
                        Icons.settings,
                        () {
                          context.push('/profile/settings');
                        },
                      ).animate().fadeIn(delay: 1000.ms).slideY(begin: 0.3, end: 0),

                      const SizedBox(height: 12),

                      _buildActionButton(
                        context,
                        l10n.logout,
                        Icons.logout,
                        () => context.read<AuthCubit>().logout(),
                        isDestructive: true,
                      ).animate().fadeIn(delay: 1200.ms).slideY(begin: 0.3, end: 0),
                    ],
                  ),
                ],
              ),
            ),
            unauthenticated: () => SingleChildScrollView(
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
                      ],
                    ),
                  ).animate().fadeIn().slideY(begin: -0.3, end: 0),

                  const SizedBox(height: 24),

                  // Action Buttons
                  Column(
                    children: [

                      const SizedBox(height: 12),

                      _buildActionButton(
                        context,
                        l10n.settings,
                        Icons.settings,
                            () {
                          context.push('/profile/settings');
                        },
                      ).animate().fadeIn(delay: 1000.ms).slideY(begin: 0.3, end: 0),

                      const SizedBox(height: 12),

                      context.read<AuthCubit>().asGuest == false ? _buildActionButton(
                        context,
                        l10n.logout,
                        Icons.logout,
                            () => context.read<AuthCubit>().logout(),
                        isDestructive: true,
                      ).animate().fadeIn(delay: 1200.ms).slideY(begin: 0.3, end: 0) :
                      _buildActionButton(
                        context,
                        l10n.login,
                        Icons.login,
                            () => context.go('/login'),
                        isDestructive: false,
                      ).animate().fadeIn(delay: 1200.ms).slideY(begin: 0.3, end: 0),
                    ],
                  ),
                ],
              ),
            ),
            error: (message) => SingleChildScrollView(
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
                      ],
                    ),
                  ).animate().fadeIn().slideY(begin: -0.3, end: 0),

                  const SizedBox(height: 24),

                  // Action Buttons
                  Column(
                    children: [

                      const SizedBox(height: 12),

                      _buildActionButton(
                        context,
                        l10n.settings,
                        Icons.settings,
                            () {
                          context.push('/profile/settings');
                        },
                      ).animate().fadeIn(delay: 1000.ms).slideY(begin: 0.3, end: 0),

                      const SizedBox(height: 12),

                      context.read<AuthCubit>().asGuest == false ? _buildActionButton(
                        context,
                        l10n.logout,
                        Icons.logout,
                            () => context.read<AuthCubit>().logout(),
                        isDestructive: true,
                      ).animate().fadeIn(delay: 1200.ms).slideY(begin: 0.3, end: 0) :
                      _buildActionButton(
                        context,
                        l10n.login,
                        Icons.login,
                            () => context.go('/login'),
                        isDestructive: false,
                      ).animate().fadeIn(delay: 1200.ms).slideY(begin: 0.3, end: 0),
                    ],
                  ),
                ],
              ),
            ),
            /*error: (message) => Center(
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
                      context.read<AuthCubit>().getCurrentUser();
                    },
                    child: const Text('إعادة المحاولة'),
                  ),
                ],
              ),
            ),*/
          );
        },
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
            color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.7),
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
          color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.5),
        ),
        onTap: onTap,
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}