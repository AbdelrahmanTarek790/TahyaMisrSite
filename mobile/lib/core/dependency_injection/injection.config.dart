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
import 'package:tahya_misr_app/features/auth/presentation/bloc/auth_bloc.dart'
    as _i995;

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
    gh.factory<_i995.AuthBloc>(() => _i995.AuthBloc(
          loginUseCase: gh<_i718.LoginUseCase>(),
          registerUseCase: gh<_i102.RegisterUseCase>(),
          logoutUseCase: gh<_i998.LogoutUseCase>(),
          authRepository: gh<_i631.AuthRepository>(),
        ));
    return this;
  }
}
