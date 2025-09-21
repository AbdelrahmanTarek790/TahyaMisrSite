import 'package:equatable/equatable.dart';

abstract class JoinRequestState extends Equatable {
  const JoinRequestState();

  @override
  List<Object?> get props => [];
}

class JoinRequestInitial extends JoinRequestState {
  const JoinRequestInitial();
}

class JoinRequestLoading extends JoinRequestState {
  const JoinRequestLoading();
}

class JoinRequestSuccess extends JoinRequestState {
  final String message;
  
  const JoinRequestSuccess({required this.message});

  @override
  List<Object> get props => [message];
}

class JoinRequestError extends JoinRequestState {
  final String message;
  
  const JoinRequestError({required this.message});

  @override
  List<Object> get props => [message];
}

// Extension to mimic freezed's when method
extension JoinRequestStateExtension on JoinRequestState {
  T when<T>({
    required T Function() initial,
    required T Function() loading,
    required T Function(String message) success,
    required T Function(String message) error,
  }) {
    if (this is JoinRequestInitial) {
      return initial();
    } else if (this is JoinRequestLoading) {
      return loading();
    } else if (this is JoinRequestSuccess) {
      return success((this as JoinRequestSuccess).message);
    } else if (this is JoinRequestError) {
      return error((this as JoinRequestError).message);
    } else {
      throw Exception('Unknown state: $this');
    }
  }
}