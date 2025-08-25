import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';

import '../../../../gen_l10n/app_localizations.dart';
import '../../../profile/presentation/pages/edit_profile_page.dart';
import '../bloc/auth_bloc.dart';
import '../bloc/auth_state.dart';
import '../bloc/auth_event.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _phoneController = TextEditingController();

  final _nationalIdController = TextEditingController();
  final _universityController = TextEditingController();

  // final _membershipNumberController = TextEditingController();

  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;
  String _selectedRole = 'student';
  String? _selectedGovernorate;

  final List<String> _roles = ['student', 'volunteer'];
  final List<Governorate> governoratesList = [
    Governorate(id: 'cairo', nameAr: 'القاهرة', nameEn: 'Cairo'),
    Governorate(id: 'giza', nameAr: 'الجيزة', nameEn: 'Giza'),
    Governorate(id: 'alexandria', nameAr: 'الإسكندرية', nameEn: 'Alexandria'),
    Governorate(id: 'dakahlia', nameAr: 'الدقهلية', nameEn: 'Dakahlia'),
    Governorate(id: 'sharqia', nameAr: 'الشرقية', nameEn: 'Sharqia'),
    Governorate(id: 'qalyubia', nameAr: 'القليوبية', nameEn: 'Qalyubia'),
    Governorate(id: 'kafr_el_sheikh', nameAr: 'كفر الشيخ', nameEn: 'Kafr El Sheikh'),
    Governorate(id: 'gharbia', nameAr: 'الغربية', nameEn: 'Gharbia'),
    Governorate(id: 'monufia', nameAr: 'المنوفية', nameEn: 'Monufia'),
    Governorate(id: 'beheira', nameAr: 'البحيرة', nameEn: 'Beheira'),
    Governorate(id: 'ismailia', nameAr: 'الإسماعيلية', nameEn: 'Ismailia'),
    Governorate(id: 'portsaid', nameAr: 'بورسعيد', nameEn: 'Port Said'),
    Governorate(id: 'suez', nameAr: 'السويس', nameEn: 'Suez'),
    Governorate(id: 'north_sinai', nameAr: 'شمال سيناء', nameEn: 'North Sinai'),
    Governorate(id: 'south_sinai', nameAr: 'جنوب سيناء', nameEn: 'South Sinai'),
    Governorate(id: 'fayoum', nameAr: 'الفيوم', nameEn: 'Fayoum'),
    Governorate(id: 'beni_suef', nameAr: 'بني سويف', nameEn: 'Beni Suef'),
    Governorate(id: 'minya', nameAr: 'المنيا', nameEn: 'Minya'),
    Governorate(id: 'asyut', nameAr: 'أسيوط', nameEn: 'Asyut'),
    Governorate(id: 'sohag', nameAr: 'سوهاج', nameEn: 'Sohag'),
    Governorate(id: 'qena', nameAr: 'قنا', nameEn: 'Qena'),
    Governorate(id: 'luxor', nameAr: 'الأقصر', nameEn: 'Luxor'),
    Governorate(id: 'aswan', nameAr: 'أسوان', nameEn: 'Aswan'),
    Governorate(id: 'red_sea', nameAr: 'البحر الأحمر', nameEn: 'Red Sea'),
    Governorate(id: 'new_valley', nameAr: 'الوادي الجديد', nameEn: 'New Valley'),
    Governorate(id: 'matrouh', nameAr: 'مطروح', nameEn: 'Matrouh'),
  ];

  String mapNameToId(String name) {
    final gov = governoratesList.firstWhere(
          (g) => g.nameAr == name || g.nameEn == name,
      orElse: () => Governorate(id: '', nameAr: '', nameEn: ''),
    );
    return gov.id;
  }

  String mapIdToNameAr(String id, String locale) {
    final gov = governoratesList.firstWhere(
          (g) => g.id == id,
      orElse: () => Governorate(id: '', nameAr: '', nameEn: ''),
    );
    return  locale == 'ar' ?  gov.nameAr : gov.nameEn;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/login'),
        ),
        title: const Text('تسجيل حساب جديد'),
      ),
      body: BlocConsumer<AuthBloc, AuthState>(
        listener: (context, state) {
          state.when(
            initial: () {},
            loading: () {},
            authenticated: (user, token) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content:
                      Text('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول'),
                  backgroundColor: Colors.green,
                ),
              );
              context.go('/login');
            },
            unauthenticated: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content:
                      Text('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول'),
                  backgroundColor: Colors.green,
                ),
              );
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
          return SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24.0),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Header
                    Text(
                      l10n.registerTitle,
                      style:
                          Theme.of(context).textTheme.headlineMedium?.copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                      textAlign: TextAlign.center,
                    ).animate().fadeIn().slideY(begin: -0.3, end: 0),

                    const SizedBox(height: 8),

                    Text(
                      l10n.registerHeader,
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                            color: Theme.of(context)
                                .colorScheme
                                .onSurface
                                .withValues(alpha: 0.7),
                          ),
                      textAlign: TextAlign.center,
                    )
                        .animate()
                        .fadeIn(delay: 200.ms)
                        .slideY(begin: -0.3, end: 0),

                    const SizedBox(height: 32),

                    // Name Field
                    TextFormField(
                      controller: _nameController,
                      decoration: InputDecoration(
                        labelText: l10n.nameField,
                        prefixIcon: const Icon(Icons.person_outlined),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return l10n.nameErrorEmpty;
                        }
                        if (value.length < 2) {
                          return l10n.nameErrorShort;
                        }
                        return null;
                      },
                    )
                        .animate()
                        .fadeIn(delay: 400.ms)
                        .slideX(begin: -0.3, end: 0),

                    const SizedBox(height: 16),

                    // Email Field
                    TextFormField(
                      controller: _emailController,
                      keyboardType: TextInputType.emailAddress,
                      decoration: InputDecoration(
                        labelText: l10n.emailField,
                        prefixIcon: const Icon(Icons.email_outlined),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return l10n.emailErrorEmpty;
                        }
                        if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value)) {
                          return l10n.emailErrorInvalid;
                        }
                        return null;
                      },
                    )
                        .animate()
                        .fadeIn(delay: 600.ms)
                        .slideX(begin: -0.3, end: 0),

                    const SizedBox(height: 16),

                    // Password Field
                    TextFormField(
                      controller: _passwordController,
                      obscureText: _obscurePassword,
                      decoration: InputDecoration(
                        labelText: l10n.passwordField,
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
                          return l10n.passwordErrorEmpty;
                        }
                        if (value.length < 6) {
                          return l10n.passwordErrorShort;
                        }
                        return null;
                      },
                    )
                        .animate()
                        .fadeIn(delay: 800.ms)
                        .slideX(begin: -0.3, end: 0),

                    const SizedBox(height: 16),

                    // Confirm Password Field
                    TextFormField(
                      controller: _confirmPasswordController,
                      obscureText: _obscureConfirmPassword,
                      decoration: InputDecoration(
                        labelText: l10n.confirmPasswordField,
                        prefixIcon: const Icon(Icons.lock_outlined),
                        suffixIcon: IconButton(
                          icon: Icon(
                            _obscureConfirmPassword
                                ? Icons.visibility
                                : Icons.visibility_off,
                          ),
                          onPressed: () {
                            setState(() {
                              _obscureConfirmPassword =
                                  !_obscureConfirmPassword;
                            });
                          },
                        ),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return l10n.confirmPasswordErrorEmpty;
                        }
                        if (value != _passwordController.text) {
                          return l10n.confirmPasswordErrorMismatch;
                        }
                        return null;
                      },
                    )
                        .animate()
                        .fadeIn(delay: 1000.ms)
                        .slideX(begin: -0.3, end: 0),

                    const SizedBox(height: 16),

                    // Phone Field
                    TextFormField(
                      controller: _phoneController,
                      keyboardType: TextInputType.phone,
                      textDirection: TextDirection.ltr,
                      decoration: InputDecoration(
                        labelText: l10n.phoneField,
                        prefixIcon: const Icon(Icons.phone_outlined),
                      ),
                      validator: (value) {
                        if (value != null && value.isNotEmpty) {
                          if (!RegExp(r'^01[0125][0-9]{8}$').hasMatch(value)) {
                            return l10n.phoneErrorInvalid;
                          }
                        }
                        return null;
                      },
                    )
                        .animate()
                        .fadeIn(delay: 1200.ms)
                        .slideX(begin: -0.3, end: 0),

                    const SizedBox(height: 16),

                    // Role Selection
                    DropdownButtonFormField<String>(
                      initialValue: _selectedRole,
                      decoration: InputDecoration(
                        labelText: l10n.roleField,
                        prefixIcon: const Icon(Icons.group_outlined),
                      ),
                      items: _roles.map((role) {
                        return DropdownMenuItem(
                          value: role,
                          child: Text(role == 'student'
                              ? l10n.studentRole
                              : l10n.volunteerRole,),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setState(() {
                          _selectedRole = value!;
                        });
                      },
                    )
                        .animate()
                        .fadeIn(delay: 1400.ms)
                        .slideX(begin: -0.3, end: 0),

                    const SizedBox(height: 16),

                    // Governorate Selection
                    DropdownButtonFormField<String>(
                      initialValue: _selectedGovernorate,
                      decoration: InputDecoration(
                        labelText: l10n.governorateField,
                        prefixIcon: const Icon(Icons.location_on_outlined),
                      ),
                      items: governoratesList.map((gov) {
                        return DropdownMenuItem(
                          value: gov.id,
                          child: Text(
                            AppLocalizations.of(context)!.localeName == 'ar'
                                ? gov.nameAr
                                : gov.nameEn,
                          ),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setState(() {
                          _selectedGovernorate = value;
                        });
                      },
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return l10n.governorateErrorEmpty;
                        }
                        return null;
                      },
                    )
                        .animate()
                        .fadeIn(delay: 1600.ms)
                        .slideX(begin: -0.3, end: 0),

                    const SizedBox(height: 32),

                    //University Field
                    TextFormField(
                      controller: _universityController,
                      keyboardType: TextInputType.streetAddress,
                      decoration: InputDecoration(
                        labelText: l10n.universityField,
                        prefixIcon: const Icon(Icons.school_outlined),
                      ),
                      validator: (value) {
                        if (value != null && value.isNotEmpty) {
                          if (value.isEmpty) {
                            return l10n.universityErrorEmpty;
                          }
                        }
                        return null;
                      },
                    )
                        .animate()
                        .fadeIn(delay: 1800.ms)
                        .slideX(begin: -0.3, end: 0),
                    const SizedBox(height: 32),

                    //National ID Field
                    TextFormField(
                      controller: _nationalIdController,
                      keyboardType: TextInputType.number,
                      maxLines: 1,
                      maxLength: 14,
                      decoration: InputDecoration(
                        labelText: l10n.nationalIdField,
                        prefixIcon: const Icon(Icons.badge_outlined),
                      ),
                      validator: (value) {
                        if (value != null && value.isNotEmpty) {
                          if (!RegExp(r'^[0-9]{14}$').hasMatch(value)) {
                            return l10n.nationalIdErrorInvalid;
                          } else if (value.length != 14) {
                            return l10n.nationalIdErrorLength;
                          } else if (!value.startsWith('2') &&
                              !value.startsWith('3')) {
                            return l10n.nationalIdErrorStart;
                          }
                        }
                        return null;
                      },
                    )
                        .animate()
                        .fadeIn(delay: 2000.ms)
                        .slideX(begin: -0.3, end: 0),
                    const SizedBox(
                      height: 32,
                    ),
/*                    // Membership number field
                    TextFormField(
                      controller: _membershipNumberController,
                      keyboardType: TextInputType.text,
                      decoration:  InputDecoration(
                        labelText: l10n.membershipNumberField,
                        prefixIcon: const Icon(Icons.confirmation_number_outlined),
                      ),
                      validator: (value) {
                        // Membership number is optional, so no validation needed
                        return null;
                      },
                    )
                        .animate()
                        .fadeIn(delay: 2200.ms)
                        .slideX(begin: -0.3, end: 0),

                    const SizedBox(height: 32),*/
                    // Register Button
                    ElevatedButton(
                      onPressed: state.maybeWhen(
                        loading: () => null,
                        orElse: () => _handleRegister,
                      ),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        backgroundColor: Theme.of(context).colorScheme.primary,
                        foregroundColor:
                            Theme.of(context).colorScheme.onPrimary,
                      ),
                      child: state.maybeWhen(
                        loading: () => const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        ),
                        orElse: () =>  Text(
                          l10n.registerButton,
                          style: const TextStyle(
                              fontSize: 16, fontWeight: FontWeight.w600,),
                        ),
                      ),
                    )
                        .animate()
                        .fadeIn(delay: 2400.ms)
                        .slideY(begin: 0.3, end: 0),

                    const SizedBox(height: 24),

                    // Login Link
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                    l10n.alreadyHaveAccount,
                          style: Theme.of(context).textTheme.bodyMedium,
                        ),
                        TextButton(
                          onPressed: () => context.go('/login'),
                          child: Text(
                            l10n.loginButton,
                            style: TextStyle(
                              color: Theme.of(context).colorScheme.primary,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ).animate().fadeIn(delay: 2800.ms),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  void _handleRegister() {
    if (_formKey.currentState?.validate() ?? false) {
      context.read<AuthBloc>().add(
            AuthEvent.registerRequested(
              email: _emailController.text.trim(),
              password: _passwordController.text,
              name: _nameController.text.trim(),
              governorate: mapIdToNameAr(_selectedGovernorate!, AppLocalizations.of(context)!.localeName),
              phone: _phoneController.text.trim(),
              university: _universityController.text,
              nationalId: _nationalIdController.text,
              membershipNumber: '',
              // position: _selectedRole,
            ),
          );
    }
  }
}
