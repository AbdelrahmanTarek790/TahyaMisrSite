# Timeline Feature Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND (Node.js)                        │
│                                                                  │
│  ┌────────────────┐    ┌──────────────┐    ┌────────────────┐ │
│  │  Timeline.js   │───▶│  Controller  │───▶│    Routes      │ │
│  │   (Model)      │    │  (Business   │    │  (API Paths)   │ │
│  │                │    │   Logic)     │    │                │ │
│  └────────────────┘    └──────────────┘    └────────────────┘ │
│         │                      │                     │          │
│         ▼                      ▼                     ▼          │
│    MongoDB              CRUD Operations      /api/v1/timeline   │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ HTTP/REST API
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
┌──────────────────────────────┐  ┌──────────────────────────────┐
│    WEB CLIENT (React)        │  │   MOBILE APP (Flutter)       │
│                              │  │                              │
│  ┌─────────────────────────┐│  │  ┌─────────────────────────┐│
│  │  Admin Dashboard        ││  │  │  About Us Screen        ││
│  │  - TimelineManagement   ││  │  │  - MilestonesTimeline   ││
│  │    - Create             ││  │  │    Widget               ││
│  │    - Read               ││  │  │                         ││
│  │    - Update             ││  │  │  ┌──────────────────┐  ││
│  │    - Delete             ││  │  │  │  TimelineCubit   │  ││
│  │                         ││  │  │  │  (State Mgmt)    │  ││
│  └─────────────────────────┘│  │  │  └──────────────────┘  ││
│                              │  │  │          │              ││
│  ┌─────────────────────────┐│  │  │          ▼              ││
│  │  Public Journey Page    ││  │  │  ┌──────────────────┐  ││
│  │  - Display Timeline     ││  │  │  │  Timeline        │  ││
│  │  - Interactive View     ││  │  │  │  Repository      │  ││
│  └─────────────────────────┘│  │  │  └──────────────────┘  ││
│              │               │  │  │          │              ││
│              ▼               │  │  │          ▼              ││
│  ┌─────────────────────────┐│  │  │  ┌──────────────────┐  ││
│  │  timelineAPI (Axios)    ││  │  │  │  Timeline        │  ││
│  │  - getAll()             ││  │  │  │  ApiService      │  ││
│  │  - create()             ││  │  │  └──────────────────┘  ││
│  │  - update()             ││  │  │          │              ││
│  │  - delete()             ││  │  │          ▼              ││
│  └─────────────────────────┘│  │  │  ┌──────────────────┐  ││
│                              │  │  │  │  ApiClient       │  ││
│                              │  │  │  │  (Retrofit)      │  ││
│                              │  │  │  └──────────────────┘  ││
└──────────────────────────────┘  └──────────────────────────────┘
```

## Mobile App Data Flow (Detailed)

```
┌────────────────────────────────────────────────────────────────┐
│                        UI LAYER                                 │
│                                                                 │
│  AboutUsScreen                                                  │
│    └─▶ MilestonesTimelineWidget                               │
│         ├─▶ initState() calls getTimeline()                   │
│         └─▶ BlocBuilder<TimelineCubit, TimelineState>         │
│              ├─▶ TimelineInitial → SizedBox.shrink()          │
│              ├─▶ TimelineLoading → CircularProgressIndicator  │
│              ├─▶ TimelineLoaded → Display Timeline Items      │
│              │    └─▶ BuildMilestonesWidget (per item)       │
│              └─▶ TimelineError → Error message + Retry button │
└────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────────┐
│                    STATE MANAGEMENT LAYER                       │
│                                                                 │
│  TimelineCubit extends Cubit<TimelineState>                   │
│    ├─▶ getTimeline()                                          │
│    │    ├─▶ emit(TimelineLoading())                          │
│    │    ├─▶ call repository.getTimeline()                    │
│    │    └─▶ emit(TimelineLoaded(timeline))                   │
│    │         or emit(TimelineError(message))                  │
│    │                                                           │
│    └─▶ refreshTimeline()                                      │
│         └─▶ calls getTimeline()                               │
└────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────────┐
│                      REPOSITORY LAYER                           │
│                                                                 │
│  TimelineRepository                                             │
│    └─▶ getTimeline(page, limit)                               │
│         ├─▶ call apiService.getTimeline()                     │
│         └─▶ return Either<Failure, List<TimelineModel>>       │
│              ├─▶ Right(timeline) on success                   │
│              └─▶ Left(ServerFailure) on error                 │
└────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────────┐
│                       API SERVICE LAYER                         │
│                                                                 │
│  TimelineApiService                                             │
│    └─▶ getTimeline(page, limit)                               │
│         ├─▶ call apiClient.getTimeline(page, limit)           │
│         ├─▶ parse response.data['timeline']                   │
│         └─▶ return List<TimelineModel>                        │
│              └─▶ TimelineModel.fromJson() per item            │
└────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────────┐
│                       NETWORK LAYER                             │
│                                                                 │
│  ApiClient (Retrofit)                                           │
│    └─▶ @GET('/timeline')                                       │
│         └─▶ Dio HTTP request                                   │
│              ├─▶ Base URL: https://form.codepeak.software/api/v1│
│              ├─▶ Headers: Authorization: Bearer {token}        │
│              └─▶ Query params: ?page=1&limit=100              │
└────────────────────────────────────────────────────────────────┘
                             │
                             ▼
                      Backend API Response
