class AppConstants {
  // API
  static const String baseUrl = 'https://form.codepeak.software/api/v1';
  static const int connectTimeout = 30000;
  static const int receiveTimeout = 30000;

  // Pagination
  static const int defaultPageSize = 10;
  static const int maxPageSize = 50;

  // Cache keys
  static const String tokenKey = 'auth_token';
  static const String userKey = 'user_data';
  static const String newsKey = 'news_cache';
  static const String newsDetailKey = 'news_detail_cache';
  static const String eventsKey = 'events_cache';
  static const String mediaKey = 'media_cache';

  // Cache duration (in hours)
  static const int cacheValidDuration = 24;

  // Animation durations
  static const Duration shortAnimationDuration = Duration(milliseconds: 300);
  static const Duration mediumAnimationDuration = Duration(milliseconds: 500);
  static const Duration longAnimationDuration = Duration(milliseconds: 800);

  // File upload
  static const int maxFileSize = 5 * 1024 * 1024; // 5MB
  static const List<String> allowedImageTypes = ['jpg', 'jpeg', 'png', 'webp'];
  static const List<String> allowedVideoTypes = ['mp4', 'mov', 'avi'];

  //Images
  static const String logoPng = 'assets/images/logo/Logo.png';
  static const String logoJpg = 'assets/images/logo/Logo.jpg';
  static const String backgroundImage = 'assets/images/logo/background.jpg';
  static const String active1 = 'assets/images/active/active1.jpg';
  static const String active2 = 'assets/images/active/active2.jpg';
  static const String active3 = 'assets/images/active/active3.jpg';
  static const String active4 = 'assets/images/active/active4.jpg';
  static const String achievements1 =
      'assets/images/Achievements/Achievements1.jpg';
  static const String achievements2 =
      'assets/images/Achievements/Achievements2.jpg';
  static const String achievements3 =
      'assets/images/Achievements/Achievements3.jpg';
  static const String achievements4 =
      'assets/images/Achievements/Achievements4.jpg';
  static const String achievements5 =
      'assets/images/Achievements/Achievements5.jpg';
  static const String achievements6 =
      'assets/images/Achievements/Achievements6.jpg';
  static const String achievements7 =
      'assets/images/Achievements/Achievements7.jpg';
}
