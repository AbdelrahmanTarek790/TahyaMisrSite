# Tahya Misr Mobile App

A Flutter mobile application for the Tahya Misr Students Union Platform, built with clean architecture and modern Flutter practices.

## Features

- **Clean Architecture**: Separation of concerns with domain, data, and presentation layers
- **State Management**: Bloc pattern with Cubit and Freezed for immutable state
- **Networking**: Retrofit for API calls with proper error handling
- **Local Storage**: Hive for caching and flutter_secure_storage for tokens
- **Navigation**: Go Router for declarative navigation
- **UI/UX**: Material 3 design with smooth animations using flutter_animate
- **Responsive Design**: Custom responsive layout without external packages
- **Pagination**: Infinite scroll pagination for better performance
- **Offline Support**: Local caching with network connectivity checking

## Architecture

```
lib/
├── core/
│   ├── constants/           # App constants and themes
│   ├── dependency_injection/ # GetIt setup for DI
│   ├── error/              # Error handling
│   ├── network/            # API client and network utilities
│   ├── usecases/           # Base use case interfaces
│   └── utils/              # Utility classes
├── features/
│   ├── auth/               # Authentication feature
│   ├── news/               # News feature
│   ├── events/             # Events feature
│   ├── media/              # Media gallery feature
│   └── profile/            # User profile feature
└── shared/
    ├── widgets/            # Reusable widgets
    ├── models/             # Shared models
    └── themes/             # Theme configurations
```

## Tech Stack

- **Flutter**: 3.16.0+ (Compatible stable version)
- **State Management**: flutter_bloc + freezed
- **Networking**: dio + retrofit
- **Local Storage**: hive + flutter_secure_storage
- **Navigation**: go_router
- **UI**: Material 3 + flutter_animate
- **DI**: get_it + injectable
- **Code Generation**: build_runner + json_serializable

> **📋 Package Compatibility Update**: All packages have been updated to ensure compatibility. See [COMPATIBILITY_UPDATE.md](COMPATIBILITY_UPDATE.md) for details.

## Dependencies

### Main Dependencies
- `flutter_bloc`: State management
- `freezed`: Immutable classes and unions
- `retrofit`: Type-safe HTTP client
- `dio`: HTTP client
- `hive`: Fast NoSQL database
- `flutter_secure_storage`: Secure key-value storage
- `go_router`: Declarative routing
- `flutter_animate`: Smooth animations
- `skeletonizer`: Shimmer loading effects
- `infinite_scroll_pagination`: Pagination support
- `get_it`: Dependency injection
- `connectivity_plus`: Network connectivity
- `logger`: Logging

### Dev Dependencies
- `build_runner`: Code generation
- `retrofit_generator`: Retrofit code generation
- `json_serializable`: JSON serialization
- `injectable_generator`: DI code generation
- `hive_generator`: Hive adapters
- `flutter_lints`: Linting rules

## Getting Started

### Prerequisites
- Flutter SDK 3.16.0 or higher (stable version)
- Dart SDK 3.0.0 or higher
- Android Studio / VS Code
- Android SDK / Xcode (for iOS)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AbdelrahmanTarek790/TahyaMisrSite.git
   cd TahyaMisrSite/mobile_app
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   ```

3. **Generate code**
   ```bash
   flutter packages pub run build_runner build
   ```

4. **Run the app**
   ```bash
   flutter run
   ```

### 🔧 Package Compatibility 

All packages have been updated to ensure compatibility between dependencies. The major changes include:

- **Stable package versions**: All packages now use stable, widely-supported versions
- **API compatibility**: Fixed breaking changes (e.g., Skeletonizer `enabled` parameter)
- **Flutter SDK**: Updated to realistic version (3.16.0+) instead of unrealistic 3.32.8

For detailed information about the compatibility updates, see [COMPATIBILITY_UPDATE.md](COMPATIBILITY_UPDATE.md).

### Code Generation

This project uses code generation for several features:

```bash
# Generate all code
flutter packages pub run build_runner build

# Watch for changes and generate automatically
flutter packages pub run build_runner watch

# Clean and rebuild
flutter packages pub run build_runner build --delete-conflicting-outputs
```

## API Integration

The app connects to the Tahya Misr backend API. Update the base URL in `lib/core/constants/app_constants.dart`:

```dart
static const String baseUrl = 'YOUR_API_BASE_URL';
```

## Authentication

The app supports JWT-based authentication with:
- User registration and login
- Secure token storage
- Automatic token refresh
- Role-based access control

## Features Overview

### Authentication
- Login with email/password
- User registration with governorate selection
- Secure token management
- Auto-login functionality

### News
- Browse news articles with pagination
- View detailed news content
- Offline reading with caching
- Share and bookmark articles

### Events
- Browse upcoming events
- Event registration
- Event details with location
- Calendar integration

### Media Gallery
- Photo and video gallery
- Upload media content
- Image viewer with zoom
- Media sharing

### Profile
- View and edit user profile
- Account settings
- Logout functionality
- User role display

## State Management

The app uses the BLoC pattern with Cubit for state management:

```dart
// Example Cubit usage
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  AuthBloc() : super(const AuthState.initial()) {
    on<LoginRequested>(_onLoginRequested);
  }
}
```

## Network Layer

API calls are handled through Retrofit with proper error handling:

```dart
@RestApi()
abstract class ApiClient {
  factory ApiClient(Dio dio) = _ApiClient;
  
  @GET('/news')
  Future<List<NewsModel>> getNews(@Query('page') int page);
}
```

## Local Storage

Data persistence using Hive for caching and Secure Storage for sensitive data:

```dart
// Caching data
await cacheBox.put('news', jsonEncode(newsList));

// Storing tokens securely
await secureStorage.write(key: 'token', value: token);
```

## Responsive Design

The app implements responsive design without external packages:

```dart
Widget build(BuildContext context) {
  final screenWidth = MediaQuery.of(context).size.width;
  final isTablet = screenWidth > 600;
  
  return isTablet ? TabletLayout() : MobileLayout();
}
```

## Animations

Smooth animations using flutter_animate:

```dart
Text('Hello')
  .animate()
  .fadeIn(duration: 600.ms)
  .slideY(begin: 0.3, end: 0);
```

## Testing

Run tests with:

```bash
flutter test
```

## Building

### Android
```bash
flutter build apk --release
```

### iOS
```bash
flutter build ios --release
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](../LICENSE) file for details.

## Support

For support and questions, please contact the Tahya Misr Students Union development team.

---

**Built with ❤️ for the Tahya Misr Students Union**