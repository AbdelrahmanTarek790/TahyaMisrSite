import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:tahya_misr_app/core/dependency_injection/injection.dart';
import 'package:tahya_misr_app/features/events/presentation/cubits/events_cubit.dart';
import 'package:image_picker/image_picker.dart';
import 'package:tahya_misr_app/shared/widgets/main_navigation.dart';
import 'package:toastification/toastification.dart';

import '../../../../../gen_l10n/app_localizations.dart';

class CreateEventPage extends StatefulWidget {
  const CreateEventPage({super.key});

  @override
  State<CreateEventPage> createState() => _CreateEventPageState();
}

class _CreateEventPageState extends State<CreateEventPage> {

  final _formKey = GlobalKey<FormState>();
  final titleController = TextEditingController();
  final descriptionController = TextEditingController();
  final locationController = TextEditingController();
  final _imageUrlController = TextEditingController();
  DateTime selectedDate = DateTime.now();
  XFile? _pickedImage;

  @override
  void dispose() {
    titleController.dispose();
    descriptionController.dispose();
    locationController.dispose();
    _imageUrlController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.createEvent),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Colors.white,
      ),
      body: BlocConsumer<EventsCubit,EventsState>(
        listener: (context, state) {
          state.maybeWhen(
            error: (message) {},
            orElse: () {},
          );
        },
        builder:(context,state) => Padding(
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
                            labelText: l10n.title,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            filled: true,
                            fillColor: Theme.of(context).colorScheme.surface,
                          ),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return l10n.titleRequired;
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),

                        // Content field
                        TextFormField(
                          controller: descriptionController,
                          decoration: InputDecoration(
                            labelText: l10n.description,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            filled: true,
                            fillColor: Theme.of(context).colorScheme.surface,
                          ),
                          maxLines: 8,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return l10n.contentRequired;
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),

                        // Location field
                        TextFormField(
                          controller: locationController,
                          decoration: InputDecoration(
                            labelText: l10n.location,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            filled: true,
                            fillColor: Theme.of(context).colorScheme.surface,
                          ),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Location is required';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),

                        // Date field
                        TextFormField(
                          readOnly: true,
                          decoration: InputDecoration(
                            labelText: l10n.date,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            filled: true,
                            fillColor: Theme.of(context).colorScheme.surface,
                          ),
                          controller: TextEditingController(text: '${selectedDate.toLocal()}'.split(' ')[0]),
                          onTap: () async {
                            final DateTime? picked = await showDatePicker(
                              context: context,
                              initialDate: selectedDate,
                              firstDate: DateTime(2000),
                              lastDate: DateTime(2101),
                            );
                            if (picked != null && picked != selectedDate) {
                              setState(() {
                                selectedDate = picked;
                              });
                            }
                          },
                        ),

                        // choose image button
                        Center(
                          child: ElevatedButton.icon(
                            onPressed:_pickImage,
                            icon: const Icon(Icons.image),
                            label: Text(_imageUrlController.text.isNotEmpty ? 'change image': 'choose image'),
                          ),
                        ),
                        const SizedBox(height: 16),


                        // Preview image
                        if (_imageUrlController.text.isNotEmpty)
                          Container(
                            width: double.infinity,
                            height: 200,
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: Theme.of(context).dividerColor,
                              ),
                            ),
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(12),
                              child: Image.file(
                                File(_imageUrlController.text),
                                fit: BoxFit.cover,
                                errorBuilder: (context, error, stackTrace) {
                                  return Center(
                                    child: Text(
                                      'image not found',
                                      style: TextStyle(color: Theme.of(context).colorScheme.error),
                                    ),
                                  );
                                },
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                ),

                // Action buttons
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () => context.pop(),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                        ),
                        child: Text(l10n.cancel),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: _createEvent,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Theme.of(context).colorScheme.primary,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                        ),
                        child: Text(l10n.createEvent),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _createEvent() {
    if (_formKey.currentState!.validate()) {
      if (_pickedImage == null) {
        getIt<ShowToast>().showToast(
          context: context,
          message: 'Please pick an image',
          type: ToastificationType.error,
        );
        return;
      }

      context.read<EventsCubit>().createEvent(
        title: titleController.text,
        description: descriptionController.text,
        date: selectedDate,
        location: locationController.text,
        imagePath: _pickedImage!.path,
      );
    }
  }

  Future<void> _pickImage() async {
    final ImagePicker picker = ImagePicker();
    final image = await picker.pickImage(source: ImageSource.gallery); // or ImageSource.gallery
    if (image != null) {
      setState(() {
        _pickedImage = image;
        _imageUrlController.text = image.path;
      });
    }
  }
}