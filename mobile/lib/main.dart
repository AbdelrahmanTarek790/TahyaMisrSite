import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:get_it/get_it.dart';

import 'core/dependency_injection/injection.dart';
import 'core/utils/app_router.dart';
import 'core/constants/app_theme.dart';
import 'core/utils/bloc_observer.dart';
import 'features/auth/presentation/bloc/auth_bloc.dart';
import 'features/auth/presentation/bloc/auth_event.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Hive for local storage
  await Hive.initFlutter();

  // Configure dependency injection
  await configureDependencies();

  // Setup Bloc observer for debugging
  Bloc.observer = AppBlocObserver();

  runApp(const TahyaMisrApp());
}

class TahyaMisrApp extends StatelessWidget {
  const TahyaMisrApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(
          create: (context) => GetIt.instance<AuthBloc>()
            ..add(
              const AuthEvent.getCurrentUser(),
            ),
        ),
      ],
      child: MaterialApp.router(
        title: 'Tahya Misr App',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        themeMode: ThemeMode.system,
        routerConfig: GetIt.instance<AppRouter>().router,
      ),
    );
  }
}
