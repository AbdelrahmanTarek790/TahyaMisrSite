import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:get_it/get_it.dart';
import 'package:sizer/sizer.dart';

import 'core/constants/app_theme.dart';
import 'core/utils/app_router.dart';
import 'core/utils/app_settings.dart';
import 'core/utils/settings_cubit.dart';
import 'features/auth/presentation/cubits/auth_cubit.dart';
import 'features/dashboard/presentation/cubits/dashboard_cubit.dart';
import 'gen_l10n/app_localizations.dart';

class TahyaMisrApp extends StatelessWidget {
  const TahyaMisrApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(
          create: (context) => GetIt.instance<AuthCubit>()..checkAuthStatus(),
        ),
        BlocProvider<SettingsCubit>(
          create: (context) => GetIt.instance<SettingsCubit>(),
        ),
        BlocProvider<DashboardCubit>(
          create: (context) => GetIt.instance<DashboardCubit>(),
        ),
      ],
      child: BlocBuilder<SettingsCubit, AppSettings>(
        builder: (context, settings) {
          return Sizer(
            builder: (context, orientation, screenType) =>
            MaterialApp.router(
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
            ),
          );
        },
      ),
    );
  }
}