```

## Dependency Injection Flow

```
┌────────────────────────────────────────────────────────────────┐
│                    GetIt (Service Locator)                      │
│                                                                 │
│  configureDependencies()                                        │
│    ├─▶ Register Dio                                            │
│    │    └─▶ with interceptors (auth, logging)                 │
│    │                                                            │
│    ├─▶ Register ApiClient                                      │
│    │    └─▶ ApiClient(getIt<Dio>())                           │
│    │                                                            │
│    └─▶ _configureTimelineDependencies()                       │
│         │                                                       │
│         ├─▶ Register TimelineApiService (Singleton)           │
│         │    └─▶ TimelineApiService(getIt<ApiClient>())       │
│         │                                                       │
│         ├─▶ Register TimelineRepository (Singleton)           │
│         │    └─▶ TimelineRepository(getIt<TimelineApiService>())│
│         │                                                       │
│         └─▶ Register TimelineCubit (Factory)                  │
│              └─▶ TimelineCubit(timelineRepository: getIt())   │
└────────────────────────────────────────────────────────────────┘
```

## Route Provider Flow

```
┌────────────────────────────────────────────────────────────────┐
│                        App Router                               │
│                                                                 │
│  GoRoute(path: '/about-us')                                    │
│    └─▶ builder: (context, state) => BlocProvider(             │
│         create: (_) => getIt<TimelineCubit>(),                │
│         child: const AboutUsScreen(),                          │
│       )                                                         │
│                                                                 │
│  When user navigates to /about-us:                             │
│    1. BlocProvider creates new TimelineCubit instance         │
│    2. TimelineCubit injected with dependencies via GetIt      │
│    3. AboutUsScreen and children can access cubit via context │
│    4. MilestonesTimelineWidget calls cubit.getTimeline()      │
└────────────────────────────────────────────────────────────────┘
```

## Data Model Structure

```
┌────────────────────────────────────────────────────────────────┐
│                      TimelineModel                              │
│                                                                 │
│  Fields:                                                        │
│    • String id         (from backend _id)                      │
│    • String year       (e.g., "2024")                         │
│    • String title      (e.g., "Major Achievement")            │
│    • String description (detailed description)                 │
│    • String achievement (multi-line bullet points)            │
│    • int order         (for sorting)                          │
│    • DateTime createdAt                                        │
│    • DateTime updatedAt                                        │
│                                                                 │
│  Methods:                                                       │
│    • fromJson(Map<String, dynamic>)                           │
│      ├─▶ Handles _id → id mapping                            │
│      ├─▶ Parses DateTime strings                             │
│      └─▶ Provides fallback for missing fields                │
│                                                                 │
│    • toJson() → Map<String, dynamic>                          │
│                                                                 │
│  Achievement Parsing:                                           │
│    "Line 1\nLine 2\nLine 3"                                    │
│      └─▶ split('\n')                                           │
│           └─▶ filter empty lines                               │
│                └─▶ ["Line 1", "Line 2", "Line 3"]            │
│                     └─▶ Display as bullet points              │
└────────────────────────────────────────────────────────────────┘
```

## State Machine

```
┌─────────────┐
│   Initial   │ (Widget first created)
└──────┬──────┘
       │
       │ initState() calls getTimeline()
       ▼
