import 'package:get_it/get_it.dart';
import 'package:injectable/injectable.dart';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:hive/hive.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:logger/logger.dart';
import 'package:tahya_misr_app/shared/widgets/main_navigation.dart';

// Auth imports
import '../../features/auth/data/services/auth_api_service.dart';
import '../../features/auth/data/local/auth_local_storage.dart';
import '../../features/auth/data/repositories/auth_repository.dart';
import '../../features/auth/presentation/cubits/auth_cubit.dart';

// News imports
import '../../features/join_request/data/repositories/join_request_repository.dart';
import '../../features/join_request/data/services/join_request_api_service.dart';
import '../../features/join_request/presentation/cubits/join_request_cubit.dart';
import '../../features/news/data/services/news_api_service.dart';
import '../../features/news/data/local/news_local_storage.dart';
import '../../features/news/data/repositories/news_repository.dart';
import '../../features/news/presentation/cubits/news_cubit.dart';

// Events imports
import '../../features/events/data/services/events_api_service.dart';
import '../../features/events/data/local/events_local_storage.dart';
import '../../features/events/data/repositories/events_repository.dart';
import '../../features/events/presentation/cubits/events_cubit.dart';

// Media imports
import '../../features/media/data/services/media_api_service.dart';
import '../../features/media/data/local/media_local_storage.dart';
import '../../features/media/data/repositories/media_repository.dart';
import '../../features/media/presentation/cubits/media_cubit.dart';

// Dashboard imports
import '../../features/dashboard/data/services/dashboard_api_service.dart';
import '../../features/dashboard/data/local/dashboard_local_storage.dart';
import '../../features/dashboard/data/repositories/dashboard_repository.dart';
import '../../features/dashboard/presentation/cubits/dashboard_cubit.dart';

// Positions imports
import '../../features/positions/data/services/positions_api_service.dart';
import '../../features/positions/data/local/positions_local_storage.dart';
import '../../features/positions/data/repositories/positions_repository.dart';
import '../../features/positions/presentation/cubits/positions_cubit.dart';

// User Management imports
import '../../features/timeline/data/repositories/timeline_repository.dart';
import '../../features/timeline/data/services/timeline_api_service.dart';
import '../../features/timeline/presentation/cubits/timeline_cubit.dart';
import '../../features/user_management/data/repositories/user_management_repository.dart';
import '../../features/user_management/data/services/user_management_api_service.dart';
import '../../features/user_management/presentation/cubits/user_management_cubit.dart';

// Core imports
import '../network/api_client.dart';
import '../network/network_info.dart';
import '../utils/app_router.dart';
import '../utils/settings_cubit.dart';

final GetIt getIt = GetIt.instance;

