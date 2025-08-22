import 'package:get_it/get_it.dart';
import 'package:injectable/injectable.dart';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:hive/hive.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:logger/logger.dart';

import '../network/api_client.dart';
import '../network/network_info.dart';
import '../utils/app_router.dart';
import '../../features/auth/data/datasources/auth_local_data_source.dart';
import '../../features/auth/data/datasources/auth_remote_data_source.dart';
import '../../features/auth/data/repositories/auth_repository_impl.dart';
import '../../features/auth/domain/repositories/auth_repository.dart';
import '../../features/auth/domain/usecases/login_usecase.dart';
import '../../features/auth/domain/usecases/register_usecase.dart';
import '../../features/auth/domain/usecases/logout_usecase.dart';
import '../../features/auth/domain/usecases/update_profile_usecase.dart';
import '../../features/auth/presentation/bloc/auth_bloc.dart';
import '../../features/dashboard/data/datasources/dashboard_remote_data_source.dart';
import '../../features/dashboard/data/repositories/dashboard_repository_impl.dart';
import '../../features/dashboard/domain/repositories/dashboard_repository.dart';
import '../../features/dashboard/domain/usecases/get_dashboard_stats_usecase.dart';
import '../../features/dashboard/domain/usecases/get_recent_activity_usecase.dart';
import '../../features/dashboard/presentation/bloc/dashboard_bloc.dart';

import 'injection.config.dart';

final GetIt getIt = GetIt.instance;

@InjectableInit()
Future<void> configureDependencies() async {
  // Core dependencies
  getIt.registerLazySingleton<Logger>(() => Logger(
        printer: PrettyPrinter(
          methodCount: 2,
          errorMethodCount: 8,
          lineLength: 120,
          colors: true,
          printEmojis: true,
          printTime: false,
        ),
      ));

  getIt.registerLazySingleton<Connectivity>(Connectivity.new);

  getIt.registerLazySingleton<NetworkInfo>(
    () => NetworkInfoImpl(getIt<Connectivity>()),
  );

  // Secure storage
  getIt.registerLazySingleton<FlutterSecureStorage>(
    () => const FlutterSecureStorage(
      aOptions: AndroidOptions(
        encryptedSharedPreferences: true,
      ),
      iOptions: IOSOptions(
        accessibility: KeychainAccessibility.first_unlock_this_device,
      ),
    ),
  );

  // Hive boxes
  final authBox = await Hive.openBox('auth');
  final cacheBox = await Hive.openBox('cache');

  getIt.registerLazySingleton<Box>(() => authBox, instanceName: 'authBox');
  getIt.registerLazySingleton<Box>(() => cacheBox, instanceName: 'cacheBox');

  // Dio configuration
  getIt.registerLazySingleton<Dio>(() {
    final dio = Dio();
    dio.options.baseUrl = 'https://form.codepeak.software/api/v1';
    dio.options.connectTimeout = const Duration(seconds: 30);
    dio.options.receiveTimeout = const Duration(seconds: 30);
    dio.options.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Add interceptors for logging and token management
    dio.interceptors.add(LogInterceptor(
      requestBody: true,
      responseBody: true,
      logPrint: (object) => getIt<Logger>().d(object),
    ));

    // Add token interceptor
    dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        // Add Authorization header if token exists
        try {
          final storage = getIt<FlutterSecureStorage>();
          final token = await storage.read(key: 'auth_token');
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
        } catch (e) {
          getIt<Logger>().e('Error getting token: $e');
        }
        handler.next(options);
      },
      onError: (error, handler) {
        // Handle 401 errors (unauthorized)
        if (error.response?.statusCode == 401) {
          // Token might be expired, could trigger logout here
          getIt<Logger>().w('Unauthorized request: ${error.response?.data}');
        }
        handler.next(error);
      },
    ));

    return dio;
  });

  // API Client
  getIt.registerLazySingleton<ApiClient>(() => ApiClient(getIt<Dio>()));

  // Data sources
  getIt.registerLazySingleton<AuthRemoteDataSource>(
    () => AuthRemoteDataSourceImpl(getIt<ApiClient>()),
  );

  getIt.registerLazySingleton<AuthLocalDataSource>(
    () => AuthLocalDataSourceImpl(
      getIt<FlutterSecureStorage>(),
      getIt<Box>(instanceName: 'authBox'),
    ),
  );

  // Repositories
  getIt.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(
      remoteDataSource: getIt<AuthRemoteDataSource>(),
      localDataSource: getIt<AuthLocalDataSource>(),
      networkInfo: getIt<NetworkInfo>(),
    ),
  );

  // Use cases
  getIt.registerLazySingleton<LoginUseCase>(
    () => LoginUseCase(getIt<AuthRepository>()),
  );

  getIt.registerLazySingleton<RegisterUseCase>(
    () => RegisterUseCase(getIt<AuthRepository>()),
  );

  getIt.registerLazySingleton<LogoutUseCase>(
    () => LogoutUseCase(getIt<AuthRepository>()),
  );

  getIt.registerLazySingleton<UpdateProfileUseCase>(
    () => UpdateProfileUseCase(getIt<AuthRepository>()),
  );

  // Blocs
  getIt.registerFactory<AuthBloc>(
    () => AuthBloc(
      loginUseCase: getIt<LoginUseCase>(),
      registerUseCase: getIt<RegisterUseCase>(),
      logoutUseCase: getIt<LogoutUseCase>(),
      updateProfileUseCase: getIt<UpdateProfileUseCase>(),
      authRepository: getIt<AuthRepository>(),
    ),
  );

  // Dashboard dependencies
  _configureDashboardDependencies();

  // Router
  getIt.registerLazySingleton<AppRouter>(() => AppRouter());
}

void _configureDashboardDependencies() {
  // Dashboard data source
  getIt.registerLazySingleton<DashboardRemoteDataSource>(
    () => DashboardRemoteDataSourceImpl(getIt<ApiClient>()),
  );

  // Dashboard repository
  getIt.registerLazySingleton<DashboardRepository>(
    () => DashboardRepositoryImpl(
      remoteDataSource: getIt<DashboardRemoteDataSource>(),
    ),
  );

  // Dashboard use cases
  getIt.registerLazySingleton<GetDashboardStatsUseCase>(
    () => GetDashboardStatsUseCase(getIt<DashboardRepository>()),
  );

  getIt.registerLazySingleton<GetRecentActivityUseCase>(
    () => GetRecentActivityUseCase(getIt<DashboardRepository>()),
  );

  // Dashboard bloc
  getIt.registerFactory<DashboardBloc>(
    () => DashboardBloc(
      getDashboardStatsUseCase: getIt<GetDashboardStatsUseCase>(),
      getRecentActivityUseCase: getIt<GetRecentActivityUseCase>(),
    ),
  );
}
