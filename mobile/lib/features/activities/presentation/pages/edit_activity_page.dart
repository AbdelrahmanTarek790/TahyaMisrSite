import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
import 'package:toastification/toastification.dart';

import '../../../../../gen_l10n/app_localizations.dart';
import '../../../data/models/activity_model.dart';
import '../../cubits/activities_cubit.dart';
import '../../cubits/activities_state.dart';

class EditActivityPage extends StatefulWidget {
  final ActivityModel activity;

  const EditActivityPage({
    super.key,
    required this.activity,
  });

  @override
  State<EditActivityPage> createState() => _EditActivityPageState();
}

class _EditActivityPageState extends State<EditActivityPage> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController titleController;
  late TextEditingController colorController;
  late TextEditingController orderController;
  late bool isActive;
  XFile? _pickedImage;
  bool _removeExistingImage = false;

  @override
  void initState() {
    super.initState();
    titleController = TextEditingController(text: widget.activity.title);
    colorController = TextEditingController(text: widget.activity.color);
    orderController = TextEditingController(text: widget.activity.order.toString());
    isActive = widget.activity.isActive;
  }

  @override
  void dispose() {
    titleController.dispose();
    colorController.dispose();
    orderController.dispose();
    super.dispose();
  }

  Future<void> _pickImage() async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(
      source: ImageSource.gallery,
      maxWidth: 1920,
      maxHeight: 1080,
      imageQuality: 85,
    );

    if (image != null) {
      setState(() {
        _pickedImage = image;
        _removeExistingImage = false;
      });
    }
  }

  Future<void> _updateActivity() async {
    if (_formKey.currentState!.validate()) {
      final cubit = context.read<ActivitiesCubit>();

      File? imageFile;
      if (_pickedImage != null) {
        imageFile = File(_pickedImage!.path);
      }

      final success = await cubit.updateActivity(
        id: widget.activity.id,
        title: titleController.text.trim(),
        imageFile: imageFile,
        color: colorController.text.trim().isEmpty
            ? null
            : colorController.text.trim(),
        order: int.tryParse(orderController.text.trim()) ?? 0,
        isActive: isActive,
      );

      if (success && mounted) {
        toastification.show(
          context: context,
          type: ToastificationType.success,
          style: ToastificationStyle.fillColored,
          title: const Text('تم تحديث النشاط بنجاح'),
          autoCloseDuration: const Duration(seconds: 3),
        );
        Navigator.of(context).pop();
        cubit.refreshActivities();
      } else if (mounted) {
        toastification.show(
          context: context,
          type: ToastificationType.error,
          style: ToastificationStyle.fillColored,
          title: const Text('فشل تحديث النشاط'),
          description: const Text('حاول مرة أخرى'),
          autoCloseDuration: const Duration(seconds: 3),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      appBar: AppBar(
        title: const Text('تعديل النشاط'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Colors.white,
      ),
      body: BlocConsumer<ActivitiesCubit, ActivitiesState>(
        listener: (context, state) {
          state.maybeWhen(
            error: (message) {},
            orElse: () {},
          );
        },
        builder: (context, state) => Padding(
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
                        // Title field
                        TextFormField(
                          controller: titleController,
                          decoration: InputDecoration(
                            labelText: 'العنوان',
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            filled: true,
                            fillColor: Theme.of(context).colorScheme.surface,
                          ),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'العنوان مطلوب';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),

                        // Color field
                        TextFormField(
                          controller: colorController,
                          decoration: InputDecoration(
                            labelText: 'اللون (CSS Class)',
                            hintText: 'bg-gradient-to-br from-egypt-red to-egypt-gold',
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            filled: true,
                            fillColor: Theme.of(context).colorScheme.surface,
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Order field
                        TextFormField(
                          controller: orderController,
                          decoration: InputDecoration(
                            labelText: 'الترتيب',
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            filled: true,
                            fillColor: Theme.of(context).colorScheme.surface,
                          ),
                          keyboardType: TextInputType.number,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'الترتيب مطلوب';
                            }
                            if (int.tryParse(value) == null) {
                              return 'يجب أن يكون الترتيب رقماً';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),

                        // Active Status Switch
                        SwitchListTile(
                          title: const Text('نشط'),
                          subtitle: const Text('هل النشاط نشط ومرئي للمستخدمين؟'),
                          value: isActive,
                          onChanged: (value) {
                            setState(() {
                              isActive = value;
                            });
                          },
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                            side: BorderSide(
                              color: Colors.grey[300]!,
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Image picker
                        Text(
                          'صورة النشاط',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        const SizedBox(height: 8),
                        InkWell(
                          onTap: _pickImage,
                          borderRadius: BorderRadius.circular(12),
                          child: Container(
                            height: 200,
                            width: double.infinity,
                            decoration: BoxDecoration(
                              color: Colors.grey[200],
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: Colors.grey[300]!),
                            ),
                            child: _pickedImage != null
                                ? ClipRRect(
                                    borderRadius: BorderRadius.circular(12),
                                    child: Image.file(
                                      File(_pickedImage!.path),
                                      fit: BoxFit.cover,
                                    ),
                                  )
                                : widget.activity.image != null && !_removeExistingImage
                                    ? ClipRRect(
                                        borderRadius: BorderRadius.circular(12),
                                        child: Image.network(
                                          widget.activity.image!,
                                          fit: BoxFit.cover,
                                          errorBuilder: (context, error, stackTrace) {
                                            return Column(
                                              mainAxisAlignment: MainAxisAlignment.center,
                                              children: [
                                                Icon(
                                                  Icons.broken_image,
                                                  size: 64,
                                                  color: Colors.grey[400],
                                                ),
                                                const SizedBox(height: 8),
                                                Text(
                                                  'فشل تحميل الصورة',
                                                  style: TextStyle(
                                                    color: Colors.grey[600],
                                                    fontSize: 16,
                                                  ),
                                                ),
                                              ],
                                            );
                                          },
                                        ),
                                      )
                                    : Column(
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        children: [
                                          Icon(
                                            Icons.add_photo_alternate,
                                            size: 64,
                                            color: Colors.grey[400],
                                          ),
                                          const SizedBox(height: 8),
                                          Text(
                                            'اضغط لإضافة صورة',
                                            style: TextStyle(
                                              color: Colors.grey[600],
                                              fontSize: 16,
                                            ),
                                          ),
                                        ],
                                      ),
                          ),
                        ),
                        if (_pickedImage != null || (widget.activity.image != null && !_removeExistingImage)) ...[
                          const SizedBox(height: 8),
                          TextButton.icon(
                            onPressed: () {
                              setState(() {
                                _pickedImage = null;
                                _removeExistingImage = true;
                              });
                            },
                            icon: const Icon(Icons.delete),
                            label: const Text('إزالة الصورة'),
                            style: TextButton.styleFrom(
                              foregroundColor: Colors.red,
                            ),
                          ),
                        ],
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
                    onPressed: state.maybeWhen(
                      loading: () => null,
                      orElse: () => _updateActivity,
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).colorScheme.primary,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: state.maybeWhen(
                      loading: () => const SizedBox(
                        height: 24,
                        width: 24,
                        child: CircularProgressIndicator(
                          color: Colors.white,
                          strokeWidth: 2,
                        ),
                      ),
                      orElse: () => const Text(
                        'حفظ التغييرات',
                        style: TextStyle(fontSize: 16),
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
}
