import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
import 'package:tahya_misr_app/core/constants/app_theme.dart';

import '../../../../news/presentation/cubits/news_cubit.dart';

class EditNewsPage extends StatefulWidget {
  final String newsId;
  late  NewsCubit newsBloc;
   EditNewsPage({
    super.key,
    required this.newsId, 
    required this.newsBloc,
  });

  @override
  State<EditNewsPage> createState() => _EditNewsPageState();
}

class _EditNewsPageState extends State<EditNewsPage> {

  bool isEditingTitle= false;
  bool isEditingContent= false;
  bool isSaving= false;
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _contentController = TextEditingController();
  final _imageUrlController = TextEditingController();
  XFile? _pickedImage;
  String? _originalTitle;
  String? _originalContent;

  @override
  void initState() {
    super.initState();
    widget.newsBloc.getNewsById(widget.newsId);

    _titleController.addListener(_checkForChanges);
    _contentController.addListener(_checkForChanges);
  }

  void _checkForChanges() {
    final hasChanges =
        _titleController.text != (_originalTitle ?? '') ||
            _contentController.text != (_originalContent ?? '');

    if (hasChanges != isSaving) {
      setState(() {
        isSaving = hasChanges;
      });
    }
  }

  Future<void> _pickImage() async {
    final ImagePicker picker = ImagePicker();
    final image = await picker.pickImage(source: ImageSource.camera); // or ImageSource.gallery
    if (image != null) {
      setState(() {
        _pickedImage = image;
        _imageUrlController.text = image.path;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<NewsCubit, NewsState>(
      listener: (context, state) {
        state.whenOrNull(
          loaded: (news) {},
          error: (message) {},
          loadedDetails: (newsData) {
            _originalTitle = newsData.title;
            _originalContent = newsData.content;

            // مبدئيًا حط النصوص في الكنترولر
            _titleController.text = newsData.title;
            _contentController.text = newsData.content;

            // تأكد إن الزر مش ظاهر
            setState(() => isSaving = false);
          },
          newsUpdated: (news) {

          },
        );
      },
      builder: (context, state) {
        return Scaffold(
          body: state.when(
            initial: () => const Text('initial'),
            loading: () => const Text('loading'),
            loaded: (_) => const Text('loaded'),
            newsUpdated: (newsData) => const Center(child: CircularProgressIndicator()),
            loadedDetails: (newsData) {
              if (newsData.id.isEmpty) {
                return Center(
                  child: Text(
                    'لم يتم العثور على الخبر',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                );
              }
              return CustomScrollView(
                slivers: [
                  SliverAppBar(
                    expandedHeight: 400,
                    pinned: true,
                    flexibleSpace: FlexibleSpaceBar(
                      background: _pickedImage !=null ? Image.file(
                        File(_pickedImage!.path),
                        fit: BoxFit.fill,
                      ) : Image.network(
                        newsData.imageUrl ?? '',
                        fit: BoxFit.fill,
                        errorBuilder: (context, error, stackTrace) =>
                            Container(
                          color: Theme.of(context)
                              .colorScheme
                              .surfaceContainerHighest,
                          child: Icon(
                            Icons.image_not_supported,
                            size: 64,
                            color: Theme.of(context)
                                .colorScheme
                                .onSurfaceVariant,
                          ),
                        ),
                      ),
                    ),
                    actions: [
                      if(isSaving || _pickedImage != null)
                        Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 10.0),
                        child: ElevatedButton(
                          onPressed: () {
                            if(_pickedImage != null) {
                              widget.newsBloc.updateNews(
                                newsId: newsData.id,
                                title: _titleController.text,
                                content: _contentController.text,
                                imagePath: _pickedImage!.path,
                              );
                            } else {
                              widget.newsBloc.updateNews(
                                newsId: newsData.id,
                                title: _titleController.text,
                                content: _contentController.text,
                              );
                            }
                            setState(() {
                              isSaving = false;
                              isEditingTitle = false;
                              isEditingContent = false;
                              _originalTitle = _titleController.text;
                              _originalContent = _contentController.text;
                              _pickedImage = null;
                            });
                            Navigator.pop(context);
                          },
                          child: const Text('حفظ',
                          style: TextStyle(fontSize: 16),
                          ),
                        ),
                      ),
                    ],
                  ),
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const SizedBox(),
                              const Spacer(),
                              _pickedImage != null ? IconButton(
                                icon: const Icon(Icons.close),
                                onPressed: (){
                                  setState(() {
                                    _pickedImage = null;
                                  });
                                },
                              ) : const SizedBox.shrink(),
                              IconButton(
                                icon: const Icon(Icons.photo),
                                onPressed: _pickImage,
                              ),
                            ],
                          ),
                          // Title
                          isEditingTitle ?  TextFormField(
                            controller: _titleController,
                        style:AppTheme.textTheme.headlineMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                        maxLines: 2,
                        decoration: const InputDecoration(
                          labelText: 'عنوان الخبر',
                        ),
                        onChanged: (value) {
                          _checkForChanges();
                        },
                      ) :
                          Text(
                            newsData.title,
                            style: Theme.of(context)
                                .textTheme
                                .headlineMedium
                                ?.copyWith(
                                  fontWeight: FontWeight.bold,
                                ),
                          )
                              .animate()
                              .fadeIn()
                              .slideY(begin: 0.3, end: 0),

                          Row(
                            children: [
                              const SizedBox(),
                              const Spacer(),
                              IconButton(
                                icon:  Icon(isEditingContent ? Icons.close : Icons.edit),
                                onPressed: () {
                                  setState(() {
                                    isEditingTitle = !isEditingTitle;
                                  });
                                },
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),

                          // Meta Info
                          Row(
                            children: [
                              CircleAvatar(
                                radius: 20,
                                backgroundColor:
                                    Theme.of(context).colorScheme.primary,
                                child: Icon(
                                  Icons.person,
                                  color: Theme.of(context)
                                      .colorScheme
                                      .onPrimary,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment:
                                      CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      newsData.author,
                                      style: Theme.of(context)
                                          .textTheme
                                          .titleMedium
                                          ?.copyWith(
                                            fontWeight: FontWeight.w600,
                                          ),
                                    ),
                                    Text(
                                      'منذ ${DateTime.now().difference(newsData.createdAt).inHours} ساعات',
                                      style: Theme.of(context)
                                          .textTheme
                                          .bodySmall
                                          ?.copyWith(
                                            color: Theme.of(context)
                                                .colorScheme
                                                .onSurface
                                                .withValues(alpha: 0.6),
                                          ),
                                    ),
                                  ],
                                ),
                              ),
                              IconButton(
                                icon: const Icon(Icons.share),
                                onPressed: () {
                                  // TODO: Implement share functionality
                                },
                              ),
                              IconButton(
                                icon: const Icon(Icons.bookmark_outline),
                                onPressed: () {},
                              ),
                            ],
                          )
                              .animate()
                              .fadeIn(delay: 200.ms)
                              .slideX(begin: -0.3, end: 0),

                          const SizedBox(height: 24),
                          Row(
                            children: [
                              const SizedBox(),
                              const Spacer(),
                              IconButton(
                                icon:  Icon(isEditingContent ? Icons.close : Icons.edit),
                                onPressed: () {
                                  setState(() {
                                    isEditingContent = !isEditingContent;
                                  });
                                },
                              ),
                            ],
                          ),

                          // Content
                          isEditingContent ? TextFormField(
                            controller: _contentController,
                            style:AppTheme.textTheme.headlineMedium?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                            maxLines: null,
                            keyboardType: TextInputType.multiline,
                            decoration: const InputDecoration(
                              labelText: 'محتوى الخبر',
                            ),
                            onChanged: (value) {
                              _checkForChanges();
                            },
                          ) : Text(
                            newsData.content,
                            style: Theme.of(context)
                                .textTheme
                                .bodyLarge
                                ?.copyWith(
                                  height: 1.6,
                                ),
                          ).animate().fadeIn(delay: 400.ms),

                          const SizedBox(height: 10),
                        ],
                      ),
                    ),
                  ),
                ],
              );
            },
            deletingNews: (id) =>
                const Center(child: CircularProgressIndicator()),
            newsCreated: (data) =>
                const Center(child: CircularProgressIndicator()),
            error: (String message) {
              return null;
            },
          ),
        );
      },
    );
  }
}
