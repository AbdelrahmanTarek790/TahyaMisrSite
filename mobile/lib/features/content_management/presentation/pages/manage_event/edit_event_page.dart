import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';
import 'package:tahya_misr_app/core/constants/app_theme.dart';
import 'package:tahya_misr_app/gen_l10n/app_localizations.dart';

import '../../../../events/presentation/cubits/events_cubit.dart';

class EditEventPage extends StatefulWidget {
  final String eventId;
  late EventsCubit eventsCubit;

  EditEventPage({
    super.key,
    required this.eventId,
    required this.eventsCubit,
  });

  @override
  State<EditEventPage> createState() => _EditEventPageState();
}

class _EditEventPageState extends State<EditEventPage> {
  bool isEditingTitle = false;
  bool isEditingDescription = false;
  bool isEditingLocation = false;
  bool isEditingDate = false;
  bool isSaving = false;
  final titleController = TextEditingController();
  final descriptionController = TextEditingController();
  final locationController = TextEditingController();
  DateTime selectedDate = DateTime.now();
  final _imageUrlController = TextEditingController();
  XFile? _pickedImage;

  String? _originalTitle;
  String? _originalDescription;
  String? _originalLocation;
  DateTime? _originalDate;

  void _checkForChanges() {
    final hasChanges = titleController.text != (_originalTitle ?? '') ||
        descriptionController.text != (_originalDescription ?? '') ||
        locationController.text != (_originalLocation ?? '') ||
        selectedDate != (_originalDate ?? DateTime.now()) ||
        _pickedImage != null;

    if (hasChanges != isSaving) {
      setState(() {
        isSaving = hasChanges;
      });
    }
  }

  Future<void> _pickImage() async {
    final ImagePicker picker = ImagePicker();
    final image = await picker.pickImage(
        source: ImageSource.gallery,); // or ImageSource.gallery
    if (image != null) {
      setState(() {
        _pickedImage = image;
        _imageUrlController.text = image.path;
      });
    }
  }

