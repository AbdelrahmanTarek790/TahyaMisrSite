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

  String idUser  = '';
}