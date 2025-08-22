// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// InjectableConfigGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:get_it/get_it.dart' as _i174;
import 'package:injectable/injectable.dart' as _i526;
import 'package:tahya_misr_app/features/auth/domain/repositories/auth_repository.dart'
    as _i631;
import 'package:tahya_misr_app/features/auth/domain/usecases/login_usecase.dart'
    as _i718;
import 'package:tahya_misr_app/features/auth/domain/usecases/logout_usecase.dart'
    as _i998;
import 'package:tahya_misr_app/features/auth/domain/usecases/register_usecase.dart'
    as _i102;
import 'package:tahya_misr_app/features/auth/domain/usecases/update_profile_usecase.dart'
    as _i215;
import 'package:tahya_misr_app/features/auth/presentation/bloc/auth_bloc.dart'
    as _i995;
import 'package:tahya_misr_app/features/dashboard/data/datasources/dashboard_remote_data_source.dart'
    as _i19;
import 'package:tahya_misr_app/features/dashboard/data/repositories/dashboard_repository_impl.dart'
    as _i743;
import 'package:tahya_misr_app/features/dashboard/domain/repositories/dashboard_repository.dart'
    as _i332;
import 'package:tahya_misr_app/features/dashboard/domain/usecases/get_dashboard_stats_usecase.dart'
    as _i994;
import 'package:tahya_misr_app/features/dashboard/domain/usecases/get_recent_activity_usecase.dart'
    as _i178;
import 'package:tahya_misr_app/features/dashboard/presentation/bloc/dashboard_bloc.dart'
    as _i891;

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
    gh.lazySingleton<_i332.DashboardRepository>(() =>
        _i743.DashboardRepositoryImpl(
            remoteDataSource: gh<_i19.DashboardRemoteDataSource>()));
    gh.factory<_i995.AuthBloc>(() => _i995.AuthBloc(
          loginUseCase: gh<_i718.LoginUseCase>(),
          registerUseCase: gh<_i102.RegisterUseCase>(),
          logoutUseCase: gh<_i998.LogoutUseCase>(),
          updateProfileUseCase: gh<_i215.UpdateProfileUseCase>(),
          authRepository: gh<_i631.AuthRepository>(),
        ));
    gh.factory<_i994.GetDashboardStatsUseCase>(
        () => _i994.GetDashboardStatsUseCase(gh<_i332.DashboardRepository>()));
    gh.factory<_i178.GetRecentActivityUseCase>(
        () => _i178.GetRecentActivityUseCase(gh<_i332.DashboardRepository>()));
    gh.factory<_i891.DashboardBloc>(() => _i891.DashboardBloc(
          getDashboardStatsUseCase: gh<_i994.GetDashboardStatsUseCase>(),
          getRecentActivityUseCase: gh<_i178.GetRecentActivityUseCase>(),
        ));
    return this;
  }
}
