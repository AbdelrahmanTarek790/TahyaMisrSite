import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:go_router/go_router.dart';

import '../../../../../core/constants/app_theme.dart';
import '../../../../../gen_l10n/app_localizations.dart';
import '../../../../events/data/models/event_model.dart';
import '../../../../events/presentation/cubits/events_cubit.dart';
import 'create_event_page.dart';
import 'edit_event_page.dart';

class MangeEvents extends StatefulWidget {
  const MangeEvents({super.key});

  @override
  State<MangeEvents> createState() => _MangeEventsState();
}

class _MangeEventsState extends State<MangeEvents> {
  late EventsCubit _eventsBloc;

  @override
  void initState() {
    super.initState();
    _eventsBloc = GetIt.instance<EventsCubit>();
    _eventsBloc.getEvents();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    return Scaffold(
      appBar: AppBar(
        title: const Text('إدارة الفعاليات'),
        actions: [
          TextButton(
            child: Text(
              l10n.addEvent,
              style: const TextStyle(color: AppTheme.primaryColor),
            ),
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) =>
                      BlocProvider.value(
                        value: _eventsBloc,
                        child: const CreateEventPage(),
                      ),
                ),
              );
            },
          ),
        ],

      ),
      body: BlocProvider.value(
        value: _eventsBloc,
        child: BlocBuilder<EventsCubit, EventsState>(
          builder: (context, state) {
            return state.when(
              loadedDetails: (_) => const SizedBox.shrink(),
              initial: () =>
              const Center(
                child: CircularProgressIndicator(),
              ),
              loading: () =>
              const Center(
                child: CircularProgressIndicator(),
              ),
              loaded: (eventsList) =>
              eventsList.isEmpty
                  ? const Center(
                child: Text('لا توجد فعاليات متاحة'),
              )
                  : RefreshIndicator(
                onRefresh: () async {
                  _eventsBloc.refreshEvents();
                },
                child: ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: eventsList.length,
                  itemBuilder: (context, index) {
                    final event = eventsList[index];
                    return _EventCard(event: event, eventsCubit: _eventsBloc,)
                        .animate(delay: (index * 100).ms)
                        .slideX(begin: 0.1)
                        .fadeIn();
                  },
                ),
              ),
              error: (message) =>
                  Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          Icons.error_outline,
                          size: 64,
                          color: Colors.red,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'حدث خطأ',
                          style: Theme
                              .of(context)
                              .textTheme
                              .headlineSmall,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          message,
                          style: Theme
                              .of(context)
                              .textTheme
                              .bodyMedium,
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 24),
                        ElevatedButton(
                          onPressed: () {
                            _eventsBloc.refreshEvents();
                          },
                          child: const Text('إعادة المحاولة'),
                        ),
                      ],
                    ),
                  ),
              registeredSuccessfully: (_) {
                _eventsBloc.getEvents();
                return const SizedBox.shrink();
              },
              eventCreated: (event) {
                _eventsBloc.getEvents();
                Navigator.of(context).pop();
                return const SizedBox.shrink();
              },
              eventDeleted: (id) {
                _eventsBloc.getEvents();
                return const SizedBox.shrink();
              },
            );
          },
        ),
      ),
    );
  }
}

class _EventCard extends StatelessWidget {
  final EventModel event;
  final EventsCubit eventsCubit;

  const _EventCard({required this.event, required this.eventsCubit});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () {

        },
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (event.imageUrl != null)
              AspectRatio(
                aspectRatio: 16 / 9,
                child: Image.network(
                  event.imageUrl!,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) =>
                      Container(
                        color:
                        Theme
                            .of(context)
                            .colorScheme
                            .surfaceContainerHighest,
                        child: Icon(
                          Icons.event,
                          color: Theme
                              .of(context)
                              .colorScheme
                              .onSurfaceVariant,
                          size: 48,
                        ),
                      ),
                ),
              ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    event.title,
                    style: Theme
                        .of(context)
                        .textTheme
                        .headlineSmall
                        ?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    event.description,
                    style: Theme
                        .of(context)
                        .textTheme
                        .bodyMedium,
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Icon(
                        Icons.calendar_today,
                        size: 16,
                        color: Theme
                            .of(context)
                            .colorScheme
                            .onSurfaceVariant,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        _formatDate(event.eventDate),
                        style: Theme
                            .of(context)
                            .textTheme
                            .bodySmall
                            ?.copyWith(
                          color: Theme
                              .of(context)
                              .colorScheme
                              .onSurfaceVariant,
                        ),
                      ),
                      const Spacer(),
                      if (_isUpcomingEvent(event.eventDate))
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: Theme
                                .of(context)
                                .colorScheme
                                .primary,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            'قادم',
                            style: Theme
                                .of(context)
                                .textTheme
                                .bodySmall
                                ?.copyWith(
                              color:
                              Theme
                                  .of(context)
                                  .colorScheme
                                  .onPrimary,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                    ],
                  ),
                  if (event.location.isNotEmpty) ...[
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Icon(
                          Icons.location_on,
                          size: 16,
                          color: Theme
                              .of(context)
                              .colorScheme
                              .onSurfaceVariant,
                        ),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            event.location,
                            style:
                            Theme
                                .of(context)
                                .textTheme
                                .bodySmall
                                ?.copyWith(
                              color: Theme
                                  .of(context)
                                  .colorScheme
                                  .onSurfaceVariant,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        Row(
                          children: [
                            IconButton(
                              icon: const Icon(Icons.edit, size: 20),
                              onPressed: () {
                                Navigator.of(context).push(
                                  MaterialPageRoute(
                                    builder: (context) =>
                                        BlocProvider.value(
                                          value: eventsCubit,
                                          child: EditEventPage(eventId: event.id,eventsCubit: eventsCubit,),
                                  ),
                                ),
                                );
                              },
                            ),
                            IconButton(
                              icon: const Icon(Icons.delete, size: 20),
                              onPressed: () {
                                context.read<EventsCubit>().deleteEvent(
                                    event.id,);
                              },
                            ),
                            IconButton(
                              icon: const Icon(Icons.remove_red_eye, size: 16),
                              onPressed: () {
                                context.push('/events/detail/${event.id}');
                              },
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                  const SizedBox(height: 16),

                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }

  bool _isUpcomingEvent(DateTime date) {
    return date.isAfter(DateTime.now());
  }
}
