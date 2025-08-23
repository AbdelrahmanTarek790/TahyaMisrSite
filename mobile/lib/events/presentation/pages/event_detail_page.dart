import 'package:flutter/material.dart';

class EventDetailPage extends StatelessWidget {
  final String eventId;

  const EventDetailPage({
    super.key,
    required this.eventId,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('تفاصيل الفعالية'),
      ),
      body: Center(
        child: Text('تفاصيل الفعالية $eventId'),
      ),
    );
  }
}