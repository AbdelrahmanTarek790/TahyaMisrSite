import 'package:flutter_mediaCubit.dart';
import 'package:logger/logger.dart';

class AppBlocObserver extends BlocObserver {
  final Logger _logger = Logger();

  @override
  void onCreate(BlocBase bloc) {
    super.onCreate(bloc);
    _mediaCubit.runtimeType} created');
  }

  // @override
  // void onEvent(BlocBase bloc, Object? event) {
  //   super.onEvent(bloc, event);
  //   _mediaCubit.runtimeType} event: $event');
  // }

  @override
  void onChange(BlocBase bloc, Change change) {
    super.onChange(bloc, change);
    _mediaCubit.runtimeType} changed: $change');
  }

  // @override
  // void onTransition(BlocBase bloc, Transition transition) {
  //   super.onTransition(bloc, transition);
  //   _mediaCubit.runtimeType} transition: $transition');
  // }

  @override
  void onError(BlocBase bloc, Object error, StackTrace stackTrace) {
    super.onError(bloc, error, stackTrace);
    _mediaCubit.runtimeType} error',
        error: error, stackTrace: stackTrace,);
  }

  @override
  void onClose(BlocBase bloc) {
    super.onClose(bloc);
    _mediaCubit.runtimeType} closed');
  }
}
