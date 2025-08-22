import 'package:flutter_bloc/flutter_bloc.dart';
import '../utils/app_settings.dart';

class SettingsCubit extends Cubit<AppSettings> {
  SettingsCubit() : super(const AppSettings(
    language: AppLanguage.arabic,
    themeMode: AppThemeMode.system,
  )) {
    _loadSettings();
  }

  Future<void> _loadSettings() async {
    final settings = await SettingsService.loadSettings();
    emit(settings);
  }

  Future<void> changeLanguage(AppLanguage language) async {
    await SettingsService.saveLanguage(language);
    emit(state.copyWith(language: language));
  }

  Future<void> changeThemeMode(AppThemeMode themeMode) async {
    await SettingsService.saveThemeMode(themeMode);
    emit(state.copyWith(themeMode: themeMode));
  }
}