┌─────────────┐
│   Loading   │ (Show CircularProgressIndicator)
└──────┬──────┘
       │
       │ API Response
       │
   ┌───┴───┐
   │       │
   ▼       ▼
┌──────┐ ┌──────┐
│Loaded│ │Error │
└──────┘ └──────┘
   │       │
   │       │ User taps Retry
   │       └──────────────┐
   │                      │
   │ User pulls to refresh│
   └──────────────┬───────┘
                  │
                  ▼
            Back to Loading
```

## UI State Mapping

```
TimelineState → Widget
├─▶ TimelineInitial → SizedBox.shrink()
├─▶ TimelineLoading → CircularProgressIndicator
├─▶ TimelineLoaded
│   ├─▶ Empty list → "No timeline events" message
│   └─▶ With items → Column of BuildMilestonesWidget
│        ├─▶ Title: "{year} - {title}"
│        ├─▶ Description: {description}
│        └─▶ Bullet points: {achievement.split('\n')}
└─▶ TimelineError
    ├─▶ Error icon
    ├─▶ Error message
    └─▶ Retry button → calls refreshTimeline()
```

## Error Handling Strategy

```
┌────────────────────────────────────────────────────────────────┐
│                     Error Flow                                  │
│                                                                 │
│  Network Error / API Failure                                   │
│    │                                                            │
│    ├─▶ TimelineApiService catches exception                   │
│    │    └─▶ throws ServerException(message)                   │
│    │                                                            │
│    └─▶ TimelineRepository catches ServerException             │
│         └─▶ returns Left(ServerFailure(message))              │
│              │                                                  │
│              └─▶ TimelineCubit handles failure                │
│                   └─▶ emit(TimelineError(message))            │
│                        │                                        │
│                        └─▶ UI shows error state                │
│                             ├─▶ Error message                  │
│                             └─▶ Retry button                   │
│                                  └─▶ calls refreshTimeline()   │
│                                       └─▶ Back to Loading      │
└────────────────────────────────────────────────────────────────┘
```

## Key Design Patterns

### 1. Repository Pattern
- Abstracts data source (API, cache, etc.)
- Returns Either<Failure, Success> for explicit error handling
- Allows easy testing and mocking

### 2. BLoC/Cubit Pattern
- Separates business logic from UI
- Reactive state management
- Easy to test and maintain

### 3. Dependency Injection
- GetIt service locator
- Lazy singletons for services
- Factory pattern for cubits (new instance per screen)

### 4. Clean Architecture Layers
- Presentation (UI + Cubit)
- Domain (Models)
- Data (Repository + API Service)
- Network (ApiClient)

## Testing Strategy

### Unit Tests
- TimelineModel JSON parsing
- TimelineRepository success/failure cases
- TimelineCubit state transitions

### Widget Tests
- MilestonesTimelineWidget states
- BuildMilestonesWidget rendering
- User interactions (tap, expand)

### Integration Tests
- End-to-end flow: API → UI
- Error scenarios
- Retry functionality

## Performance Considerations

1. **Caching**: Timeline data doesn't change frequently
   - Could add local storage layer
   - Cache invalidation strategy

2. **Pagination**: Large timeline lists
   - Backend supports pagination (page, limit)
   - Frontend loads all (limit=100)
   - Could implement infinite scroll

3. **Memory**: Timeline models are lightweight
   - Only text data, no images
   - Safe to load all in memory

4. **Network**: Efficient API calls
   - One call per screen load
   - Pull-to-refresh for updates
   - No polling or real-time updates needed