@InjectableInit()
Future<void> configureDependencies() async {
  // Core dependencies
  getIt.registerLazySingleton<Logger>(
    () => Logger(
      printer: PrettyPrinter(
        methodCount: 2,
        errorMethodCount: 8,
        lineLength: 120,
        colors: true,
        printEmojis: true,
        dateTimeFormat: DateTimeFormat.none,
      ),
    ),
  );

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
  final newsBox = await Hive.openBox('news');
  final eventsBox = await Hive.openBox('events');
  final mediaBox = await Hive.openBox('media');
  final dashboardBox = await Hive.openBox('dashboard');
  final positionsBox = await Hive.openBox('positions');

  getIt.registerLazySingleton<Box>(() => authBox, instanceName: 'authBox');
  getIt.registerLazySingleton<Box>(() => cacheBox, instanceName: 'cacheBox');
  getIt.registerLazySingleton<Box>(() => newsBox, instanceName: 'newsBox');
  getIt.registerLazySingleton<Box>(() => eventsBox, instanceName: 'eventsBox');
  getIt.registerLazySingleton<Box>(() => mediaBox, instanceName: 'mediaBox');
  getIt.registerLazySingleton<Box>(
    () => dashboardBox,
    instanceName: 'dashboardBox',
  );
  getIt.registerLazySingleton<Box>(
    () => positionsBox,
    instanceName: 'positionsBox',
  );

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
    dio.interceptors.add(
      LogInterceptor(
        requestBody: true,
        responseBody: true,
        logPrint: (object) => getIt<Logger>().d(object),
      ),
    );

    // Add token interceptor
    dio.interceptors.add(
      InterceptorsWrapper(
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
      ),
    );

    return dio;
  });

  // API Client
  getIt.registerLazySingleton<ApiClient>(() => ApiClient(getIt<Dio>()));

  // Auth API Service
  getIt.registerLazySingleton<AuthApiService>(
    () => AuthApiService(getIt<ApiClient>()),
  );

  // Auth Local Storage
  getIt.registerLazySingleton<AuthLocalStorage>(
    () => AuthLocalStorage(
      getIt<FlutterSecureStorage>(),
      getIt<Box>(instanceName: 'authBox'),
    ),
  );

  // Auth Repository
  getIt.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(
      apiService: getIt<AuthApiService>(),
      localStorage: getIt<AuthLocalStorage>(),
      networkInfo: getIt<NetworkInfo>(),
    ),
  );

  // Auth Cubit
  getIt.registerFactory<AuthCubit>(
    () => AuthCubit(
      authRepository: getIt<AuthRepository>(),
    ),
  );

  // Show Toast Notifications
  getIt.registerLazySingleton<ShowToast> (
    () => ShowToast(),
  );
  // Dashboard dependencies
  _configureDashboardDependencies();

  // News dependencies
  _configureNewsDependencies();

  // Events dependencies
  _configureEventsDependencies();

  // Media dependencies
  _configureMediaDependencies();

  // User Management dependencies
  _configureUserManagementDependencies();

  // Positions dependencies
  _configurePositionsDependencies();

  // Timeline dependencies
  _configureTimelineDependencies();

  // Router
  getIt.registerLazySingleton<AppRouter>(AppRouter.new);

  // Settings
  getIt.registerLazySingleton<SettingsCubit>(SettingsCubit.new);
}

void _configureDashboardDependencies() {
  // Dashboard API Service
  getIt.registerLazySingleton<DashboardApiService>(
    () => DashboardApiService(getIt<ApiClient>()),
  );

  // Dashboard Local Storage
  getIt.registerLazySingleton<DashboardLocalStorage>(
    () => DashboardLocalStorage(getIt<Box>(instanceName: 'dashboardBox')),
  );

  // Dashboard repository
  getIt.registerLazySingleton<DashboardRepository>(
    () => DashboardRepositoryImpl(
      apiService: getIt<DashboardApiService>(),
      localStorage: getIt<DashboardLocalStorage>(),
      networkInfo: getIt<NetworkInfo>(),
    ),
  );

  // Dashboard cubit
  getIt.registerFactory<DashboardCubit>(
    () => DashboardCubit(
      dashboardRepository: getIt<DashboardRepository>(),
    ),
  );
}

void _configureNewsDependencies() {
  // News API Service
  getIt.registerLazySingleton<NewsApiService>(
    () => NewsApiService(getIt<ApiClient>()),
  );

  // News Local Storage
  getIt.registerLazySingleton<NewsLocalStorage>(
    () => NewsLocalStorage(getIt<Box>(instanceName: 'newsBox')),
  );

  // News repository
  getIt.registerLazySingleton<NewsRepository>(
    () => NewsRepositoryImpl(
      apiService: getIt<NewsApiService>(),
      localStorage: getIt<NewsLocalStorage>(),
      networkInfo: getIt<NetworkInfo>(),
    ),
  );

  // News cubit
  getIt.registerFactory<NewsCubit>(
    () => NewsCubit(
      newsRepository: getIt<NewsRepository>(),
    ),
  );
}

