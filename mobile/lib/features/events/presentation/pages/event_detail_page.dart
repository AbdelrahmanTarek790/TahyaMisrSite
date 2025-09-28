import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:intl/intl.dart';
import 'package:tahya_misr_app/features/events/presentation/cubits/events_cubit.dart';

class EventDetailPage extends StatefulWidget {
  final String eventId;

  const EventDetailPage({
    super.key,
    required this.eventId,
  });

  @override
  State<EventDetailPage> createState() => _EventDetailPageState();
}

class _EventDetailPageState extends State<EventDetailPage> {
  late EventsCubit _eventsBloc;

  @override
  void initState() {
    super.initState();
    _eventsBloc = GetIt.instance<EventsCubit>();

    _eventsBloc.getEventById(widget.eventId);
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider.value(
      value: _eventsBloc,
      child: BlocConsumer<EventsCubit, EventsState>(
        listener: (context, state) {
          state.whenOrNull(
            loaded: (event) {},
            error: (message) {},
          );
        },
        builder: (context, state) {
          return Scaffold(
            appBar: AppBar(
              title: const Text('تفاصيل الفعالية'),
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
                       eventDetail.imageUrl != null ? Hero(
                          tag: eventDetail.imageUrl ?? '',
                          child: ClipRRect(
                            borderRadius: const BorderRadius.vertical(
                              bottom: Radius.circular(24),
                            ),
                            child: Image.network(
                              eventDetail.imageUrl ?? '',
                              width: double.infinity,
                              height: 230,
                              fit: BoxFit.cover,
                            ),
                          ),
                        ) :
                        const SizedBox(),

                        const SizedBox(height: 20),

                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // العنوان
                              Text(
                                eventDetail.title,
                                style: Theme.of(context)
                                    .textTheme
                                    .headlineSmall
                                    ?.copyWith(
                                      fontWeight: FontWeight.bold,
                                    ),
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
                                      DateFormat('dd MMM yyyy, hh:mm a')
                                          .format(eventDetail.eventDate),
                                    ),
                                  ),
                                  Chip(
                                    avatar:
                                        const Icon(Icons.location_on, size: 18),
                                    label: Text(eventDetail.location),
                                  ),
                                  Chip(
                                    avatar: const Icon(Icons.person, size: 18),
                                    label: Text('By ${eventDetail.createdBy}'),
                                  ),
                                  Chip(
                                    avatar: const Icon(Icons.people, size: 18),
                                    label: Text(
                                      'Registered: ${eventDetail.registeredUsers.length}',
                                    ),
                                  ),
                                ],
                              ),

                              const SizedBox(height: 20),

                              // Card للوصف
                              Card(
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
            ),
          );
        },
      ),
    );
  }
}
