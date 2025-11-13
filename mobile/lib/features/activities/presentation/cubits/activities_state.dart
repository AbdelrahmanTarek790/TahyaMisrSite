import 'package:freezed_annotation/freezed_annotation.dart';
import '../models/activity_model.dart';

part 'activities_state.freezed.dart';

@freezed
class ActivitiesState with _$ActivitiesState {
  const factory ActivitiesState.initial() = _Initial;
  const factory ActivitiesState.loading() = _Loading;
  const factory ActivitiesState.loaded(List<ActivityModel> activities) = _Loaded;
  const factory ActivitiesState.loadedDetails(ActivityModel activity) = _LoadedDetails;
  const factory ActivitiesState.error(String message) = _Error;
}
