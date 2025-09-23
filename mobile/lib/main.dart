import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:get_it/get_it.dart';

import 'core/dependency_injection/injection.dart';
import 'core/utils/app_router.dart';
import 'core/constants/app_theme.dart';
import 'core/utils/bloc_observer.dart';
import 'core/utils/settings_cubit.dart';
import 'core/utils/app_settings.dart';
import 'features/auth/presentation/cubits/auth_cubit.dart';
import 'gen_l10n/app_localizations.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Hive for local storage
  await Hive.initFlutter();

  // Configure dependency injection
  await configureDependencies();

  // Setup Bloc observer for debugging

  Bloc.observer = AppBlocObserver();

  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
  ]);
  
  runApp(const TahyaMisrApp());
}

class TahyaMisrApp extends StatelessWidget {
  const TahyaMisrApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(
          create: (context) => GetIt.instance<AuthCubit>()
            ..checkAuthStatus(),
        ),
        BlocProvider<SettingsCubit>(
          create: (context) => GetIt.instance<SettingsCubit>(),
        ),
      ],
      child: BlocBuilder<SettingsCubit, AppSettings>(
        builder: (context, settings) {
          return MaterialApp.router(
            title: 'Tahya Misr App',
            debugShowCheckedModeBanner: false,
            theme: AppTheme.lightTheme,
            darkTheme: AppTheme.darkTheme,
            themeMode: settings.materialThemeMode,
            themeAnimationCurve: Curves.easeInOut,
            themeAnimationDuration: const Duration(milliseconds: 300),
            locale: settings.locale,
            localizationsDelegates: const [
              AppLocalizations.delegate,
              GlobalMaterialLocalizations.delegate,
              GlobalWidgetsLocalizations.delegate,
              GlobalCupertinoLocalizations.delegate,
            ],
            supportedLocales: const [
              Locale('ar'), // Arabic
              Locale('en'), // English
            ],
            routerConfig: GetIt.instance<AppRouter>().router,
          );
        },
      ),
    );
  }
}
