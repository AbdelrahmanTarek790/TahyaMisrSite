import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

enum AppLanguage { arabic, english }
enum AppThemeMode { light, dark, system }

class AppSettings {
  final AppLanguage language;
  final AppThemeMode themeMode;

  const AppSettings({
    required this.language,
    required this.themeMode,
  });

  AppSettings copyWith({
    AppLanguage? language,
    AppThemeMode? themeMode,
  }) {
    return AppSettings(
      language: language ?? this.language,
      themeMode: themeMode ?? this.themeMode,
    );
  }

  Locale get locale {
    switch (language) {
      case AppLanguage.arabic:
        return const Locale('ar');
      case AppLanguage.english:
        return const Locale('en');
    }
  }

  ThemeMode get materialThemeMode {
    switch (themeMode) {
      case AppThemeMode.light:
        return ThemeMode.light;
      case AppThemeMode.dark:
        return ThemeMode.dark;
      case AppThemeMode.system:
        return ThemeMode.system;
    }
  }
}

class SettingsService {
  static const String _languageKey = 'app_language';
  static const String _themeKey = 'app_theme';

  static Future<AppSettings> loadSettings() async {
    final prefs = await SharedPreferences.getInstance();
    
    final languageString = prefs.getString(_languageKey) ?? 'arabic';
    final themeString = prefs.getString(_themeKey) ?? 'system';

    final language = AppLanguage.values.firstWhere(
      (e) => e.name == languageString,
      orElse: () => AppLanguage.arabic,
    );

    final themeMode = AppThemeMode.values.firstWhere(
      (e) => e.name == themeString,
      orElse: () => AppThemeMode.system,
    );

    return AppSettings(
      language: language,
      themeMode: themeMode,
    );
  }

  static Future<void> saveLanguage(AppLanguage language) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_languageKey, language.name);
  }

  static Future<void> saveThemeMode(AppThemeMode themeMode) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_themeKey, themeMode.name);
  }
}