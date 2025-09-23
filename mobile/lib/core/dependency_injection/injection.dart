import 'package:get_it/get_it.dart';
import 'package:injectable/injectable.dart';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:hive/hive.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:logger/logger.dart';
import 'package:tahya_misr_app/features/events/domain/usecases/get_events_detail_usecase.dart';

import '../../features/events/data/repositories/event_repository_impl.dart';
import '../../features/events/domain/repositories/event_repository.dart';
import '../../features/events/domain/usecases/register_event_usecase.dart';
import '../../features/media/data/repositories/media_repository_impl.dart';
import '../../features/media/domain/repositories/media_repository.dart';
import '../../features/news/domain/usecases/get_news_detail_usecase.dart';
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
import '../../features/join_requests/data/repositories/join_request_repository_impl.dart';
import '../../features/join_requests/domain/repositories/join_request_repository.dart';
import '../../features/join_requests/domain/usecases/create_join_request_usecase.dart';
import '../../features/join_requests/domain/usecases/get_join_requests_usecase.dart';
import '../../features/join_requests/domain/usecases/approve_join_request_usecase.dart';
import '../../features/join_requests/domain/usecases/deny_join_request_usecase.dart';
import '../../features/join_requests/domain/usecases/delete_join_request_usecase.dart';
import '../../features/join_requests/presentation/bloc/join_request_bloc.dart';
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
import '../../features/news/data/datasources/news_remote_data_source.dart';
import '../../features/news/data/repositories/news_repository_impl.dart';
import '../../features/news/domain/repositories/news_repository.dart';
import '../../features/news/domain/usecases/get_news_usecase.dart';
import '../../features/news/presentation/bloc/news_bloc.dart';
import '../../features/events/data/datasources/events_remote_data_source.dart';
import '../../features/events/domain/usecases/get_events_usecase.dart';
import '../../features/events/presentation/bloc/events_bloc.dart';
import '../../features/media/data/datasources/media_remote_data_source.dart';
import '../../features/media/domain/usecases/get_media_usecase.dart';
import '../../features/media/presentation/bloc/media_bloc.dart';
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
  // News data source
  getIt.registerLazySingleton<NewsRemoteDataSource>(
    () => NewsRemoteDataSourceImpl(getIt<ApiClient>()),
  );

  // News repository
  getIt.registerLazySingleton<NewsRepository>(
    () => NewsRepositoryImpl(
      remoteDataSource: getIt<NewsRemoteDataSource>(),
    ),
  );

  // News use cases
  getIt.registerLazySingleton<GetNewsUseCase>(
    () => GetNewsUseCase(getIt<NewsRepository>()),
  );

  //News detail use case
  getIt.registerLazySingleton<GetNewsDetailUseCase>(
    () => GetNewsDetailUseCase(getIt<NewsRepository>()),
  );

  // News bloc
  getIt.registerFactory<NewsBloc>(
    () => NewsBloc(
      getNewsUseCase: getIt<GetNewsUseCase>(),
      getNewsDetailUseCase: getIt<GetNewsDetailUseCase>(),
    ),
  );
}

void _configureEventsDependencies() {
  // Events data source
  getIt.registerLazySingleton<EventsRemoteDataSource>(
    () => EventsRemoteDataSourceImpl(getIt<ApiClient>()),
  );

  // Events repository
  getIt.registerLazySingleton<EventRepository>(
    () => EventRepositoryImpl(
      remoteDataSource: getIt<EventsRemoteDataSource>(),
    ),
  );

  // Events use case
  getIt.registerLazySingleton<GetEventsUseCase>(
    () => GetEventsUseCase(getIt<EventRepository>()),
  );

//Events detail use case
  getIt.registerLazySingleton<GetEventsDetailUseCase>(
    () => GetEventsDetailUseCase(getIt<EventRepository>()),
  );

  //Events registration use case
  getIt.registerLazySingleton<RegisterEventUseCase>(
          () => RegisterEventUseCase(getIt<EventRepository>()),
  );
  // Events bloc
  getIt.registerFactory<EventsBloc>(
    () => EventsBloc(
      getEventsUseCase: getIt<GetEventsUseCase>(),
      getEventsDetailUseCase: getIt<GetEventsDetailUseCase>(),
      registerEventUseCase: getIt<RegisterEventUseCase>(),
    ),
  );
}

void _configureMediaDependencies() {
  // Media data source
  getIt.registerLazySingleton<MediaRemoteDataSource>(
    () => MediaRemoteDataSourceImpl(getIt<ApiClient>()),
  );

  // Media repository
  getIt.registerLazySingleton<MediaRepository>(
    () => MediaRepositoryImpl(
      remoteDataSource: getIt<MediaRemoteDataSource>(),
    ),
  );

  // Media use case
  getIt.registerLazySingleton<GetMediaUseCase>(
    () => GetMediaUseCase(getIt<MediaRepository>()),
  );

  // Media bloc
  getIt.registerFactory<MediaBloc>(
    () => MediaBloc(
      getMediaUseCase: getIt<GetMediaUseCase>(),
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
