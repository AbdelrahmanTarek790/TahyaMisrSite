import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:tahya_misr_app/features/auth/data/models/register_request.dart';
import 'package:toastification/toastification.dart';

import '../../../../core/dependency_injection/injection.dart';
import '../../../../gen_l10n/app_localizations.dart';
import '../cubits/user_management_cubit.dart';
import 'edit_user_page.dart';

class CreateUserPage extends StatefulWidget {
  const CreateUserPage({super.key});

  @override
  State<CreateUserPage> createState() => _CreateUserPageState();
}

class _CreateUserPageState extends State<CreateUserPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _phoneController = TextEditingController();
  final _universityController = TextEditingController();
  final _nationalIdController = TextEditingController();
  final _membershipNumberController = TextEditingController();
  String? _selectedGovernorate;
  bool _obscurePassword = true;
  
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

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _phoneController.dispose();
    _universityController.dispose();
    _nationalIdController.dispose();
    _membershipNumberController.dispose();
    super.dispose();
  }

  String mapIdToNameAr(String id, String locale) {
    final gov = governoratesList.firstWhere(
      (g) => g.id == id,
      orElse: () => Governorate(id: '', nameAr: '', nameEn: ''),
    );
    return locale == 'ar' ? gov.nameAr : gov.nameEn;
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final locale = Localizations.localeOf(context).languageCode;

    return BlocListener<UserManagementCubit, UserManagementState>(
      listener: (context, state) {
        if (state is UserCreated) {
          getIt<ShowToast>().showToast(
            message: 'تم إنشاء المستخدم بنجاح',
            context: context,
            type: ToastificationType.success,
          );
          context.pop();
        } else if (state is UserManagementError) {
          getIt<ShowToast>().showToast(
            message: state.message,
            context: context,
            type: ToastificationType.error,
          );
        }
      },
      child: Scaffold(
        appBar: AppBar(
          title: const Text('إنشاء مستخدم جديد'),
          backgroundColor: Theme.of(context).colorScheme.primary,
          foregroundColor: Colors.white,
        ),
        body: BlocBuilder<UserManagementCubit, UserManagementState>(
          builder: (context, state) {
            final isLoading = state is UserManagementLoading;

            return SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Icon Header
                    Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            Theme.of(context).colorScheme.primary,
                            Theme.of(context).colorScheme.primary.withValues(alpha: 0.7),
                          ],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Column(
                        children: [
                          Icon(
                            Icons.person_add,
                            size: 64,
                            color: Colors.white,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'إضافة مستخدم جديد',
                            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                          ),
                        ],
                      ),
                    ).animate().fadeIn().slideY(begin: -0.2),

                    const SizedBox(height: 24),

                    // Name Field
                    TextFormField(
                      controller: _nameController,
                      decoration: InputDecoration(
                        labelText: 'الاسم',
                        prefixIcon: const Icon(Icons.person),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'يرجى إدخال الاسم';
                        }
                        return null;
                      },
                    ).animate(delay: 100.ms).fadeIn().slideX(begin: -0.2),

                    const SizedBox(height: 16),

                    // Email Field
                    TextFormField(
                      controller: _emailController,
                      keyboardType: TextInputType.emailAddress,
                      decoration: InputDecoration(
                        labelText: 'البريد الإلكتروني',
                        prefixIcon: const Icon(Icons.email),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'يرجى إدخال البريد الإلكتروني';
                        }
                        if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value)) {
                          return 'البريد الإلكتروني غير صالح';
                        }
                        return null;
                      },
                    ).animate(delay: 200.ms).fadeIn().slideX(begin: -0.2),

                    const SizedBox(height: 16),

                    // Password Field
                    TextFormField(
                      controller: _passwordController,
                      obscureText: _obscurePassword,
                      decoration: InputDecoration(
                        labelText: 'كلمة المرور',
                        prefixIcon: const Icon(Icons.lock),
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
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
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
                    ).animate(delay: 300.ms).fadeIn().slideX(begin: -0.2),

                    const SizedBox(height: 16),

                    // Phone Field
                    TextFormField(
                      controller: _phoneController,
                      keyboardType: TextInputType.phone,
                      decoration: InputDecoration(
                        labelText: 'رقم الهاتف',
                        prefixIcon: const Icon(Icons.phone),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'يرجى إدخال رقم الهاتف';
                        }
                        return null;
                      },
                    ).animate(delay: 400.ms).fadeIn().slideX(begin: -0.2),

                    const SizedBox(height: 16),

                    // University Field
                    TextFormField(
                      controller: _universityController,
                      decoration: InputDecoration(
                        labelText: 'الجامعة',
                        prefixIcon: const Icon(Icons.school),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'يرجى إدخال الجامعة';
                        }
                        return null;
                      },
                    ).animate(delay: 500.ms).fadeIn().slideX(begin: -0.2),

                    const SizedBox(height: 16),

                    // National ID Field
                    TextFormField(
                      controller: _nationalIdController,
                      keyboardType: TextInputType.number,
                      decoration: InputDecoration(
                        labelText: 'الرقم القومي',
                        prefixIcon: const Icon(Icons.badge),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'يرجى إدخال الرقم القومي';
                        }
                        return null;
                      },
                    ).animate(delay: 600.ms).fadeIn().slideX(begin: -0.2),

                    const SizedBox(height: 16),

                    // Governorate Dropdown
                    DropdownButtonFormField<String>(
                      value: _selectedGovernorate,
                      decoration: InputDecoration(
                        labelText: 'المحافظة',
                        prefixIcon: const Icon(Icons.location_on),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      items: governoratesList.map((gov) {
                        return DropdownMenuItem(
                          value: gov.id,
                          child: Text(mapIdToNameAr(gov.id, locale)),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setState(() {
                          _selectedGovernorate = value;
                        });
                      },
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'يرجى اختيار المحافظة';
                        }
                        return null;
                      },
                    ).animate(delay: 700.ms).fadeIn().slideX(begin: -0.2),

                    const SizedBox(height: 16),

                    // Membership Number Field (Optional)
                    TextFormField(
                      controller: _membershipNumberController,
                      decoration: InputDecoration(
                        labelText: 'رقم العضوية (اختياري)',
                        prefixIcon: const Icon(Icons.card_membership),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ).animate(delay: 800.ms).fadeIn().slideX(begin: -0.2),

                    const SizedBox(height: 32),

                    // Submit Button
                    ElevatedButton(
                      onPressed: isLoading ? null : _handleSubmit,
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        backgroundColor: Theme.of(context).colorScheme.primary,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: isLoading
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                              ),
                            )
                          : const Text(
                              'إنشاء المستخدم',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                    ).animate(delay: 900.ms).fadeIn().slideY(begin: 0.2),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  void _handleSubmit() {
    if (_formKey.currentState?.validate() ?? false) {
      final registerRequest = RegisterRequest(
        name: _nameController.text.trim(),
        email: _emailController.text.trim(),
        password: _passwordController.text,
        phone: _phoneController.text.trim(),
        university: _universityController.text.trim(),
        nationalId: _nationalIdController.text.trim(),
        governorate: _selectedGovernorate!,
        membershipNumber: _membershipNumberController.text.trim(),
      );

      context.read<UserManagementCubit>().createUser(registerRequest.toJson());
    }
  }
}
