import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import '../bloc/join_request_management_cubit.dart';
import 'join_request_management_page.dart';

class JoinRequestManagementPageWrapper extends StatelessWidget {
  const JoinRequestManagementPageWrapper({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => GetIt.instance<JoinRequestManagementCubit>(),
      child: const JoinRequestManagementPage(),
    );
  }
}