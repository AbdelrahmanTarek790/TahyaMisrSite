import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:get_it/get_it.dart';

import '../../../auth/presentation/bloc/auth_bloc.dart';
import '../../../auth/presentation/bloc/auth_state.dart';
import '../../../auth/presentation/bloc/auth_event.dart';
import '../../../auth/domain/entities/user.dart';

class EditProfilePage extends StatefulWidget {
  final User user;

  const EditProfilePage({super.key, required this.user});

  @override
  State<EditProfilePage> createState() => _EditProfilePageState();
}

class _EditProfilePageState extends State<EditProfilePage> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _nameController;
  late final TextEditingController _emailController;
  late final TextEditingController _phoneController;
  late final TextEditingController _governorateController;
  late final TextEditingController _universityController;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.user.name);
    _emailController = TextEditingController(text: widget.user.email);
    _phoneController = TextEditingController(text: widget.user.phone ?? '');
    _governorateController = TextEditingController(text: widget.user.governorate ?? '');
    _universityController = TextEditingController(text: widget.user.university ?? '');
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _governorateController.dispose();
    _universityController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('تعديل الملف الشخصي'),
        backgroundColor: Theme.of(context).colorScheme.surface,
        foregroundColor: Theme.of(context).colorScheme.onSurface,
        elevation: 0,
        actions: [
          TextButton(
            onPressed: _isLoading ? null : _saveProfile,
            child: Text(
              'حفظ',
              style: TextStyle(
                color: Theme.of(context).colorScheme.primary,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
      body: BlocProvider(
        create: (context) => GetIt.instance<AuthBloc>(),
        child: BlocListener<AuthBloc, AuthState>(
          listener: (context, state) {
            state.when(
              initial: () {},
              loading: () {
                setState(() {
                  _isLoading = true;
                });
              },
              authenticated: (user, token) {
                setState(() {
                  _isLoading = false;
                });
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: const Text('تم تحديث الملف الشخصي بنجاح'),
                    backgroundColor: Theme.of(context).colorScheme.primary,
                  ),
                );
                context.pop();
              },
              unauthenticated: () {
                setState(() {
                  _isLoading = false;
                });
                context.go('/login');
              },
              error: (message) {
                setState(() {
                  _isLoading = false;
                });
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(message),
                    backgroundColor: Theme.of(context).colorScheme.error,
                  ),
                );
              },
            );
          },
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Profile Avatar
                  Center(
                    child: Stack(
                      children: [
                        CircleAvatar(
                          radius: 60,
                          backgroundColor: Theme.of(context).colorScheme.primary.withOpacity(0.1),
                          child: Icon(
                            Icons.person,
                            size: 60,
                            color: Theme.of(context).colorScheme.primary,
                          ),
                        ).animate().scale(duration: 600.ms),
                        Positioned(
                          bottom: 0,
                          right: 0,
                          child: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: Theme.of(context).colorScheme.primary,
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: Theme.of(context).colorScheme.surface,
                                width: 2,
                              ),
                            ),
                            child: Icon(
                              Icons.camera_alt,
                              size: 20,
                              color: Theme.of(context).colorScheme.onPrimary,
                            ),
                          ),
                        ).animate().fadeIn(delay: 400.ms).scale(delay: 400.ms),
                      ],
                    ),
                  ),

                  const SizedBox(height: 32),

                  // Name Field
                  _buildTextField(
                    controller: _nameController,
                    label: 'الاسم',
                    icon: Icons.person_outline,
                    validator: (value) {
                      if (value == null || value.trim().isEmpty) {
                        return 'يرجى إدخال الاسم';
                      }
                      return null;
                    },
                  ).animate().fadeIn(delay: 200.ms).slideX(begin: -0.3, end: 0),

                  const SizedBox(height: 16),

                  // Email Field
                  _buildTextField(
                    controller: _emailController,
                    label: 'البريد الإلكتروني',
                    icon: Icons.email_outlined,
                    keyboardType: TextInputType.emailAddress,
                    validator: (value) {
                      if (value == null || value.trim().isEmpty) {
                        return 'يرجى إدخال البريد الإلكتروني';
                      }
                      if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value)) {
                        return 'يرجى إدخال بريد إلكتروني صحيح';
                      }
                      return null;
                    },
                  ).animate().fadeIn(delay: 400.ms).slideX(begin: -0.3, end: 0),

                  const SizedBox(height: 16),

                  // University Field
                  _buildTextField(
                    controller: _universityController,
                    label: 'الجامعة',
                    icon: Icons.school_outlined,
                    validator: (value) => null, // Optional field
                  ).animate().fadeIn(delay: 600.ms).slideX(begin: -0.3, end: 0),

                  const SizedBox(height: 16),

                  // Phone Field
                  _buildTextField(
                    controller: _phoneController,
                    label: 'رقم الهاتف',
                    icon: Icons.phone_outlined,
                    keyboardType: TextInputType.phone,
                    validator: (value) {
                      if (value != null && value.isNotEmpty) {
                        if (!RegExp(r'^01[0-9]{9}$').hasMatch(value)) {
                          return 'يرجى إدخال رقم هاتف صحيح';
                        }
                      }
                      return null;
                    },
                  ).animate().fadeIn(delay: 800.ms).slideX(begin: -0.3, end: 0),

                  const SizedBox(height: 16),

                  // Governorate Field
                  _buildTextField(
                    controller: _governorateController,
                    label: 'المحافظة',
                    icon: Icons.location_on_outlined,
                    validator: (value) => null, // Optional field
                  ).animate().fadeIn(delay: 1000.ms).slideX(begin: -0.3, end: 0),

                  const SizedBox(height: 32),

                  // Role Display (Read-only)
                  Card(
                    child: ListTile(
                      leading: Icon(
                        Icons.admin_panel_settings_outlined,
                        color: Theme.of(context).colorScheme.primary,
                      ),
                      title: const Text('الدور'),
                      subtitle: Text(
                        widget.user.role == 'admin' 
                            ? 'مدير' 
                            : widget.user.role == 'volunteer' 
                                ? 'متطوع' 
                                : 'طالب',
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      trailing: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          'غير قابل للتعديل',
                          style: TextStyle(
                            color: Theme.of(context).colorScheme.primary,
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ),
                  ).animate().fadeIn(delay: 1000.ms).slideY(begin: 0.3, end: 0),

                  const SizedBox(height: 32),

                  // Save Button
                  ElevatedButton(
                    onPressed: _isLoading ? null : _saveProfile,
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: _isLoading
                        ? const SizedBox(
                            height: 20,
                            width: 20,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Text(
                            'حفظ التغييرات',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                  ).animate().fadeIn(delay: 1200.ms).slideY(begin: 0.3, end: 0),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    String? Function(String?)? validator,
    TextInputType? keyboardType,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      validator: validator,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: Theme.of(context).colorScheme.outline.withOpacity(0.5),
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: Theme.of(context).colorScheme.primary,
            width: 2,
          ),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: Theme.of(context).colorScheme.error,
          ),
        ),
        filled: true,
        fillColor: Theme.of(context).colorScheme.surface.withOpacity(0.5),
      ),
    );
  }

  void _saveProfile() {
    if (_formKey.currentState!.validate()) {
      final data = <String, dynamic>{
        'name': _nameController.text.trim(),
        'email': _emailController.text.trim(),
      };

      if (_phoneController.text.trim().isNotEmpty) {
        data['phone'] = _phoneController.text.trim();
      }

      if (_governorateController.text.trim().isNotEmpty) {
        data['governorate'] = _governorateController.text.trim();
      }

      if (_universityController.text.trim().isNotEmpty) {
        data['university'] = _universityController.text.trim();
      }

      context.read<AuthBloc>().add(AuthEvent.updateProfile(data: data));
    }
  }
}