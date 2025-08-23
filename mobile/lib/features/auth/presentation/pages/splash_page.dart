import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:get_it/get_it.dart';
import 'package:tahya_misr_app/core/constants/app_theme.dart';

import '../bloc/auth_bloc.dart';
import '../bloc/auth_state.dart';
import '../bloc/auth_event.dart';

class SplashPage extends StatefulWidget {
  const SplashPage({super.key});

  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> {
  @override
  void initState() {
    super.initState();
    // Check authentication status after a delay
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        context.read<AuthBloc>().add(const AuthEvent.checkAuthStatus());
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocListener<AuthBloc, AuthState>(
        listener: (context, state) {
          state.when(
            initial: () {},
            loading: () {},
            authenticated: (user, token) {
              context.go('/home');
            },
            unauthenticated: () {
              context.go('/login');
            },
            error: (message) {
              context.go('/login');
            },
          );
        },
        child: Container(
          width: double.infinity,
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Color(0xFFFFFFF3), // Off White
                Color(0xFFFAECB2), // Beige
              ],
            ),
          ),
          child: SafeArea(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Logo
                Container(
                  width: 250,
                  height: 250,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                    image: const DecorationImage(
                      image: AssetImage('assets/images/Logo.jpg'),
                      fit: BoxFit.cover,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.2),
                        blurRadius: 20,
                        offset: const Offset(0, 10),
                      ),
                    ],
                  ),
                ).animate()
                  .scale(duration: 800.ms, curve: Curves.elasticOut)
                  .fadeIn(),

                const SizedBox(height: 32),

                // App Title
                Text(
                  'اتحاد شباب تحيا مصر',
                  style: Theme.of(context).textTheme.displayLarge?.copyWith(
                    color: Theme.of(context).colorScheme.primary, // Gold (Primary),
                    fontWeight: FontWeight.bold,
                    shadows: [
                      Shadow(
                        color: Theme.of(context).colorScheme.shadow, // Dynamic shadow
                        offset: const Offset(0, 2),
                        blurRadius: 4,
                      ),
                    ],
                  ),
                ).animate()
                  .fadeIn(delay: 400.ms, duration: 600.ms)
                  .slideY(begin: 0.3, end: 0),

                const SizedBox(height: 8),

                // Subtitle
                Text(
                  'جمهورية مصر العربية وزارة الشباب والرياضة',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    color: Theme.of(context).colorScheme.secondary.withOpacity(0.9), // Red (Accent)
                    fontWeight: FontWeight.w100,
                    shadows: [
                      Shadow(
                        color: Theme.of(context).colorScheme.shadow.withOpacity(0.2),
                        offset: const Offset(0, 1),
                        blurRadius: 2,
                      ),
                    ],
                  ),
                ).animate()
                  .fadeIn(delay: 600.ms, duration: 600.ms)
                  .slideY(begin: 0.3, end: 0),

                const SizedBox(height: 48),

                // Loading Indicator
                SizedBox(
                  width: 40,
                  height: 40,
                  child: CircularProgressIndicator(
                    strokeWidth: 4,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      Theme.of(context).colorScheme.secondary.withOpacity(0.8), // Red Accent
                    ),
                  ),
                ).animate()
                  .fadeIn(delay: 1000.ms)
                  .scale(delay: 1000.ms, duration: 400.ms),

                const SizedBox(height: 24),

                // Loading Text
                Text(
                  'مرحباً بك في اتحاد شباب تحيا مصر ✨',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: Theme.of(context).colorScheme.onBackground.withOpacity(0.9),
                    fontWeight: FontWeight.w600,
                  ),
                ).animate()
                  .fadeIn(delay: 1200.ms)
                  .slideY(begin: 0.2, end: 0),
              ],
            ),
          ),
        ),
      ),
    );
  }
}