import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/constants/app_theme.dart';
import '../../../../gen_l10n/app_localizations.dart';
import '../cubits/auth_cubit.dart';

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
    Future.delayed(const Duration(seconds: 5), () {
      if (mounted) {
        context.read<AuthCubit>().checkAuthStatus();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      body: BlocListener<AuthCubit, AuthState>(
        listener: (context, state) {
          state.when(
            initial: () {},
            loading: () {},
            authenticated: (user, token) {
              context.go('/home'); //home
            },
            unauthenticated: () {
              context.go('/login'); //login
            },
            error: (message) {
              context.go('/login'); //login
            },
          );
        },
        child: Container(
          width: double.infinity,
          decoration:  const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
               AppTheme.primaryColor,
                AppTheme.secondaryColor,
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
                    image: const DecorationImage(
                      image: AssetImage('assets/images/Logo.png'),
                      fit: BoxFit.cover,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.white.withValues(alpha: 0.2),
                        blurRadius: 10,
                        offset: const Offset(0, 5),
                      ),
                    ],
                  ),
                ).animate()
                  .scale(duration: 800.ms, curve: Curves.elasticOut)
                  .fadeIn(),

                const SizedBox(height: 32),

                // App Title
                Text(
                  l10n.appTitle,
                  style: Theme.of(context)
                      .textTheme
                      .displayMedium
                      ?.copyWith(
                    color: Theme.of(context).colorScheme.primary,
                    fontWeight: FontWeight.bold,
                  ),
                ).animate()
                  .fadeIn(delay: 400.ms, duration: 600.ms)
                  .slideY(begin: 0.3, end: 0),

                const SizedBox(height: 8),

                // Subtitle
                Text(
                  l10n.appSubTitle,
                  style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                    color: Theme.of(context).colorScheme.secondary.withValues(alpha: 0.9), // Red (Accent)
                    fontWeight: FontWeight.w200,
                    fontSize: 15,
                    shadows: [
                      const Shadow(
                        // color: Theme.of(context).colorScheme.shadow.withValues(alpha: 0.2),
                        offset: Offset(1, 1),
                        blurRadius: 2,
                      ),
                    ],
                  ),
                ).animate()
                  .fadeIn(delay: 600.ms, duration: 600.ms)
                  .slideY(begin: 0.3, end: 0),

                const SizedBox(height: 30),

                // Loading Indicator
                SizedBox(
                  width: 40,
                  height: 40,
                  child: CircularProgressIndicator(
                    strokeWidth: 4,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      Theme.of(context).colorScheme.primary.withValues(alpha: 0.8), // Red Accent
                    ),
                  ),
                ).animate()
                  .fadeIn(delay: 1000.ms)
                  .scale(delay: 1000.ms, duration: 400.ms),

                const SizedBox(height: 24),

                MovingEgyptFlagWords(text: l10n.welcomeTitle).animate()
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


class EgyptFlagText extends StatelessWidget {
  final String text;
  const EgyptFlagText({super.key, required this.text});

  @override
  Widget build(BuildContext context) {
    return Animate(
      onPlay: (controller) => controller.repeat(), // يفضل يعمل loop
      effects: [
        ShimmerEffect(
          duration: 2500.ms,
          colors: const [
            Colors.red,     // أحمر
            Colors.white,   // أبيض
            Colors.black,   // أسود
            Colors.red,     // يعيد الأحمر عشان الـ loop
          ],
        ),
      ],
      child: Text(
        text,
        textAlign: TextAlign.center,
        style: Theme.of(context).textTheme.headlineMedium?.copyWith(
          fontWeight: FontWeight.bold,
          fontSize: 22,
        ),
      ),
    );
  }
}





class MovingEgyptFlagWords extends StatelessWidget {
  final String text;
  const MovingEgyptFlagWords({super.key, required this.text});

  @override
  Widget build(BuildContext context) {
    final colors = [Colors.red, Colors.white, Colors.black]; // ألوان العلم
    final words = text.split(' '); // تقسيم النص لكلمات

    return Wrap(
      spacing: 8,
      children: words.asMap().entries.map((entry) {
        final index = entry.key;
        final word = entry.value;

        return Text(
          word,
          style: TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.bold,
            color: colors[index % colors.length], // يوزع ألوان العلم
          ),
        )
            .animate(
          onPlay: (controller) => controller.repeat(), // حركة متكررة
        )
            .moveY(
          begin: 0,
          end: -12, // الكلمة تطلع لفوق
          delay: (index * 300).ms, // كل كلمة تتأخر شوية
          duration: 700.ms,
          curve: Curves.easeInOut,
        )
            .then()
            .moveY(
          begin: -12,
          end: 0,
          duration: 700.ms,
          curve: Curves.easeInOut,
        );
      }).toList(),
    );
  }
}

