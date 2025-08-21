import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/presentation/pages/login_page.dart';
import '../../features/auth/presentation/pages/register_page.dart';
import '../../features/auth/presentation/pages/splash_page.dart';
import '../../features/news/presentation/pages/news_list_page.dart';
import '../../features/news/presentation/pages/news_detail_page.dart';
import '../../features/events/presentation/pages/events_list_page.dart';
import '../../features/events/presentation/pages/event_detail_page.dart';
import '../../features/profile/presentation/pages/profile_page.dart';
import '../../features/media/presentation/pages/media_gallery_page.dart';
import '../../features/dashboard/presentation/pages/dashboard_page.dart';
import '../../shared/widgets/main_navigation.dart';

class AppRouter {
  late final GoRouter router;

  AppRouter() {
    router = GoRouter(
      initialLocation: '/dashboard',
      routes: [
        // Splash screen
        GoRoute(
          path: '/splash',
          builder: (context, state) => const SplashPage(),
        ),

        // Authentication routes
        GoRoute(
          path: '/login',
          builder: (context, state) => const LoginPage(),
        ),
        GoRoute(
          path: '/register',
          builder: (context, state) => const RegisterPage(),
        ),

        // Main app shell with bottom navigation
        ShellRoute(
          builder: (context, state, child) => MainNavigation(child: child),
          routes: [
            GoRoute(
              path: '/dashboard',
              builder: (context, state) => const DashboardPage(),
            ),
            GoRoute(
              path: '/news',
              builder: (context, state) => const NewsListPage(),
              routes: [
                GoRoute(
                  path: 'detail/:id', // إزالة "/" من البداية
                  builder: (context, state) => NewsDetailPage(
                    newsId: state.pathParameters['id']!,
                  ),
                ),
              ],
            ),
            GoRoute(
              path: '/events',
              builder: (context, state) => const EventsListPage(),
              routes: [
                GoRoute(
                  path: 'detail/:id', // إزالة "/" من البداية
                  builder: (context, state) => EventDetailPage(
                    eventId: state.pathParameters['id']!,
                  ),
                ),
              ],
            ),
            GoRoute(
              path: '/media',
              builder: (context, state) => const MediaGalleryPage(),
            ),
            GoRoute(
              path: '/profile',
              builder: (context, state) => const ProfilePage(),
            ),
          ],
        ),
      ],
      errorBuilder: (context, state) => Scaffold(
        body: Center(
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
                'صفحة غير موجودة',
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 8),
              Text(
                'المسار المطلوب غير متاح',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () => context.go('/dashboard'),
                child: const Text('العودة للرئيسية'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
