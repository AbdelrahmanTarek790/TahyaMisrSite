import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';

import '../../../../gen_l10n/app_localizations.dart';
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
  String? _selectedGovernorate;
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
  late final TextEditingController _universityController;
  late final TextEditingController _nationalIdController;
  // late final TextEditingController _membershipNumberController ;
  bool _isLoading = false;

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
  void initState() {
    super.initState();

   final nameToId =  mapNameToId(widget.user.governorate ?? '');
    _nameController = TextEditingController(text: widget.user.name);
    _emailController = TextEditingController(text: widget.user.email);
    _phoneController = TextEditingController(text: widget.user.phone ?? '');
    _selectedGovernorate =nameToId;
    _universityController = TextEditingController(text: widget.user.university ?? '');
    _nationalIdController = TextEditingController(text: widget.user.nationalId ?? '');
    // _membershipNumberController = TextEditingController(text: widget.user.membershipNumber ?? '');
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _universityController.dispose();
    _nationalIdController.dispose();
    // _membershipNumberController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.editProfile),
        backgroundColor: Theme.of(context).colorScheme.surface,
        foregroundColor: Theme.of(context).colorScheme.onSurface,
        elevation: 0,
        actions: [
          TextButton(
            onPressed: _isLoading ? null : _saveProfile,
            child: Text(
              l10n.save,
              style: TextStyle(
                color: Theme.of(context).colorScheme.primary,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
      body: BlocListener<AuthBloc, AuthState>(
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
                        backgroundColor: Theme.of(context).colorScheme.primary.withValues(alpha: 0.1),
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
                  label: l10n.name,
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
                  label: l10n.email,
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
                  label: l10n.university,
                  icon: Icons.school_outlined,
                  validator: (value) => null, // Optional field
                ).animate().fadeIn(delay: 600.ms).slideX(begin: -0.3, end: 0),

                const SizedBox(height: 16),

                // Phone Field
                _buildTextField(
                  controller: _phoneController,
                  label:l10n.phone,
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
                DropdownButtonFormField<String>(
                  initialValue: _selectedGovernorate,
                  decoration: const InputDecoration(
                    labelText: 'المحافظة',
                    prefixIcon: Icon(Icons.location_on_outlined),
                  ),
                  items: governoratesList.map((gov) {
                    return DropdownMenuItem<String>(
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
                      print(value);
                      _selectedGovernorate = value;

                    });
                  },
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'يرجى اختيار المحافظة';
                    }
                    return null;
                  },
                ).animate().fadeIn(delay: 1000.ms).slideX(begin: -0.3, end: 0),

                const SizedBox(height: 32),

                //National ID Field
                _buildTextField(
                  controller: _nationalIdController,
                  label: l10n.nationalId,
                  icon: Icons.badge_outlined,
                  validator: (value) {
                    if (value != null && value.isNotEmpty) {
                      if (!RegExp(r'^[0-9]{14}$').hasMatch(value)) {
                        return 'يرجى إدخال رقم قومي صحيح';
                      }else if(value.length != 14){
                        return 'الرقم القومي يجب أن يكون 14 رقمًا';
                      }
                    }
                    return null;
                  },
                ).animate().fadeIn(delay: 1000.ms).slideX(begin: -0.3, end: 0),

                const SizedBox(height: 32),
/*
                // Membership Number Field
                _buildTextField(
                  controller: _membershipNumberController,
                  label:l10n.membershipNumber,
                  icon: Icons.confirmation_number_outlined,
                  validator: (value) => null, // Optional field
                ).animate().fadeIn(delay: 1000.ms).slideX(begin: -0.3, end: 0),

                const SizedBox(height: 32),*/


                // Role Display (Read-only)
                Card(
                  child: ListTile(
                    leading: Icon(
                      Icons.admin_panel_settings_outlined,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                    title:  Text(l10n.role),
                    subtitle: Text(
                      widget.user.role == 'admin'
                          ? l10n.admin
                          : widget.user.role == 'volunteer'
                              ? l10n.volunteer
                              : l10n.student,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    trailing: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: Theme.of(context).colorScheme.primary.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        l10n.notChangeRole,
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
                      :  Text(
                          l10n.saveChanges,
                          style: const TextStyle(
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
            color: Theme.of(context).colorScheme.outline.withValues(alpha: 0.5),
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
        fillColor: Theme.of(context).colorScheme.surface.withValues(alpha: 0.5),
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

      if (_selectedGovernorate!.isNotEmpty) {
        data['governorate'] = mapIdToNameAr(_selectedGovernorate!, AppLocalizations.of(context)!.localeName);
      }

      if (_universityController.text.trim().isNotEmpty) {
        data['university'] = _universityController.text.trim();
      }

      if (_nationalIdController.text.trim().isNotEmpty) {
        data['nationalId'] = _nationalIdController.text.trim();
      }
     /* if (_membershipNumberController.text.trim().isNotEmpty) {
        data['membershipNumber'] = _membershipNumberController.text.trim();
      }*/

      context.read<AuthBloc>().add(AuthEvent.updateProfile(data: data));
    }
  }
}

class Governorate {
  final String id;
  final String nameAr;
  final String nameEn;

  Governorate({required this.id, required this.nameAr, required this.nameEn});
}

