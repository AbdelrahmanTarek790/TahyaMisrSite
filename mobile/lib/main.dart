import 'package:device_preview/device_preview.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hive_flutter/hive_flutter.dart';

import 'app.dart';
import 'core/dependency_injection/injection.dart';

import 'core/utils/bloc_observer.dart';


void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Hive for local storage
  await Hive.initFlutter();

  // Configure dependency injection
  await configureDependencies();

  // Setup Bloc observer for debugging

  Bloc.observer = AppBlocObserver();

  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
  ]);

  runApp(const TahyaMisrApp());
/*
  runApp(DevicePreview(
    enabled: !kReleaseMode,
    builder: (context) => const TahyaMisrApp(), // Wrap your app
  ),);*/
}


