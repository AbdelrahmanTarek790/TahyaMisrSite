import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:tahya_misr_app/core/dependency_injection/injection.dart';
import 'package:toastification/toastification.dart';

import '../../../../gen_l10n/app_localizations.dart';
import '../cubits/auth_cubit.dart';

class ResetPasswordPage extends StatefulWidget {
  final String? token;

  const ResetPasswordPage({super.key, this.token});

  @override
  State<ResetPasswordPage> createState() => _ResetPasswordPageState();
}

class _ResetPasswordPageState extends State<ResetPasswordPage> {
  final _formKey = GlobalKey<FormState>();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;

  @override
  void dispose() {
    _passwordController.dispose();
    _confirmPasswordController.dispose();
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
          authenticated: (user, token) {},
          unauthenticated: () {
            getIt<ShowToast>().showToast(
              context: context,
              message: 'تم إعادة تعيين كلمة المرور بنجاح',
              type: ToastificationType.success,
            );
            context.go('/login');
          },
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
          appBar: AppBar(
            title: const Text('إعادة تعيين كلمة المرور'),
          ),
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const SizedBox(height: 32),

                  // Icon
                  Icon(
                    Icons.lock_open,
                    size: 80,
                    color: Theme.of(context).colorScheme.primary,
                  ).animate().scale(duration: 800.ms).fadeIn(),

                  const SizedBox(height: 32),

                  // Title
                  Text(
                    'إعادة تعيين كلمة المرور',
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                    textAlign: TextAlign.center,
                  ).animate().fadeIn(delay: 200.ms),

                  const SizedBox(height: 16),

                  // Description
                  Text(
                    'أدخل كلمة المرور الجديدة الخاصة بك',
                    style: Theme.of(context).textTheme.bodyLarge,
                    textAlign: TextAlign.center,
                  ).animate().fadeIn(delay: 400.ms),

                  const SizedBox(height: 48),

                  // Password Field
                  TextFormField(
                    controller: _passwordController,
                    obscureText: _obscurePassword,
                    decoration: InputDecoration(
                      labelText: 'كلمة المرور الجديدة',
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
                        return 'يرجى إدخال كلمة المرور';
                      }
                      if (value.length < 6) {
                        return 'يجب أن تكون كلمة المرور 6 أحرف على الأقل';
                      }
                      return null;
                    },
                  ).animate().fadeIn(delay: 600.ms).slideX(begin: -0.3, end: 0),

                  const SizedBox(height: 16),

                  // Confirm Password Field
                  TextFormField(
                    controller: _confirmPasswordController,
                    obscureText: _obscureConfirmPassword,
                    decoration: InputDecoration(
                      labelText: 'تأكيد كلمة المرور',
                      prefixIcon: const Icon(Icons.lock_outlined),
                      suffixIcon: IconButton(
                        icon: Icon(
                          _obscureConfirmPassword
                              ? Icons.visibility
                              : Icons.visibility_off,
                        ),
                        onPressed: () {
                          setState(() {
                            _obscureConfirmPassword = !_obscureConfirmPassword;
                          });
                        },
                      ),
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'يرجى تأكيد كلمة المرور';
                      }
                      if (value != _passwordController.text) {
                        return 'كلمات المرور غير متطابقة';
                      }
                      return null;
                    },
                  ).animate().fadeIn(delay: 800.ms).slideX(begin: -0.3, end: 0),

                  const SizedBox(height: 32),

                  // Submit Button
                  ElevatedButton(
                    onPressed: state.maybeWhen(
                      loading: () => null,
                      orElse: () => _handleSubmit,
                    ),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      backgroundColor: Theme.of(context).colorScheme.primary,
                      foregroundColor: Theme.of(context).colorScheme.onPrimary,
                    ),
                    child: state.maybeWhen(
                      loading: () => const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      ),
                      orElse: () => const Text(
                        'إعادة تعيين كلمة المرور',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                      ),
                    ),
                  ).animate().fadeIn(delay: 1000.ms).slideY(begin: 0.3, end: 0),

                  const SizedBox(height: 24),

                  // Back to Login
                  TextButton(
                    onPressed: () => context.go('/login'),
                    child: Text(
                      'العودة لتسجيل الدخول',
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.primary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ).animate().fadeIn(delay: 1200.ms),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  void _handleSubmit() {
    if (_formKey.currentState?.validate() ?? false) {
      final token = widget.token;
      if (token == null || token.isEmpty) {
        getIt<ShowToast>().showToast(
          context: context,
          message: 'رمز إعادة التعيين غير صالح',
          type: ToastificationType.error,
        );
        return;
      }

      context.read<AuthCubit>().resetPassword(
            token: token,
            password: _passwordController.text,
          );
    }
  }
}
