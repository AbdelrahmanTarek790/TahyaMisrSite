import 'package:get_it/get_it.dart';
import 'package:injectable/injectable.dart';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:hive/hive.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:logger/logger.dart';
import '../../features/events/data/services/events_api_service.dart';
import '../../features/events/data/local/events_local_storage.dart';
import '../../features/events/data/repositories/events_repository.dart';
import '../../features/events/presentation/cubits/events_cubit.dart';
import '../../features/media/data/services/media_api_service.dart';
import '../../features/media/data/local/media_local_storage.dart';
import '../../features/media/data/repositories/media_repository.dart';
import '../../features/media/presentation/cubits/media_cubit.dart';
import '../../features/news/data/services/news_api_service.dart';
import '../../features/news/data/local/news_local_storage.dart';
import '../../features/news/data/repositories/news_repository.dart';
import '../../features/news/presentation/cubits/news_cubit.dart';
import '../../features/user_management/data/datasources/user_management_remote_data_source.dart';
import '../../features/user_management/data/repositories/user_management_repository_impl.dart';
import '../../features/user_management/domain/repositories/user_management_repository.dart';
import '../../features/user_management/domain/usecases/get_users.dart';
import '../../features/user_management/domain/usecases/get_user_by_id.dart';
import '../../features/user_management/domain/usecases/create_user.dart';
import '../../features/user_management/domain/usecases/update_user.dart';
import '../../features/user_management/domain/usecases/delete_user.dart';
import '../../features/user_management/presentation/bloc/user_management_bloc.dart';
import '../../features/positions/domain/usecases/get_positions_usecase.dart';
import '../../features/positions/domain/usecases/create_position_usecase.dart';
import '../../features/positions/domain/usecases/update_position_usecase.dart';
import '../../features/positions/domain/usecases/delete_position_usecase.dart';
import '../../features/positions/domain/repositories/position_repository.dart';
import '../../features/positions/data/repositories/position_repository_impl.dart';
import '../../features/positions/data/datasources/position_remote_data_source.dart';
import '../../features/positions/presentation/bloc/positions_bloc.dart';
import '../network/api_client.dart';
import '../network/network_info.dart';
import '../utils/app_router.dart';
import '../../features/auth/data/services/auth_api_service.dart';
import '../../features/auth/data/local/auth_local_storage.dart';
import '../../features/auth/data/repositories/auth_repository.dart';
import '../../features/auth/presentation/cubits/auth_cubit.dart';
import '../../features/dashboard/data/datasources/dashboard_remote_data_source.dart';
import '../../features/dashboard/data/repositories/dashboard_repository_impl.dart';
import '../../features/dashboard/domain/repositories/dashboard_repository.dart';
import '../../features/dashboard/domain/usecases/get_dashboard_stats_usecase.dart';
import '../../features/dashboard/domain/usecases/get_recent_activity_usecase.dart';
import '../../features/dashboard/presentation/bloc/dashboard_bloc.dart';
import '../../features/news/data/datasources/news_remote_data_source.dart';
import '../../features/news/data/repositories/news_repository_impl.dart';
import '../../features/news/domain/repositories/news_repository.dart';
import '../../features/news/domain/usecases/get_news_usecase.dart';
import '../../features/news/presentation/bloc/news_bloc.dart';


import '../utils/settings_cubit.dart';


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
          dateTimeFormat: DateTimeFormat.none,
        ),
      ),);

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

  getIt.registerLazySingleton<Box>(() => authBox, instanceName: 'authBox');
  getIt.registerLazySingleton<Box>(() => cacheBox, instanceName: 'cacheBox');
  getIt.registerLazySingleton<Box>(() => newsBox, instanceName: 'newsBox');
  getIt.registerLazySingleton<Box>(() => eventsBox, instanceName: 'eventsBox');
  getIt.registerLazySingleton<Box>(() => mediaBox, instanceName: 'mediaBox');

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
    ),);

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
    ),);

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

  // Router
  getIt.registerLazySingleton<AppRouter>(AppRouter.new);

  // Settings
  getIt.registerLazySingleton<SettingsCubit>(SettingsCubit.new);
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
  // User Management data source
  getIt.registerLazySingleton<UserManagementRemoteDataSource>(
    () => UserManagementRemoteDataSourceImpl(apiClient: getIt<ApiClient>()),
  );

  // User Management repository
  getIt.registerLazySingleton<UserManagementRepository>(
    () => UserManagementRepositoryImpl(
      remoteDataSource: getIt<UserManagementRemoteDataSource>(),
      networkInfo: getIt<NetworkInfo>(),
    ),
  );

  // User Management use cases
  getIt.registerLazySingleton<GetUsers>(
    () => GetUsers(getIt<UserManagementRepository>()),
  );

  getIt.registerLazySingleton<GetUserById>(
    () => GetUserById(getIt<UserManagementRepository>()),
  );

  getIt.registerLazySingleton<CreateUser>(
    () => CreateUser(getIt<UserManagementRepository>()),
  );

  getIt.registerLazySingleton<UpdateUser>(
    () => UpdateUser(getIt<UserManagementRepository>()),
  );

  getIt.registerLazySingleton<DeleteUser>(
    () => DeleteUser(getIt<UserManagementRepository>()),
  );

  // User Management bloc
  getIt.registerFactory<UserManagementBloc>(
    () => UserManagementBloc(
      getUsers: getIt<GetUsers>(),
      getUserById: getIt<GetUserById>(),
      createUser: getIt<CreateUser>(),
      updateUser: getIt<UpdateUser>(),
      deleteUser: getIt<DeleteUser>(),
    ),
  );
}

void _configurePositionsDependencies() {
  // Positions data source
  getIt.registerLazySingleton<PositionRemoteDataSource>(
    () => PositionRemoteDataSourceImpl(apiClient: getIt<ApiClient>()),
  );

  // Positions repository
  getIt.registerLazySingleton<PositionRepository>(
    () => PositionRepositoryImpl(
      remoteDataSource: getIt<PositionRemoteDataSource>(),
      networkInfo: getIt<NetworkInfo>(),
    ),
  );

  // Positions use cases
  getIt.registerLazySingleton<GetPositionsUseCase>(
    () => GetPositionsUseCase(getIt<PositionRepository>()),
  );

  getIt.registerLazySingleton<CreatePositionUseCase>(
    () => CreatePositionUseCase(getIt<PositionRepository>()),
  );

  getIt.registerLazySingleton<UpdatePositionUseCase>(
    () => UpdatePositionUseCase(getIt<PositionRepository>()),
  );

  getIt.registerLazySingleton<DeletePositionUseCase>(
    () => DeletePositionUseCase(getIt<PositionRepository>()),
  );

  // Positions bloc
  getIt.registerFactory<PositionsBloc>(
    () => PositionsBloc(
      getPositionsUseCase: getIt<GetPositionsUseCase>(),
      createPositionUseCase: getIt<CreatePositionUseCase>(),
      updatePositionUseCase: getIt<UpdatePositionUseCase>(),
      deletePositionUseCase: getIt<DeletePositionUseCase>(),
    ),
  );
}
