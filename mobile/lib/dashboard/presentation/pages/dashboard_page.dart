import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../../../auth/presentation/bloc/auth_state.dart';
import '../bloc/dashboard_bloc.dart';
import '../bloc/dashboard_state.dart';
import '../bloc/dashboard_event.dart';
import '../widgets/admin_dashboard_view.dart';
import '../widgets/volunteer_dashboard_view.dart';
import '../widgets/student_dashboard_view.dart';

class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => GetIt.instance<DashboardBloc>()
        ..add(const DashboardEvent.getDashboardStats()),
      child: const DashboardView(),
    );
  }
}

class DashboardView extends StatefulWidget {
  const DashboardView({super.key});

  @override
  State<DashboardView> createState() => _DashboardViewState();
}

class _DashboardViewState extends State<DashboardView> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('لوحة التحكم'),
        backgroundColor: Theme.of(context).colorScheme.surface,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              context.read<DashboardBloc>().add(
                    const DashboardEvent.refreshDashboard(),
                  );
            },
          ),
        ],
      ),
      body: BlocBuilder<AuthBloc, AuthState>(
        builder: (context, authState) {
          return authState.maybeWhen(
            authenticated: (user, token) => BlocBuilder<DashboardBloc, DashboardState>(
              builder: (context, dashboardState) {
                return dashboardState.when(
                  initial: () => const Center(
                    child: CircularProgressIndicator(),
                  ),
                  loading: () => const Center(
                    child: CircularProgressIndicator(),
                  ),
                  loaded: (stats, activity) => RefreshIndicator(
                    onRefresh: () async {
                      context.read<DashboardBloc>().add(
                            const DashboardEvent.refreshDashboard(),
                          );
                    },
                    child: _buildRoleBasedDashboard(user.role, stats, activity)
                        .animate()
                        .fadeIn(duration: 300.ms)
                        .slideY(begin: 0.1, end: 0),
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
                          'حدث خطأ',
                          style: Theme.of(context).textTheme.headlineSmall,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          message,
                          style: Theme.of(context).textTheme.bodyMedium,
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 24),
                        ElevatedButton(
                          onPressed: () {
                            context.read<DashboardBloc>().add(
                                  const DashboardEvent.refreshDashboard(),
                                );
                          },
                          child: const Text('إعادة المحاولة'),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
            orElse: () => const Center(
              child: Text('يرجى تسجيل الدخول أولاً'),
            ),
          );
        },
      ),
    );
  }

  Widget _buildRoleBasedDashboard(String role, stats, activity) {
    switch (role.toLowerCase()) {
      case 'admin':
        return AdminDashboardView(
          stats: stats,
          recentActivity: activity,
        );
      case 'volunteer':
        return VolunteerDashboardView(
          stats: stats,
          recentActivity: activity,
        );
      case 'student':
      default:
        return StudentDashboardView(
          stats: stats,
          recentActivity: activity,
        );
    }
  }
}