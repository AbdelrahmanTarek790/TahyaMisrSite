// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// InjectableConfigGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:get_it/get_it.dart' as _i174;
import 'package:injectable/injectable.dart' as _i526;
import 'package:tahya_misr_app/core/network/network_info.dart' as _i568;
import 'package:tahya_misr_app/features/auth/data/repositories/auth_repository.dart'
    as _i593;
import 'package:tahya_misr_app/features/auth/presentation/cubits/auth_cubit.dart'
    as _i299;
import 'package:tahya_misr_app/features/dashboard/data/repositories/dashboard_repository.dart'
    as _i910;
import 'package:tahya_misr_app/features/dashboard/presentation/cubits/dashboard_cubit.dart'
    as _i831;
import 'package:tahya_misr_app/features/events/data/repositories/events_repository.dart'
    as _i30;
import 'package:tahya_misr_app/features/events/presentation/cubits/events_cubit.dart'
    as _i302;
import 'package:tahya_misr_app/features/join_request/data/repositories/join_request_repository.dart'
    as _i511;
import 'package:tahya_misr_app/features/join_request/data/services/join_request_api_service.dart'
    as _i859;
import 'package:tahya_misr_app/features/join_request/presentation/cubits/join_request_cubit.dart'
    as _i717;
import 'package:tahya_misr_app/features/media/data/repositories/media_repository.dart'
    as _i301;
import 'package:tahya_misr_app/features/media/presentation/cubits/media_cubit.dart'
    as _i502;
import 'package:tahya_misr_app/features/news/data/repositories/news_repository.dart'
    as _i1031;
import 'package:tahya_misr_app/features/news/presentation/cubits/news_cubit.dart'
    as _i641;
import 'package:tahya_misr_app/features/positions/data/repositories/positions_repository.dart'
    as _i192;
import 'package:tahya_misr_app/features/positions/presentation/cubits/positions_cubit.dart'
    as _i88;
import 'package:tahya_misr_app/features/user_management/data/repositories/user_management_repository.dart'
    as _i81;
import 'package:tahya_misr_app/features/user_management/presentation/cubits/user_management_cubit.dart'
    as _i761;

extension GetItInjectableX on _i174.GetIt {
// initializes the registration of main-scope dependencies inside of GetIt
  _i174.GetIt init({
    String? environment,
    _i526.EnvironmentFilter? environmentFilter,
  }) {
    final gh = _i526.GetItHelper(
      this,
      environment,
      environmentFilter,
    );
    gh.factory<_i88.PositionsCubit>(() => _i88.PositionsCubit(
        positionsRepository: gh<_i192.PositionsRepository>()));
    gh.factory<_i302.EventsCubit>(
        () => _i302.EventsCubit(eventsRepository: gh<_i30.EventsRepository>()));
    gh.factory<_i761.UserManagementCubit>(
        () => _i761.UserManagementCubit(gh<_i81.UserManagementRepository>()));
    gh.factory<_i641.NewsCubit>(
        () => _i641.NewsCubit(newsRepository: gh<_i1031.NewsRepository>()));
    gh.factory<_i831.DashboardCubit>(() => _i831.DashboardCubit(
        dashboardRepository: gh<_i910.DashboardRepository>()));
    gh.factory<_i299.AuthCubit>(
        () => _i299.AuthCubit(authRepository: gh<_i593.AuthRepository>()));
    gh.factory<_i502.MediaCubit>(
        () => _i502.MediaCubit(mediaRepository: gh<_i301.MediaRepository>()));
    gh.factory<_i511.JoinRequestRepository>(
        () => _i511.JoinRequestRepositoryImpl(
              apiService: gh<_i859.JoinRequestApiService>(),
              networkInfo: gh<_i568.NetworkInfo>(),
            ));
    gh.factory<_i717.JoinRequestCubit>(() =>
        _i717.JoinRequestCubit(repository: gh<_i511.JoinRequestRepository>()));
    return this;
  }
}