  @override
  void initState() {
    super.initState();
    widget.eventsCubit.getEventById(widget.eventId);
    titleController.addListener(_checkForChanges);
    descriptionController.addListener(_checkForChanges);
    locationController.addListener(_checkForChanges);
  }

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<EventsCubit, EventsState>(
      listener: (context, state) {
        state.whenOrNull(
          loaded: (event) {},
          error: (message) {},
          loadedDetails: (event) {
            titleController.text = event.title;
            descriptionController.text = event.description;
            locationController.text = event.location;
            selectedDate = event.eventDate;
            _imageUrlController.text = event.imageUrl ?? '';
            _originalTitle ??= event.title;
            _originalDescription ??= event.description;
            _originalLocation ??= event.location;
            _originalDate ??= event.eventDate;

            setState(() => isSaving = false);
          },
        );
      },
      builder: (context, state) {
        return Scaffold(
          appBar: AppBar(
            title: const Text('تفاصيل الفعالية'),
            actions: [
              if(isSaving || _pickedImage != null)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 10.0),
                  child: ElevatedButton(
                    onPressed: () {
                      print('Event updated: ${titleController.text}, ${descriptionController.text}, ${locationController.text}, $selectedDate, ${_pickedImage?.path}');

                      if(_pickedImage != null) {
                        widget.eventsCubit.updateEvent(
                          eventId: widget.eventId,
                          title: titleController.text,
                          description: descriptionController.text,
                          date: selectedDate,
                          location: locationController.text,
                          imagePath: _pickedImage!.path,
                        );
                      } else {
                        widget.eventsCubit.updateEvent(
                          eventId: widget.eventId,
                          title: titleController.text,
                          description: descriptionController.text,
                          date: selectedDate,
                          location: locationController.text,
                        );
                      }
                      setState(() {
                        isSaving = false;
                        isEditingTitle = false;
                        isEditingDescription = false;
                        isEditingLocation = false;
                        isEditingDate = false;
                        _pickedImage = null;
                      });
                    },
                    child: const Text('حفظ',
                      style: TextStyle(fontSize: 16),
                    ),
                  ),
                ),
            ],
            leading: IconButton(
              icon: const Icon(Icons.arrow_back),
              onPressed: () {
                widget.eventsCubit.getEvents();
                Navigator.of(context).pop();
              },
            ),
          ),
          body: state.when(
            initial: () => const Center(child: CircularProgressIndicator()),
            loading: () => const Center(child: CircularProgressIndicator()),
            loaded: (_) => const SizedBox.shrink(),
            loadedDetails: (event) {
              if (event.id.isEmpty) {
                return const Center(child: Text('No event found'));
              }
              final eventDetail = event;
              return Padding(
                padding: const EdgeInsets.all(16.0),
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // صورة الحدث
                      eventDetail.imageUrl != null
                          ? Hero(
                              tag: eventDetail.imageUrl ?? '',
                              child: ClipRRect(
                                borderRadius: const BorderRadius.vertical(
                                  bottom: Radius.circular(24),
                                ),
                                child: _pickedImage !=null ? Image.file(
                                  File(_pickedImage!.path),
                                  width: double.infinity,
                                  height: 230,
                                  fit: BoxFit.cover,
                                ) : Image.network(
                                  eventDetail.imageUrl ?? '',
                                  width: double.infinity,
                                  height: 230,
                                  fit: BoxFit.cover,
                                ),
                              ),
                            )
                          : const SizedBox(),
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
                      const SizedBox(height: 20),

                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // العنوان
                            isEditingTitle
                                ? TextFormField(
                                    controller: titleController,
                                    style: AppTheme.textTheme.headlineMedium
                                        ?.copyWith(
                                      fontWeight: FontWeight.bold,
                                    ),
                                    maxLines: 2,
                                    decoration: const InputDecoration(
                                      labelText: 'Event Title',
                                    ),
                                    onChanged: (value) {
                                      _checkForChanges();
                                    },
                                  )
                                : Text(
                                    eventDetail.title,
                                    style: AppTheme.textTheme.headlineSmall
                                        ?.copyWith(
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),

                            Row(
                              children: [
                                const SizedBox(),
                                const Spacer(),
                                IconButton(
                                  icon: Icon(
                                    isEditingTitle ? Icons.close : Icons.edit,
                                  ),
                                  onPressed: () {
                                    setState(() {
                                      isEditingTitle = !isEditingTitle;
                                    });
                                  },
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),

                            // Chips للمعلومات السريعة
                            Wrap(
                              spacing: 8,
                              runSpacing: 8,
                              children: [
                                Chip(
                                  avatar: const Icon(
                                    Icons.calendar_today,
                                    size: 18,
                                  ),
                                  label: Text(
                                    DateFormat(
                                      'dd MMM yyyy, hh:mm a',
                                      AppLocalizations.of(context)
                                              ?.localeName ??
                                          'en',
                                    ).format(isEditingDate
                                        ? selectedDate
                                        : eventDetail.eventDate,),
                                  ),
                                ),
                                IconButton(
                                  icon: Icon(
                                    isEditingDate ? Icons.close : Icons.edit,
                                  ),
                                  onPressed: () async {
                                    if(!isEditingDate){
                                      final DateTime? picked = await showDatePicker(
                                        context: context,
                                        initialDate: selectedDate,
                                        firstDate: DateTime(2000),
                                        lastDate: DateTime(2101),
                                      );
                                      if (picked != null && picked != selectedDate) {
                                        setState(() {
                                          selectedDate = picked;
                                          _checkForChanges();
                                        });
                                      }
                                    }
                                    setState(() {
                                      isEditingDate = !isEditingDate;
                                    });
                                  },
                                ),
                                isEditingLocation
                                    ? TextFormField(
                                        controller: locationController,
                                        style: AppTheme.textTheme.headlineSmall
                                            ?.copyWith(
                                          fontWeight: FontWeight.bold,
                                        ),
                                        maxLines: 1,
                                        decoration: const InputDecoration(
                                          labelText: 'Event Location',
                                        ),
                                        onChanged: (value) {
                                          _checkForChanges();
                                        },
                                      )
                                    : Chip(
                                        avatar: const Icon(
                                          Icons.location_on,
                                          size: 18,
                                        ),
                                        label: Text(eventDetail.location),
                                      ),
                                IconButton(
                                  icon: Icon(isEditingLocation
                                      ? Icons.close
                                      : Icons.edit,),
                                  onPressed: () {
                                    setState(() {
                                      isEditingLocation = !isEditingLocation;
                                    });
                                  },
                                ),
                              ],
                            ),

                            const SizedBox(height: 20),
                            Row(
                              children: [
                                const SizedBox(),
                                const Spacer(),
                                IconButton(
                                  icon: Icon(isEditingDescription
                                      ? Icons.close
                                      : Icons.edit,),
                                  onPressed: () {
                                    setState(() {
                                      isEditingDescription =
                                          !isEditingDescription;
                                    });
                                  },
                                ),
                              ],
                            ),
                            // Card للوصف
                            isEditingDescription
                                ? TextFormField(
                                    controller: descriptionController,
                                    style: AppTheme.textTheme.headlineMedium
                                        ?.copyWith(
                                      fontWeight: FontWeight.bold,
                                    ),
                                    maxLines: null,
                                    keyboardType: TextInputType.multiline,
                                    decoration: const InputDecoration(
                                      labelText: 'Event Description',
                                    ),
                                    onChanged: (value) {
                                      _checkForChanges();
                                    },
                                  )
                                : Card(
                                    elevation: 2,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                    child: Padding(
                                      padding: const EdgeInsets.all(16.0),
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            'Description',
                                            style: Theme.of(context)
                                                .textTheme
                                                .titleMedium
                                                ?.copyWith(
                                                  fontWeight: FontWeight.bold,
                                                ),
                                          ),
                                          const SizedBox(height: 8),
                                          Text(
                                            eventDetail.description,
                                            style: const TextStyle(
                                              fontSize: 16,
                                              height: 1.4,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),

                            const SizedBox(height: 24),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
            error: (message) => Center(child: Text('Error: $message')),
            registeredSuccessfully: (_) => const SizedBox.shrink(),
            eventCreated: (_) => const SizedBox.shrink(),
            eventDeleted: (_) => const SizedBox.shrink(),
          ),
        );
      },
    );
  }
}
