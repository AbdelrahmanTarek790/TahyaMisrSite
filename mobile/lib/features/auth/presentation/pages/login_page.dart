import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:tahya_misr_app/core/dependency_injection/injection.dart';
import 'package:toastification/toastification.dart';

import '../../../../gen_l10n/app_localizations.dart';
import '../../../../shared/widgets/main_navigation.dart';
import '../cubits/auth_cubit.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return BlocConsumer<AuthCubit, AuthState>(
      listener: (context, state) {
        state.when(
          initial: () {},
          loading: () {},
          authenticated: (user, token) {
            getIt<ShowToast>().showToast(
              context: context,
              message: '${l10n.successLogin} ${user.name}.',
              type: ToastificationType.success,
            );
            context.go('/home');
          },
          unauthenticated: () {},
          error: (message) {
            getIt<ShowToast>().showToast(
              context: context,
              message: message,
              type: ToastificationType.error,
            );
          },
        );
      },
      builder: (context, state) {

        return Scaffold(
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const SizedBox(height: 60),

                  // Logo and Title
                  Column(
                    children: [
                      Container(
                        width: 150,
                        height: 150,
                        decoration: const BoxDecoration(
                          image: DecorationImage(
                            image: AssetImage('assets/images/Logo.png'),
                            fit: BoxFit.cover,
                          ),
                        ),
                      ).animate().scale(duration: 800.ms).fadeIn(),
                      const SizedBox(height: 24),
                      Text(
                        l10n.appTitle,
                        style: Theme.of(context)
                            .textTheme
                            .displayMedium
                            ?.copyWith(
                              color: Theme.of(context).colorScheme.primary,
                              fontWeight: FontWeight.bold,
                            ),
                      )
                          .animate()
                          .fadeIn(delay: 200.ms)
                          .slideY(begin: 0.3, end: 0),
                      const SizedBox(height: 8),
                      Text(
                      l10n.appSubTitle,
                        style: Theme.of(context)
                            .textTheme
                            .titleLarge
                            ?.copyWith(
                              color: Theme.of(context)
                                  .colorScheme
                                  .onSurface
                                  .withValues(alpha: 0.7),
                            ),
                      )
                          .animate()
                          .fadeIn(delay: 400.ms)
                          .slideY(begin: 0.3, end: 0),
                    ],
                  ),

                  const SizedBox(height: 48),

                  // Login Form
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Text(
                        l10n.login,
                        style: Theme.of(context)
                            .textTheme
                            .headlineMedium
                            ?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                        textAlign: TextAlign.center,
                      )
                          .animate()
                          .fadeIn(delay: 600.ms)
                          .slideX(begin: -0.3, end: 0),

                      const SizedBox(height: 32),

                      // Email Field
                      TextFormField(
                        controller: _emailController,
                        keyboardType: TextInputType.emailAddress,
                        decoration:  InputDecoration(
                          labelText: l10n.email,
                          prefixIcon: const Icon(Icons.email_outlined),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return l10n.emailValidationEmpty;
                          }
                          if (!RegExp(r'^[^@]+@[^@]+\.[^@]+')
                              .hasMatch(value)) {
                            return l10n.emailValidation;
                          }
                          return null;
                        },
                      )
                          .animate()
                          .fadeIn(delay: 800.ms)
                          .slideX(begin: -0.3, end: 0),

                      const SizedBox(height: 16),

                      // Password Field
                      TextFormField(
                        controller: _passwordController,
                        obscureText: _obscurePassword,
                        decoration: InputDecoration(
                          labelText: l10n.password,
                          prefixIcon: const Icon(Icons.lock_outlined),
                          suffixIcon: IconButton(
                            icon: Icon(
                              _obscurePassword
                                  ? Icons.visibility
                                  : Icons.visibility_off,
                            ),
                            onPressed: () {
                              setState(() {
                                _obscurePassword = !_obscurePassword;
                              });
                            },
                          ),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return l10n.passwordValidationEmpty;
                          }
                          if (value.length < 6) {
                            return l10n.passwordValidation;
                          }
                          return null;
                        },
                      )
                          .animate()
                          .fadeIn(delay: 1000.ms)
                          .slideX(begin: -0.3, end: 0),

                      const SizedBox(height: 32),

                      // Login Button
                      ElevatedButton(
                        onPressed: state.maybeWhen(
                          loading: () => null,
                          orElse: () => _handleLogin,
                        ),
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          backgroundColor:
                              Theme.of(context).colorScheme.primary,
                          foregroundColor:
                              Theme.of(context).colorScheme.onPrimary,
                        ),
                        child: state.maybeWhen(
                          loading: () => const SizedBox(
                            height: 20,
                            width: 20,
                            child:
                                CircularProgressIndicator(strokeWidth: 2),
                          ),
                          orElse: () =>  Text(
                            l10n.login,
                            style: const TextStyle(
                                fontSize: 16, fontWeight: FontWeight.w600,),
                          ),
                        ),
                      )
                          .animate()
                          .fadeIn(delay: 1200.ms)
                          .slideY(begin: 0.3, end: 0),

                      const SizedBox(height: 24),

                      // Guest Login Button
                      OutlinedButton(
                        onPressed: () {
                          context.read<AuthCubit>().setAsGuest(true);
                          print(context.read<AuthCubit>().asGuest);
                          context.go('/home');
                        },
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          side: BorderSide(color: Theme.of(context).colorScheme.primary),
                          foregroundColor: Theme.of(context).colorScheme.primary,
                        ),
                        child: const Text(
                        'مرحبا كزائر',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      )
                          .animate()
                          .fadeIn(delay: 1300.ms)
                          .slideY(begin: 0.3, end: 0),

                      // Register Link
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            l10n.notHaveAccount,
                            style: Theme.of(context).textTheme.bodyMedium,
                          ),
                          TextButton(
                            onPressed: () => context.push('/join-request'),
                            child: Text(
                              'انضم الان',
                              style: TextStyle(
                                color:
                                    Theme.of(context).colorScheme.primary,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ).animate().fadeIn(delay: 1400.ms),
                    ],
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  void _handleLogin() {
    context.read<AuthCubit>().setAsGuest(false);
    if (_formKey.currentState?.validate() ?? false) {
      context.read<AuthCubit>().login(
        email: _emailController.text.trim(),
        password: _passwordController.text,
      );
    }
  }
}
