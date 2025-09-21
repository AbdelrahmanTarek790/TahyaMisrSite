import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import '../bloc/join_request_cubit.dart';
import 'join_request_page.dart';

class JoinRequestPageWrapper extends StatelessWidget {
  const JoinRequestPageWrapper({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => GetIt.instance<JoinRequestCubit>(),
      child: const JoinRequestPage(),
    );
  }
}