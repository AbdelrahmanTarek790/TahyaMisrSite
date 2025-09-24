import 'package:flutter_mediaCubit.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:injectable/injectable.dart';
import '../../data/models/user_management_model.dart';

part 'user_management_state.dart';
part 'user_management_cubit.freezed.dart';

@injectable 
class UserManagementCubit extends Cubit<UserManagementState> {
  UserManagementCubit() : super(const UserManagementState.initial());

  Future<void> getUsers({int page = 1, int limit = 10}) async {
    emit(const UserManagementState.loading());
    // Implementation would require repository - keeping simple for now
    emit(const UserManagementState.loaded(users: []));
  }
}