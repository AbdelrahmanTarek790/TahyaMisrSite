import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import '../../domain/usecases/create_join_request_usecase.dart';
import '../../domain/usecases/get_join_requests_usecase.dart';
import '../../domain/usecases/approve_join_request_usecase.dart';
import '../../domain/usecases/deny_join_request_usecase.dart';
import 'join_request_event.dart';
import 'join_request_state.dart';

@injectable
class JoinRequestBloc extends Bloc<JoinRequestEvent, JoinRequestState> {
  final CreateJoinRequestUseCase createJoinRequestUseCase;
  final GetJoinRequestsUseCase getJoinRequestsUseCase;
  final ApproveJoinRequestUseCase approveJoinRequestUseCase;
  final DenyJoinRequestUseCase denyJoinRequestUseCase;

  JoinRequestBloc({
    required this.createJoinRequestUseCase,
    required this.getJoinRequestsUseCase,
    required this.approveJoinRequestUseCase,
    required this.denyJoinRequestUseCase,
  }) : super(const JoinRequestState.initial()) {
    on<CreateJoinRequestEvent>(_onCreateJoinRequest);
    on<GetJoinRequestsEvent>(_onGetJoinRequests);
    on<ApproveJoinRequestEvent>(_onApproveJoinRequest);
    on<DenyJoinRequestEvent>(_onDenyJoinRequest);
    on<ResetStateEvent>(_onResetState);
  }

  Future<void> _onCreateJoinRequest(
    CreateJoinRequestEvent event,
    Emitter<JoinRequestState> emit,
  ) async {
    emit(const JoinRequestState.loading());

    final result = await createJoinRequestUseCase(
      CreateJoinRequestParams(request: event.request),
    );

    result.fold(
      (failure) => emit(JoinRequestState.error(message: failure.message)),
      (_) => emit(const JoinRequestState.actionCompleted(
        message: 'تم إرسال طلب الانضمام بنجاح. سيتم مراجعته قريباً.',
      )),
    );
  }

  Future<void> _onGetJoinRequests(
    GetJoinRequestsEvent event,
    Emitter<JoinRequestState> emit,
  ) async {
    emit(const JoinRequestState.loading());

    final result = await getJoinRequestsUseCase(
      GetJoinRequestsParams(
        page: event.page,
        limit: event.limit,
        status: event.status,
      ),
    );

    result.fold(
      (failure) => emit(JoinRequestState.error(message: failure.message)),
      (joinRequests) => emit(JoinRequestState.joinRequestsLoaded(
        joinRequests: joinRequests,
        currentPage: event.page,
        hasMore: joinRequests.length >= event.limit,
      )),
    );
  }

  Future<void> _onApproveJoinRequest(
    ApproveJoinRequestEvent event,
    Emitter<JoinRequestState> emit,
  ) async {
    emit(const JoinRequestState.loading());

    final result = await approveJoinRequestUseCase(
      ApproveJoinRequestParams(id: event.id, action: event.action),
    );

    result.fold(
      (failure) => emit(JoinRequestState.error(message: failure.message)),
      (_) => emit(const JoinRequestState.actionCompleted(
        message: 'تم الموافقة على طلب الانضمام بنجاح',
      )),
    );
  }

  Future<void> _onDenyJoinRequest(
    DenyJoinRequestEvent event,
    Emitter<JoinRequestState> emit,
  ) async {
    emit(const JoinRequestState.loading());

    final result = await denyJoinRequestUseCase(
      DenyJoinRequestParams(id: event.id, action: event.action),
    );

    result.fold(
      (failure) => emit(JoinRequestState.error(message: failure.message)),
      (_) => emit(const JoinRequestState.actionCompleted(
        message: 'تم رفض طلب الانضمام',
      )),
    );
  }

  void _onResetState(
    ResetStateEvent event,
    Emitter<JoinRequestState> emit,
  ) {
    emit(const JoinRequestState.initial());
  }
}