import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:toastification/toastification.dart';

import '../../../../../gen_l10n/app_localizations.dart';
import '../../../../timeline/presentation/cubits/timeline_cubit.dart';
import '../../../../../shared/widgets/main_navigation.dart';

class CreateTimelinePage extends StatefulWidget {
  const CreateTimelinePage({super.key});

  @override
  State<CreateTimelinePage> createState() => _CreateTimelinePageState();
}

class _CreateTimelinePageState extends State<CreateTimelinePage> {
  final _formKey = GlobalKey<FormState>();
  final _yearController = TextEditingController();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _achievementController = TextEditingController();
  final _orderController = TextEditingController(text: '1');

  bool _isSubmitting = false;

  @override
  void dispose() {
    _yearController.dispose();
    _titleController.dispose();
    _descriptionController.dispose();
    _achievementController.dispose();
    _orderController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('إضافة حدث خط الزمن'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Colors.white,
      ),
      body: BlocListener<TimelineCubit, TimelineState>(
        listener: (context, state) {
          if (state is TimelineLoaded) {}
          else if (state is TimelineError) {
            setState(() => _isSubmitting = false);
            GetIt.instance<ShowToast>().showToast(
              context: context,
              message: 'فشل في إضافة الحدث: ${state.message}',
              type: ToastificationType.error,
            );
          }
          else if(state is TimelineCreated){
            setState(() => _isSubmitting = false);
            GetIt.instance<ShowToast>().showToast(
              context: context,
              message: 'تم إضافة الحدث بنجاح',
              type: ToastificationType.success,
            );
            // context.read<TimelineCubit>().getTimeline();
            Navigator.of(context).pop();
          }
        },
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Form(
            key: _formKey,
            child: Column(
              children: [
                Expanded(
                  child: SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Year field
                        TextFormField(
                          controller: _yearController,
                          decoration: InputDecoration(
                            labelText: 'السنة',
                            hintText: '2024',
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            filled: true,
                            fillColor: Theme.of(context).colorScheme.surface,
                            prefixIcon: const Icon(Icons.calendar_today),
                          ),
                          keyboardType: TextInputType.number,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'السنة مطلوبة';
                            }
                            if (value.length != 4) {
                              return 'السنة يجب أن تكون 4 أرقام';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),

                        // Title field
                        TextFormField(
                          controller: _titleController,
                          decoration: InputDecoration(
                            labelText: 'العنوان',
                            hintText: 'مثال: تأسيس الاتحاد',
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            filled: true,
                            fillColor: Theme.of(context).colorScheme.surface,
                            prefixIcon: const Icon(Icons.title),
                          ),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'العنوان مطلوب';
                            }
                            if (value.length < 3) {
                              return 'العنوان يجب أن يكون 3 أحرف على الأقل';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),

                        // Description field
                        TextFormField(
                          controller: _descriptionController,
                          decoration: InputDecoration(
                            labelText: 'الوصف',
                            hintText: 'صف ما حدث في هذه السنة...',
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            filled: true,
                            fillColor: Theme.of(context).colorScheme.surface,
                            prefixIcon: const Icon(Icons.description),
                            alignLabelWithHint: true,
                          ),
                          maxLines: 4,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'الوصف مطلوب';
                            }
                            if (value.length < 10) {
                              return 'الوصف يجب أن يكون 10 أحرف على الأقل';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),

                        // Achievement field
                        TextFormField(
                          controller: _achievementController,
                          decoration: InputDecoration(
                            labelText: 'الإنجازات',
                            hintText: 'إنجاز 1\nإنجاز 2\nإنجاز 3',
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            filled: true,
                            fillColor: Theme.of(context).colorScheme.surface,
                            prefixIcon: const Icon(Icons.emoji_events),
                            alignLabelWithHint: true,
                            helperText: 'اكتب كل إنجاز في سطر جديد',
                          ),
                          maxLines: 5,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'الإنجازات مطلوبة';
                            }
                            if (value.length < 10) {
                              return 'الإنجازات يجب أن تكون 10 أحرف على الأقل';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),

                        // Order field
                        TextFormField(
                          controller: _orderController,
                          decoration: InputDecoration(
                            labelText: 'الترتيب',
                            hintText: '1',
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            filled: true,
                            fillColor: Theme.of(context).colorScheme.surface,
                            prefixIcon: const Icon(Icons.format_list_numbered),
                          ),
                          keyboardType: TextInputType.number,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'الترتيب مطلوب';
                            }
                            final order = int.tryParse(value);
                            if (order == null || order < 1) {
                              return 'الترتيب يجب أن يكون رقم أكبر من 0';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 24),
                      ],
                    ),
                  ),
                ),

                // Submit button
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    onPressed: _isSubmitting ? null : _handleSubmit,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).colorScheme.primary,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: _isSubmitting
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Colors.white,
                            ),
                          )
                        : const Text(
                            'إضافة الحدث',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _handleSubmit() {
    if (_formKey.currentState!.validate()) {
      setState(() => _isSubmitting = true);
      
      setState(() => _isSubmitting = false);

      context.read<TimelineCubit>().createTimelineEntry(
        {
          'year': _yearController.text.trim(),
          'title': _titleController.text.trim(),
          'description': _descriptionController.text.trim(),
          'achievement': _achievementController.text,
          'order': int.parse(_orderController.text.trim()),
        },
      );
    }
  }
}
