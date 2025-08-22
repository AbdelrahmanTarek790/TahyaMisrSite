import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../../../../core/dependency_injection/injection.dart';
import '../../../../../gen_l10n/app_localizations.dart';
import '../../../../news/presentation/bloc/news_bloc.dart';

class CreateNewsPage extends StatefulWidget {
  const CreateNewsPage({super.key});

  @override
  State<CreateNewsPage> createState() => _CreateNewsPageState();
}

class _CreateNewsPageState extends State<CreateNewsPage> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _excerptController = TextEditingController();
  final _contentController = TextEditingController();
  final _imageUrlController = TextEditingController();

  @override
  void dispose() {
    _titleController.dispose();
    _excerptController.dispose();
    _contentController.dispose();
    _imageUrlController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.createNews),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Colors.white,
      ),
      body: Padding(
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
                        controller: _titleController,
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

                      // Excerpt field
                      TextFormField(
                        controller: _excerptController,
                        decoration: InputDecoration(
                          labelText: l10n.excerpt,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          filled: true,
                          fillColor: Theme.of(context).colorScheme.surface,
                        ),
                        maxLines: 2,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return l10n.excerptRequired;
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      // Content field
                      TextFormField(
                        controller: _contentController,
                        decoration: InputDecoration(
                          labelText: l10n.content,
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

                      // Image URL field
                      TextFormField(
                        controller: _imageUrlController,
                        decoration: InputDecoration(
                          labelText: l10n.imageUrl,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          filled: true,
                          fillColor: Theme.of(context).colorScheme.surface,
                          suffixIcon: IconButton(
                            icon: const Icon(Icons.image),
                            onPressed: () {
                              // TODO: Implement image picker
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(l10n.imagePickerComingSoon),
                                ),
                              );
                            },
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),

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
                            child: Image.network(
                              _imageUrlController.text,
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) => 
                                Container(
                                  color: Colors.grey[200],
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(
                                        Icons.broken_image,
                                        size: 48,
                                        color: Colors.grey[400],
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        l10n.invalidImageUrl,
                                        style: TextStyle(color: Colors.grey[600]),
                                      ),
                                    ],
                                  ),
                                ),
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
                      onPressed: _createNews,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Theme.of(context).colorScheme.primary,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      child: Text(l10n.createNews),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _createNews() {
    if (_formKey.currentState!.validate()) {
      // TODO: Create news using NewsBloc
      final newsData = {
        'title': _titleController.text,
        'excerpt': _excerptController.text,
        'content': _contentController.text,
        'image': _imageUrlController.text.isNotEmpty ? _imageUrlController.text : null,
      };

      // For now, show success message and go back
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('News creation will be implemented with backend integration'),
          backgroundColor: Colors.orange,
        ),
      );
      
      context.pop();
    }
  }
}