void _configureEventsDependencies() {
  // Events API Service
  getIt.registerLazySingleton<EventsApiService>(
    () => EventsApiService(getIt<ApiClient>()),
  );

  // Events Local Storage
  getIt.registerLazySingleton<EventsLocalStorage>(
    () => EventsLocalStorage(getIt<Box>(instanceName: 'eventsBox')),
  );

  // Events repository
  getIt.registerLazySingleton<EventsRepository>(
    () => EventsRepositoryImpl(
      apiService: getIt<EventsApiService>(),
      localStorage: getIt<EventsLocalStorage>(),
      networkInfo: getIt<NetworkInfo>(),
    ),
  );

  // Events cubit
  getIt.registerFactory<EventsCubit>(
    () => EventsCubit(
      eventsRepository: getIt<EventsRepository>(),
    ),
  );
}

void _configureMediaDependencies() {
  // Media API Service
  getIt.registerLazySingleton<MediaApiService>(
    () => MediaApiService(getIt<ApiClient>()),
  );

  // Media Local Storage
  getIt.registerLazySingleton<MediaLocalStorage>(
    () => MediaLocalStorage(getIt<Box>(instanceName: 'mediaBox')),
  );

  // Media repository
  getIt.registerLazySingleton<MediaRepository>(
    () => MediaRepositoryImpl(
      apiService: getIt<MediaApiService>(),
      localStorage: getIt<MediaLocalStorage>(),
      networkInfo: getIt<NetworkInfo>(),
    ),
  );

  // Media cubit
  getIt.registerFactory<MediaCubit>(
    () => MediaCubit(
      mediaRepository: getIt<MediaRepository>(),
    ),
  );
}

void _configureUserManagementDependencies() {
  // User Management API Service
  getIt.registerLazySingleton<UserManagementApiService>(
    () => UserManagementApiService(getIt<ApiClient>()),
  );

  // User Management repository
  getIt.registerLazySingleton<UserManagementRepository>(
    () => UserManagementRepositoryImpl(
      apiService: getIt<UserManagementApiService>(),
      networkInfo: getIt<NetworkInfo>(),
    ),
  );
  // User Management cubit
  getIt.registerFactory<UserManagementCubit>(
    () => UserManagementCubit(getIt<UserManagementRepository>()),
  );
}

void _configurePositionsDependencies() {
  // Positions API Service
  getIt.registerLazySingleton<PositionsApiService>(
    () => PositionsApiService(getIt<ApiClient>()),
  );

  // Positions Local Storage
  getIt.registerLazySingleton<PositionsLocalStorage>(
    () => PositionsLocalStorage(getIt<Box>(instanceName: 'positionsBox')),
  );

  // Positions repository
  getIt.registerLazySingleton<PositionsRepository>(
    () => PositionsRepositoryImpl(
      apiService: getIt<PositionsApiService>(),
      localStorage: getIt<PositionsLocalStorage>(),
      networkInfo: getIt<NetworkInfo>(),
    ),
  );

  // Positions cubit
  getIt.registerFactory<PositionsCubit>(
    () => PositionsCubit(
      positionsRepository: getIt<PositionsRepository>(),
    ),
  );

  // Join Request API Service
  getIt.registerLazySingleton<JoinRequestApiService>(
        () => JoinRequestApiService(getIt<ApiClient>()),
  );

  // Join Request Repository
  getIt.registerLazySingleton<JoinRequestRepository>(
        () => JoinRequestRepositoryImpl(
      apiService: getIt<JoinRequestApiService>(),
      networkInfo: getIt<NetworkInfo>(),
    ),
  );

  // Join Request Cubit
  getIt.registerFactory<JoinRequestCubit>(
        () => JoinRequestCubit(
      repository: getIt<JoinRequestRepository>(),
    ),
  );
}

void _configureTimelineDependencies() {
  // Timeline API Service
  getIt.registerLazySingleton<TimelineApiService>(
        () => TimelineApiService(getIt<ApiClient>()),
  );

  // Timeline repository
  getIt.registerLazySingleton<TimelineRepository>(
        () => TimelineRepository(getIt<TimelineApiService>()),
  );

  // Timeline cubit
  getIt.registerFactory<TimelineCubit>(
        () => TimelineCubit(
      timelineRepository: getIt<TimelineRepository>(),
    ),
  );
}
