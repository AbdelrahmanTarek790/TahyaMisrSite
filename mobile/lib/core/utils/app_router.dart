import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:tahya_misr_app/features/about_us_screen/about_us_screen.dart';
import 'package:tahya_misr_app/features/media/presentation/pages/media_detail_page.dart';

import '../../features/auth/presentation/pages/login_page.dart';
import '../../features/auth/presentation/pages/register_page.dart';
import '../../features/auth/presentation/pages/splash_page.dart';
import '../../features/home/presentation/pages/home_page.dart';
import '../../features/news/presentation/pages/news_list_page.dart';
import '../../features/news/presentation/pages/news_detail_page.dart';
import '../../features/events/presentation/pages/events_list_page.dart';
import '../../features/events/presentation/pages/event_detail_page.dart';
import '../../features/profile/presentation/pages/profile_page.dart';
import '../../features/profile/presentation/pages/settings_page.dart';
import '../../features/media/presentation/pages/media_gallery_page.dart';
import '../../features/dashboard/presentation/pages/dashboard_page.dart';
import '../../features/user_management/presentation/pages/user_management_page.dart';
import '../../features/content_management/presentation/pages/content_management_page.dart';
import '../../features/positions/presentation/pages/position_management_page.dart';
import '../../shared/widgets/main_navigation.dart';

class AppRouter {
  late final GoRouter router;

  AppRouter() {
    router = GoRouter(
      initialLocation: '/splash',
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
              path: '/home',
              builder: (context, state) => const HomePage(),
            ),
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
              routes: [
                GoRoute(
                  path: 'detail/:id', // إزالة "/" من البداية
                  builder: (context, state) => MediaDetailPage(
                    newsId: state.pathParameters['id']!,
                  ),
                ),
              ],
            ),
            GoRoute(
              path: '/profile',
              builder: (context, state) => const ProfilePage(),
              routes: [
                GoRoute(
                  path: 'settings',
                  builder: (context, state) => const SettingsPage(),
                ),
              ],
            ),
          ],
        ),

        // User Management (Admin only)
        GoRoute(
          path: '/user-management',
          builder: (context, state) => const UserManagementPage(),
        ),

        // Content Management (Admin only)
        GoRoute(
          path: '/content-management',
          builder: (context, state) => const ContentManagementPage(),
        ),

        // Position Management (Admin only)
        GoRoute(
          path: '/position-management',
          builder: (context, state) => const PositionManagementPage(),
        ),

        // ABOUT US
        GoRoute(
          path: '/about-us',
          builder: (context, state) => const AboutUsScreen(),
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
