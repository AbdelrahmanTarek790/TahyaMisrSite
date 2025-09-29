import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:toastification/toastification.dart';

import '../../../../core/dependency_injection/injection.dart';
import '../../../../shared/widgets/custom_text_field.dart';
import '../../../../shared/widgets/custom_button.dart';
import '../../../../shared/widgets/loading_overlay.dart';
import '../../data/models/join_request_create_request.dart';
import '../cubits/join_request_cubit.dart';
import '../widgets/governorate_dropdown.dart';
import '../widgets/position_dropdown.dart';

class JoinRequestPage extends StatefulWidget {
  const JoinRequestPage({super.key});

  @override
  State<JoinRequestPage> createState() => _JoinRequestPageState();
}

class _JoinRequestPageState extends State<JoinRequestPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _nationalIdController = TextEditingController();
  final _membershipNumberController = TextEditingController();
  final _notesController = TextEditingController();
  
  String _selectedGovernorate = '';
  String _selectedPosition = '';
  String _selectedRole = 'member';

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => getIt<JoinRequestCubit>(),
      child: Scaffold(
        appBar: AppBar(
          title: const Text('طلب الانضمام'),
          backgroundColor: Theme.of(context).primaryColor,
          foregroundColor: Colors.white,
        ),
        body: BlocListener<JoinRequestCubit, JoinRequestState>(
          listener: (context, state) {
            state.when(
              initial: () {},
              loading: () {},
              processing: () {},
              created: (joinRequest) {
                toastification.show(
                  context: context,
                  type: ToastificationType.success,
                  style: ToastificationStyle.flat,
                  title: const Text('تم إرسال الطلب بنجاح'),
                  description: const Text('سيتم مراجعة طلبك والرد عليك قريباً'),
                  alignment: Alignment.topCenter,
                  autoCloseDuration: const Duration(seconds: 4),
                );
                context.pop();
              },
              loaded: (_, __) {},
              detailLoaded: (_) {},
              actionCompleted: (_, __) {},
              deleted: () {},
              error: (message) {
                toastification.show(
                  context: context,
                  type: ToastificationType.error,
                  style: ToastificationStyle.flat,
                  title: const Text('خطأ'),
                  description: Text(message),
                  alignment: Alignment.topCenter,
                  autoCloseDuration: const Duration(seconds: 4),
                );
              },
            );
          },
          child: BlocBuilder<JoinRequestCubit, JoinRequestState>(
            builder: (context, state) {
              return LoadingOverlay(
                isLoading: state.maybeWhen(
                  loading: () => true,
                  processing: () => true,
                  orElse: () => false,
                ),
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Icon(
                                      Icons.person_add,
                                      color: Theme.of(context).primaryColor,
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      'معلومات شخصية',
                                      style: Theme.of(context).textTheme.titleLarge,
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 16),
                                CustomTextField(
                                  controller: _nameController,
                                  label: 'الاسم الكامل',
                                  prefixIcon: Icons.person,
                                  validator: (value) {
                                    if (value == null || value.trim().isEmpty) {
                                      return 'الاسم مطلوب';
                                    }
                                    return null;
                                  },
                                ),
                                const SizedBox(height: 16),
                                CustomTextField(
                                  controller: _emailController,
                                  label: 'البريد الإلكتروني',
                                  prefixIcon: Icons.email,
                                  keyboardType: TextInputType.emailAddress,
                                  validator: (value) {
                                    if (value == null || value.trim().isEmpty) {
                                      return 'البريد الإلكتروني مطلوب';
                                    }
                                    if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value)) {
                                      return 'البريد الإلكتروني غير صحيح';
                                    }
                                    return null;
                                  },
                                ),
                                const SizedBox(height: 16),
                                CustomTextField(
                                  controller: _phoneController,
                                  label: 'رقم الهاتف',
                                  prefixIcon: Icons.phone,
                                  keyboardType: TextInputType.phone,
                                  validator: (value) {
                                    if (value == null || value.trim().isEmpty) {
                                      return 'رقم الهاتف مطلوب';
                                    }
                                    return null;
                                  },
                                ),
                                const SizedBox(height: 16),
                                CustomTextField(
                                  controller: _nationalIdController,
                                  label: 'الرقم القومي',
                                  prefixIcon: Icons.credit_card,
                                  keyboardType: TextInputType.number,
                                  validator: (value) {
                                    if (value == null || value.trim().isEmpty) {
                                      return 'الرقم القومي مطلوب';
                                    }
                                    if (value.length != 14) {
                                      return 'الرقم القومي يجب أن يكون 14 رقم';
                                    }
                                    return null;
                                  },
                                ),
                                const SizedBox(height: 16),
                                GovernorateDropdown(
                                  selectedGovernorate: _selectedGovernorate,
                                  onChanged: (value) {
                                    setState(() {
                                      _selectedGovernorate = value ?? '';
                                    });
                                  },
                                  validator: (value) {
                                    if (value == null || value.isEmpty) {
                                      return 'المحافظة مطلوبة';
                                    }
                                    return null;
                                  },
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 20),
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Icon(
                                      Icons.work,
                                      color: Theme.of(context).primaryColor,
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      'معلومات العضوية',
                                      style: Theme.of(context).textTheme.titleLarge,
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 16),
                                Text(
                                  'نوع العضوية',
                                  style: Theme.of(context).textTheme.titleMedium,
                                ),
                                const SizedBox(height: 8),
                                Column(
                                  children: [
                                    RadioListTile<String>(
                                      title: const Text('عضو'),
                                      subtitle: const Text('عضو في الاتحاد'),
                                      value: 'member',
                                      groupValue: _selectedRole,
                                      onChanged: (value) {
                                        setState(() {
                                          _selectedRole = value!;
                                        });
                                      },
                                    ),
                                    RadioListTile<String>(
                                      title: const Text('متطوع'),
                                      subtitle: const Text('متطوع في أنشطة الاتحاد'),
                                      value: 'volunteer',
                                      groupValue: _selectedRole,
                                      onChanged: (value) {
                                        setState(() {
                                          _selectedRole = value!;
                                        });
                                      },
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 16),
                                PositionDropdown(
                                  selectedPosition: _selectedPosition,
                                  onChanged: (value) {
                                    setState(() {
                                      _selectedPosition = value ?? '';
                                    });
                                  },
                                ),
                                const SizedBox(height: 16),
                                CustomTextField(
                                  controller: _membershipNumberController,
                                  label: 'رقم العضوية (إختياري)',
                                  prefixIcon: Icons.card_membership,
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 20),
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Icon(
                                      Icons.notes,
                                      color: Theme.of(context).primaryColor,
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      'ملاحظات إضافية',
                                      style: Theme.of(context).textTheme.titleLarge,
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 16),
                                CustomTextField(
                                  controller: _notesController,
                                  label: 'ملاحظات (إختياري)',
                                  prefixIcon: Icons.comment,
                                  maxLines: 4,
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 30),
                        CustomButton(
                          onPressed: _submitForm,
                          text: 'إرسال الطلب',
                          icon: Icons.send,
                        ),
                        const SizedBox(height: 20),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      if (_selectedGovernorate.isEmpty) {
        toastification.show(
          context: context,
          type: ToastificationType.warning,
          style: ToastificationStyle.flat,
          title: const Text('تحذير'),
          description: const Text('يرجى اختيار المحافظة'),
          alignment: Alignment.topCenter,
          autoCloseDuration: const Duration(seconds: 3),
        );
        return;
      }

      final request = JoinRequestCreateRequest(
        name: _nameController.text.trim(),
        email: _emailController.text.trim(),
        phone: _phoneController.text.trim(),
        nationalId: _nationalIdController.text.trim(),
        governorate: _selectedGovernorate,
        position: _selectedPosition.isNotEmpty ? _selectedPosition : null,
        membershipNumber: _membershipNumberController.text.trim().isNotEmpty 
            ? _membershipNumberController.text.trim() 
            : null,
        role: _selectedRole,
        notes: _notesController.text.trim().isNotEmpty 
            ? _notesController.text.trim() 
            : null,
      );

      context.read<JoinRequestCubit>().createJoinRequest(request);
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _nationalIdController.dispose();
    _membershipNumberController.dispose();
    _notesController.dispose();
    super.dispose();
  }
}