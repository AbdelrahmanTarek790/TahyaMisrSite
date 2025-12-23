import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
import 'package:toastification/toastification.dart';

import '../../../../../gen_l10n/app_localizations.dart';
import '../../cubits/achievements_cubit.dart';
import '../../cubits/achievements_state.dart';

class CreateAchievementPage extends StatefulWidget {
  const CreateAchievementPage({super.key});

  @override
  State<CreateAchievementPage> createState() => _CreateAchievementPageState();
}

class _CreateAchievementPageState extends State<CreateAchievementPage> {
  final _formKey = GlobalKey<FormState>();
  final titleController = TextEditingController();
  final descriptionController = TextEditingController();
  final colorController = TextEditingController(text: 'text-egypt-gold');
  final iconController = TextEditingController(text: 'Award');
  final orderController = TextEditingController(text: '0');
  final highlightController = TextEditingController();
  List<String> highlights = [];
  bool isActive = true;
  XFile? _pickedImage;

  @override
  void dispose() {
    titleController.dispose();
    descriptionController.dispose();
    colorController.dispose();
    iconController.dispose();
    orderController.dispose();
    highlightController.dispose();
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
      });
    }
  }

  void _addHighlight() {
    if (highlightController.text.trim().isNotEmpty) {
      setState(() {
        highlights.add(highlightController.text.trim());
        highlightController.clear();
      });
    }
  }

  void _removeHighlight(int index) {
    setState(() {
      highlights.removeAt(index);
    });
  }

  Future<void> _createAchievement() async {
    if (_formKey.currentState!.validate()) {
      final cubit = context.read<AchievementsCubit>();

      File? imageFile;
      if (_pickedImage != null) {
        imageFile = File(_pickedImage!.path);
      }

      final success = await cubit.createAchievement(
        title: titleController.text.trim(),
        description: descriptionController.text.trim(),
        highlights: highlights.isEmpty ? null : highlights,
        imageFile: imageFile,
        color: colorController.text.trim().isEmpty
            ? null
            : colorController.text.trim(),
        icon: iconController.text.trim().isEmpty
            ? null
            : iconController.text.trim(),
        order: int.tryParse(orderController.text.trim()) ?? 0,
        isActive: isActive,
      );

      if (success && mounted) {
        toastification.show(
          context: context,
          type: ToastificationType.success,
          style: ToastificationStyle.fillColored,
          title: const Text('تم إنشاء الإنجاز بنجاح'),
          autoCloseDuration: const Duration(seconds: 3),
        );
        Navigator.of(context).pop();
        cubit.refreshAchievements();
      } else if (mounted) {
        toastification.show(
          context: context,
          type: ToastificationType.error,
          style: ToastificationStyle.fillColored,
          title: const Text('فشل إنشاء الإنجاز'),
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
        title: const Text('إنشاء إنجاز جديد'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Colors.white,
      ),
      body: BlocConsumer<AchievementsCubit, AchievementsState>(
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

                        // Description field
                        TextFormField(
                          controller: descriptionController,
                          decoration: InputDecoration(
                            labelText: 'الوصف',
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            filled: true,
                            fillColor: Theme.of(context).colorScheme.surface,
                          ),
                          maxLines: 3,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'الوصف مطلوب';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),

                        // Highlights section
                        Text(
                          'النقاط البارزة',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Expanded(
                              child: TextFormField(
                                controller: highlightController,
                                decoration: InputDecoration(
                                  hintText: 'أضف نقطة بارزة',
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  filled: true,
                                  fillColor:
                                      Theme.of(context).colorScheme.surface,
                                ),
                                onFieldSubmitted: (_) => _addHighlight(),
                              ),
                            ),
                            const SizedBox(width: 8),
                            IconButton(
                              onPressed: _addHighlight,
                              icon: const Icon(Icons.add_circle),
                              color: Theme.of(context).colorScheme.primary,
                            ),
                          ],
                        ),
                        if (highlights.isNotEmpty) ...[
                          const SizedBox(height: 8),
                          ...highlights.asMap().entries.map((entry) {
                            return Padding(
                              padding: const EdgeInsets.only(bottom: 8),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: Container(
                                      padding: const EdgeInsets.all(12),
                                      decoration: BoxDecoration(
                                        color: Colors.grey[200],
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Text(entry.value),
                                    ),
                                  ),
                                  IconButton(
                                    onPressed: () =>
                                        _removeHighlight(entry.key),
                                    icon: const Icon(Icons.delete),
                                    color: Colors.red,
                                  ),
                                ],
                              ),
                            );
                          }).toList(),
                        ],
                        const SizedBox(height: 16),

                        // Color field
                        TextFormField(
                          controller: colorController,
                          decoration: InputDecoration(
                            labelText: 'اللون (CSS Class)',
                            hintText: 'text-egypt-gold',
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            filled: true,
                            fillColor: Theme.of(context).colorScheme.surface,
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Icon field
                        TextFormField(
                          controller: iconController,
                          decoration: InputDecoration(
                            labelText: 'الأيقونة',
                            hintText: 'Award',
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
                          subtitle:
                              const Text('هل الإنجاز نشط ومرئي للمستخدمين؟'),
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
                          'صورة الإنجاز',
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
                        if (_pickedImage != null) ...[
                          const SizedBox(height: 8),
                          TextButton.icon(
                            onPressed: () {
                              setState(() {
                                _pickedImage = null;
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
                      orElse: () => _createAchievement,
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
                        'إنشاء الإنجاز',
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
