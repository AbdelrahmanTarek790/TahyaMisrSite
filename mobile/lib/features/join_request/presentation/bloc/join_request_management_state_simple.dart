import 'package:equatable/equatable.dart';
import '../../domain/entities/join_request.dart';

abstract class JoinRequestManagementState extends Equatable {
  const JoinRequestManagementState();

  @override
  List<Object?> get props => [];
}

class JoinRequestManagementInitial extends JoinRequestManagementState {
  const JoinRequestManagementInitial();
}

class JoinRequestManagementLoading extends JoinRequestManagementState {
  const JoinRequestManagementLoading();
}

class JoinRequestManagementLoaded extends JoinRequestManagementState {
  final List<JoinRequest> joinRequests;
  final int currentPage;
  final int totalPages;
  final int totalCount;
  final String? selectedStatus;
  
  const JoinRequestManagementLoaded({
    required this.joinRequests,
    required this.currentPage,
    required this.totalPages,
    required this.totalCount,
    this.selectedStatus,
  });

  @override
  List<Object?> get props => [joinRequests, currentPage, totalPages, totalCount, selectedStatus];
}

class JoinRequestManagementProcessing extends JoinRequestManagementState {
  final String requestId;
  
  const JoinRequestManagementProcessing({required this.requestId});

  @override
  List<Object> get props => [requestId];
}

class JoinRequestManagementActionSuccess extends JoinRequestManagementState {
  final String message;
  
  const JoinRequestManagementActionSuccess({required this.message});

  @override
  List<Object> get props => [message];
}

class JoinRequestManagementError extends JoinRequestManagementState {
  final String message;
  
  const JoinRequestManagementError({required this.message});

  @override
  List<Object> get props => [message];
}

// Extension to mimic freezed's when method
extension JoinRequestManagementStateExtension on JoinRequestManagementState {
  T when<T>({
    required T Function() initial,
    required T Function() loading,
    required T Function(List<JoinRequest> joinRequests, int currentPage, int totalPages, int totalCount, String? selectedStatus) loaded,
    required T Function(String requestId) processing,
    required T Function(String message) actionSuccess,
    required T Function(String message) error,
  }) {
    if (this is JoinRequestManagementInitial) {
      return initial();
    } else if (this is JoinRequestManagementLoading) {
      return loading();
    } else if (this is JoinRequestManagementLoaded) {
      final state = this as JoinRequestManagementLoaded;
      return loaded(state.joinRequests, state.currentPage, state.totalPages, state.totalCount, state.selectedStatus);
    } else if (this is JoinRequestManagementProcessing) {
      return processing((this as JoinRequestManagementProcessing).requestId);
    } else if (this is JoinRequestManagementActionSuccess) {
      return actionSuccess((this as JoinRequestManagementActionSuccess).message);
    } else if (this is JoinRequestManagementError) {
      return error((this as JoinRequestManagementError).message);
    } else {
      throw Exception('Unknown state: $this');
    }
  }

  T? whenOrNull<T>({
    T Function()? initial,
    T Function()? loading,
    T Function(List<JoinRequest> joinRequests, int currentPage, int totalPages, int totalCount, String? selectedStatus)? loaded,
    T Function(String requestId)? processing,
    T Function(String message)? actionSuccess,
    T Function(String message)? error,
  }) {
    if (this is JoinRequestManagementInitial && initial != null) {
      return initial();
    } else if (this is JoinRequestManagementLoading && loading != null) {
      return loading();
    } else if (this is JoinRequestManagementLoaded && loaded != null) {
      final state = this as JoinRequestManagementLoaded;
      return loaded(state.joinRequests, state.currentPage, state.totalPages, state.totalCount, state.selectedStatus);
    } else if (this is JoinRequestManagementProcessing && processing != null) {
      return processing((this as JoinRequestManagementProcessing).requestId);
    } else if (this is JoinRequestManagementActionSuccess && actionSuccess != null) {
      return actionSuccess((this as JoinRequestManagementActionSuccess).message);
    } else if (this is JoinRequestManagementError && error != null) {
      return error((this as JoinRequestManagementError).message);
    }
    return null;
  }

  T maybeWhen<T>({
    T Function()? initial,
    T Function()? loading,
    T Function(List<JoinRequest> joinRequests, int currentPage, int totalPages, int totalCount, String? selectedStatus)? loaded,
    T Function(String requestId)? processing,
    T Function(String message)? actionSuccess,
    T Function(String message)? error,
    required T Function() orElse,
  }) {
    final result = whenOrNull(
      initial: initial,
      loading: loading,
      loaded: loaded,
      processing: processing,
      actionSuccess: actionSuccess,
      error: error,
    );
    return result ?? orElse();
  }
}