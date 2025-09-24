import 'package:flutter/material.dart';
import 'package:flutter_mediaCubit.dart';
import 'package:get_it/get_it.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';

import '../cubits/events_cubit.dart';
import '../../data/models/event_model.dart';
import '../../../auth/presentation/cubits/auth_cubit.dart';


class EventsListPage extends StatefulWidget {
  const EventsListPage({super.key});

  @override
  State<EventsListPage> createState() => _EventsListPageState();
}

class _EventsListPageState extends State<EventsListPage> {
  late EventsCubit _eventsCubit;

  @override
  void initState() {
    super.initState();
    _eventsCubit = GetIt.instance<EventsCubit>();
    _eventsCubit.getEvents();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('الفعاليات'),
        backgroundColor: Theme.of(context).colorScheme.surface,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              _eventsCubit.getEvents();
            },
          ),
        ],
      ),
      body: BlocProvider.value(
        value: _eventsCubit,
        child: BlocBuilder<EventsCubit, EventsState>(
          builder: (context, state) {
            return state.when(
              loadedDetails: (_) => const SizedBox.shrink(),
              initial: () => const Center(
                child: CircularProgressIndicator(),
              ),
              loading: () => const Center(
                child: CircularProgressIndicator(),
              ),
              loaded: (eventsList) => eventsList.isEmpty
                  ? const Center(
                      child: Text('لا توجد فعاليات متاحة'),
                    )
                  : RefreshIndicator(
                      onRefresh: () async {
                        _eventsCubit.getEvents();
                      },
                      child: ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: eventsList.length,
                        itemBuilder: (context, index) {
                          final event = eventsList[index];
                          return _EventCard(event: event)
                              .animate(delay: (index * 100).ms)
                              .slideX(begin: 0.1)
                              .fadeIn();
                        },
                      ),
                    ),
              error: (message) => Center(
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
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      message,
                      style: Theme.of(context).textTheme.bodyMedium,
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton(
                      onPressed: () {
                        _eventsCubit.getEvents();
                      },
                      child: const Text('إعادة المحاولة'),
                    ),
                  ],
                ),
              ),
              registeredSuccessfully: (_) {
                _eventsCubit.getEvents();
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
  final Event event;

  const _EventCard({required this.event});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () {
          context.go('/events/detail/${event.id}');
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
                  errorBuilder: (context, error, stackTrace) => Container(
                    color:
                        Theme.of(context).colorScheme.surfaceContainerHighest,
                    child: Icon(
                      Icons.event,
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
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
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    event.description,
                    style: Theme.of(context).textTheme.bodyMedium,
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Icon(
                        Icons.calendar_today,
                        size: 16,
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        _formatDate(event.eventDate),
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: Theme.of(context)
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
                            color: Theme.of(context).colorScheme.primary,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            'قادم',
                            style: Theme.of(context)
                                .textTheme
                                .bodySmall
                                ?.copyWith(
                                  color:
                                      Theme.of(context).colorScheme.onPrimary,
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
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                        ),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            event.location,
                            style:
                                Theme.of(context).textTheme.bodySmall?.copyWith(
                                      color: Theme.of(context)
                                          .colorScheme
                                          .onSurfaceVariant,
                                    ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ],
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: BlocConsumer<AuthCubit, AuthState>(
                      listener: (context, state) {},
                      builder: (context, state) {
                        return state.when(
                          initial: () => const SizedBox.shrink(),
                          loading: () => const SizedBox.shrink(),
                          authenticated: (user, token) {
                            return event.registeredUsers.contains(user.id) ==
                                    false
                                ? ElevatedButton(
                                    onPressed: () {
                                      // Check if user is authenticated
                                      if (user.id.isNotEmpty) {
                                        // Register for the event
                                        context.read<EventsCubit>().registerForEvent(event.id);
                                      } else {
                                        // Navigate to login page
                                        context.go('/login');
                                      }
                                    },
                                    child: const Text('سجل الآن'),
                                  )
                                : const Center(
                                  child: Text('مسجل بالفعل',
                                      style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        color: Colors.green,
                                        fontSize: 16,
                                      ),),
                                );
                          },
                          unauthenticated: () {
                            return ElevatedButton(
                              onPressed: () {
                                // Navigate to login page
                                context.go('/login');
                              },
                              child: const Text('تسجيل الدخول للتسجيل'),
                            );
                          },
                          error: (message) => const SizedBox.shrink(),
                        );
                      },
                    ),
                  ),
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
