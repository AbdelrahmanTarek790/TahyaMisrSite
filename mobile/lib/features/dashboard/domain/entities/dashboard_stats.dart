import 'package:equatable/equatable.dart';

class DashboardStats extends Equatable {
  final int totalUsers;
  final int totalNews;
  final int totalEvents;
  final int totalMedia;
  final int activeUsers;
  final int pendingEvents;

  const DashboardStats({
    required this.totalUsers,
    required this.totalNews,
    required this.totalEvents,
    required this.totalMedia,
    required this.activeUsers,
    required this.pendingEvents,
  });

  @override
  List<Object?> get props => [
    totalUsers,
    totalNews,
    totalEvents,
    totalMedia,
    activeUsers,
    pendingEvents,
  ];
}