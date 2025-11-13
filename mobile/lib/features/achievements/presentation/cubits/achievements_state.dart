import 'package:freezed_annotation/freezed_annotation.dart';
import '../models/achievement_model.dart';

part 'achievements_state.freezed.dart';

@freezed
class AchievementsState with _$AchievementsState {
  const factory AchievementsState.initial() = _Initial;
  const factory AchievementsState.loading() = _Loading;
  const factory AchievementsState.loaded(List<AchievementModel> achievements) = _Loaded;
  const factory AchievementsState.loadedDetails(AchievementModel achievement) = _LoadedDetails;
  const factory AchievementsState.error(String message) = _Error;
}
