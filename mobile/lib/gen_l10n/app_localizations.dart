import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_ar.dart';
import 'app_localizations_en.dart';

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'gen_l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml file to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you'll need to edit this
/// file.
///
/// First, open your project's ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project's Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the supportedLocales parameter
/// of your applications's MaterialApp.
abstract class AppLocalizations {
  AppLocalizations(String locale)
      : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
    delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
  ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('ar'),
    Locale('en'),
  ];

  String get password;
  String get passwordValidation;
  String get passwordValidationEmpty;

  String get appTitle;

  String get appSubTitle;

  String get welcomeTitle;
  String get dashboard;
  String get news;
  String get events;
  String get media;
  String get profile;
  String get settings;
  String get home;
  String get login;
  String get register;
  String get logout;
  String get userManagement;
  String get contentManagement;
  String get manageNews;
  String get manageEvents;
  String get manageMedia;
  String get welcomeAdmin;
  String get comprehensiveManagement;
  String get generalStats;
  String get totalUsers;
  String get publishedNews;
  String get mediaFiles;
  String get activeUsers;
  String get pendingEvents;
  String get quickActions;
  String get sendNotification;
  String get recentActivity;
  String get personalProfile;
  String get editProfile;
  String get accountSettings;
  String get appPreferences;
  String get language;
  String get theme;
  String get lightTheme;
  String get darkTheme;
  String get systemTheme;
  String get arabic;
  String get english;
  String get name;
  String get email;
  String get emailValidation;
  String get emailValidationEmpty;
  String get phone;
  String get university;
  String get governorate;
  String get role;
  String get save;
  String get cancel;
  String get delete;
  String get edit;
  String get add;
  String get create;
  String get update;
  String get confirm;
  String get confirmLogout;
  String get confirmDelete;
  String get success;
  String get error;
  String get loading;
  String get noData;
  String get tryAgain;
  String get latestNews;
  String get upcomingEvents;
  String get recentMedia;
  String get viewAll;
  String get readMore;
  String get eventDate;
  String get eventLocation;
  String get description;
  String get title;
  String get content;
  String get image;
  String get author;
  String get createdAt;
  String get updatedAt;
  String get positionManagement;
  String get createEvent;
  String get uploadMedia;
  String get caption;
  String get upload;
  String get location;
  String get date;

  String get createNews;

  String get titleRequired;

  String get excerpt;

  String get excerptRequired;

  String get contentRequired;

  String get imageUrl;

  String get imagePickerComingSoon;

  String get invalidImageUrl;

  String get nationalId;
  String get membershipNumber;

  String get notChangeRole;

  String get admin;
  String get volunteer;
  String get student;

  String get saveChanges;

  List<String> get governorates;

  String get subtitleEditProfile;

  String get notHaveAccount;

  String get registerTitle;
  String get registerSuccess;
  String get registerHeader;
  String get registerSubHeader;

  String get nameField;
  String get nameErrorEmpty;
  String get nameErrorShort;

  String get emailField;
  String get emailErrorEmpty;
  String get emailErrorInvalid;

  String get passwordField;
  String get passwordErrorEmpty;
  String get passwordErrorShort;

  String get confirmPasswordField;
  String get confirmPasswordErrorEmpty;
  String get confirmPasswordErrorMismatch;

  String get phoneField;
  String get phoneErrorInvalid;

  String get roleField;
  String get studentRole;
  String get volunteerRole;

  String get governorateField;
  String get governorateErrorEmpty;

  String get universityField;
  String get universityErrorEmpty;

  String get nationalIdField;
  String get nationalIdErrorInvalid;
  String get nationalIdErrorLength;
  String get nationalIdErrorStart;

  String get membershipNumberField;

  String get registerButton;

  String get alreadyHaveAccount;
  String get loginButton;

  String get participant;

  String get quickAccess;

  String get aboutTheUnion;

  String get showMore;

  String get showLess;

  String get vision;

  String get descriptionVision;

  String get goals;

  String get descriptionGoal;

  String get mission;

  String get descriptionMission;

  String get journeyUnion;

  String get activities;

  String get activitiesSubtitle;
  String get activitiesTitle;

  String get centralActivities;

  String get unionJourneyTitle;

  String get unionJourneySubtitle;


}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['ar', 'en'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'ar':
      return AppLocalizationsAr();
    case 'en':
      return AppLocalizationsEn();
  }

  throw FlutterError(
      'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
      'an issue with the localizations generation tool. Please file an issue on GitHub with a reproducible '
      'sample app and the gen-l10n configuration that would reproduce this issue.');
}
