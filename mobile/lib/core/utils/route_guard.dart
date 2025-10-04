import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/presentation/cubits/auth_cubit.dart';
import '../../features/auth/data/models/user_model.dart';

class RouteGuard {
  static bool isAuthenticated(BuildContext context) {
    final authState = context.read<AuthCubit>().state;
    return authState.maybeWhen(
      authenticated: (_, __) => true,
      orElse: () => false,
    );
  }

  static bool hasRole(BuildContext context, String requiredRole) {
    final authState = context.read<AuthCubit>().state;
    return authState.maybeWhen(
      authenticated: (user, _) => user.role == requiredRole,
      orElse: () => false,
    );
  }

  static bool isAdmin(BuildContext context) {
    return hasRole(context, 'admin');
  }

  static UserModel? getCurrentUser(BuildContext context) {
    final authState = context.read<AuthCubit>().state;
    return authState.maybeWhen(
      authenticated: (user, _) => user,
      orElse: () => null,
    );
  }

  static String? redirect(BuildContext context, GoRouterState state) {
    final isLoggedIn = isAuthenticated(context);
    final isAdmin = RouteGuard.isAdmin(context);
    final path = state.fullPath;

    // List of routes that require authentication
    final protectedRoutes = [
      '/dashboard',
      '/profile',
      '/user-management',
      '/content-management',
      '/position-management',
      '/join-request-management',
      '/change-password',
    ];

    // List of routes that require admin role
    final adminRoutes = [
      '/user-management',
      '/content-management', 
      '/position-management',
      '/join-request-management',
    ];

    // List of public routes that don't require authentication
    final publicRoutes = [
      '/splash',
      '/login',
      '/register',
      '/home',
      '/news',
      '/events',
      '/media',
      '/about-us',
      '/join-request',
      '/forgot-password',
      '/reset-password',
    ];

    // If user is not logged in and trying to access protected route
    if (!isLoggedIn && protectedRoutes.any((route) => path?.startsWith(route) == true)) {
      return '/login';
    }

    // If user is logged in but not admin and trying to access admin route
    if (isLoggedIn && !isAdmin && adminRoutes.any((route) => path?.startsWith(route) == true)) {
      return '/dashboard'; // Redirect to dashboard instead of home
    }

    // If user is logged in and tries to access auth pages, redirect to dashboard
    if (isLoggedIn && (path == '/login' || path == '/register')) {
      return '/dashboard';
    }

    return null; // No redirect needed
  }
}

class AdminGuard extends StatelessWidget {
  final Widget child;
  final Widget? fallback;

  const AdminGuard({
    super.key,
    required this.child,
    this.fallback,
  });

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthCubit, AuthState>(
      builder: (context, state) {
        return state.maybeWhen(
          authenticated: (user, _) {
            if (user.role == 'admin') {
              return child;
            } else {
              return fallback ?? const _UnauthorizedPage();
            }
          },
          orElse: () => const _LoginRequiredPage(),
        );
      },
    );
  }
}

class _UnauthorizedPage extends StatelessWidget {
  const _UnauthorizedPage();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('غير مصرح'),
        backgroundColor: Colors.red,
        foregroundColor: Colors.white,
      ),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.block,
              size: 64,
              color: Colors.red,
            ),
            SizedBox(height: 16),
            Text(
              'غير مصرح لك بالوصول',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            Text(
              'هذه الصفحة مخصصة للمديرين فقط',
              style: TextStyle(
                color: Colors.grey,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _LoginRequiredPage extends StatelessWidget {
  const _LoginRequiredPage();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('تسجيل الدخول مطلوب'),
        backgroundColor: Colors.orange,
        foregroundColor: Colors.white,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.login,
              size: 64,
              color: Colors.orange,
            ),
            const SizedBox(height: 16),
            const Text(
              'تسجيل الدخول مطلوب',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'يرجى تسجيل الدخول للوصول لهذه الصفحة',
              style: TextStyle(
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () => context.go('/login'),
              icon: const Icon(Icons.login),
              label: const Text('تسجيل الدخول'),
            ),
          ],
        ),
      ),
    );
  }
}