# Timeline Integration Documentation

## Overview
This document describes the Timeline feature integration across the entire application stack - backend, web client, and mobile app.

## Architecture

### Backend (Node.js/Express/MongoDB)
- **Model**: `models/Timeline.js`
  - Fields: year, title, description, achievement, order
  - Timestamps: createdAt, updatedAt
  - Indexed by: order, year, createdAt

- **Controller**: `controllers/timelineController.js`
  - GET /api/v1/timeline - Get all timeline events (public)
  - GET /api/v1/timeline/:id - Get single timeline event (public)
  - POST /api/v1/timeline - Create timeline event (admin only)
  - PUT /api/v1/timeline/:id - Update timeline event (admin only)
  - DELETE /api/v1/timeline/:id - Delete timeline event (admin only)

- **Routes**: `routes/timeline.js`
  - Routes registered in `server.js`

### Web Client (React/Vite)
- **Admin Dashboard**: `client/src/pages/admin/TimelineManagement.jsx`
  - Full CRUD operations for timeline events
  - Form validation with Zod
  - Grid view with cards
  - Create/Edit sheet component

- **Public Journey Page**: `client/src/pages/public/Journy.jsx`
  - Displays timeline events
  - Interactive timeline navigation
  - Loading and error states
  - Fallback data if API fails

- **API Integration**: `client/src/api/index.js`
  - `timelineAPI.getAll()` - Fetch all timeline events
  - `timelineAPI.getById(id)` - Fetch single event
  - `timelineAPI.create(data)` - Create new event
  - `timelineAPI.update(id, data)` - Update event
  - `timelineAPI.delete(id)` - Delete event

### Mobile App (Flutter/Dart)
- **Data Layer**:
  - `mobile/lib/features/timeline/data/models/timeline_model.dart` - Timeline model with JSON serialization
  - `mobile/lib/features/timeline/data/services/timeline_api_service.dart` - API service
  - `mobile/lib/features/timeline/data/repositories/timeline_repository.dart` - Repository pattern

- **State Management**:
  - `mobile/lib/features/timeline/presentation/cubits/timeline_cubit.dart` - Cubit for state management
  - `mobile/lib/features/timeline/presentation/cubits/timeline_state.dart` - State classes

- **UI Integration**:
  - `mobile/lib/features/about_us_screen/widgets/milestones_timeline_widget.dart` - Updated to fetch from backend
  - `mobile/lib/features/about_us_screen/widgets/build_milestones_widget.dart` - Displays individual timeline items

- **Dependency Injection**:
  - Updated `mobile/lib/core/dependency_injection/injection.dart` to register Timeline dependencies
  - Updated `mobile/lib/core/utils/app_router.dart` to provide TimelineCubit to AboutUsScreen

- **API Client**:
  - Updated `mobile/lib/core/network/api_client.dart` to add Timeline endpoints

## Features

### For Administrators (Web Dashboard)
1. **Create Timeline Events**
   - Year, title, description, achievement, order
   - Form validation
   - Success/error feedback

2. **View Timeline Events**
   - Grid view with cards
   - Shows year, title, and description
   - Order-based sorting

3. **Edit Timeline Events**
   - Pre-filled form with existing data
   - Update functionality

4. **Delete Timeline Events**
   - Confirmation dialog
   - Permanent deletion

### For Users (Web & Mobile)
1. **View Timeline**
   - Interactive timeline display
   - Year-based navigation
   - Expandable details
   - Achievement bullet points

2. **Mobile Experience**
   - Pull-to-refresh
   - Loading states
   - Error handling with retry
   - Smooth animations
   - RTL support

## Data Flow

### Backend to Frontend
1. Admin creates/updates timeline event via web dashboard
2. Data stored in MongoDB
3. Changes immediately available via API
4. Web Journey page fetches updated data
5. Mobile app fetches updated data on next refresh

### Mobile App Flow
1. User navigates to "About Us" screen
2. MilestonesTimelineWidget initializes and calls `TimelineCubit.getTimeline()`
3. TimelineCubit calls TimelineRepository
4. TimelineRepository calls TimelineApiService
5. TimelineApiService makes HTTP request to backend
6. Response parsed into TimelineModel list
7. State updated with loaded data
8. UI rebuilds to display timeline events

## Testing

### Backend Testing
```bash
# Test GET all timeline events
curl http://localhost:5000/api/v1/timeline

# Test GET single timeline event
curl http://localhost:5000/api/v1/timeline/{id}

# Test POST create timeline event (requires authentication)
curl -X POST http://localhost:5000/api/v1/timeline \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "year": "2024",
    "title": "Test Event",
    "description": "Test description",
    "achievement": "Test achievement\nAnother point",
    "order": 1
  }'
```

### Web Client Testing
1. Login as admin
2. Navigate to Timeline Management
3. Create new timeline event
4. Verify event appears in list
5. Edit event and verify changes
6. Navigate to public Journey page
7. Verify event displays correctly
8. Delete event and verify removal

### Mobile App Testing
1. Build and run mobile app:
   ```bash
   cd mobile
   flutter pub get
   flutter run
   ```
2. Navigate to "About Us" screen
3. Tap on "Union Journey" tab
4. Verify timeline events load from backend
5. Verify loading indicator shows while fetching
6. Verify error handling (disconnect network and retry)
7. Verify timeline items are expandable
8. Verify achievement bullet points display correctly

## Configuration

### Backend
- Base URL: `https://form.codepeak.software/api/v1`
- Authentication: Bearer token required for admin operations

### Mobile App
- API Base URL configured in `mobile/lib/core/dependency_injection/injection.dart`
- Default: `https://form.codepeak.software/api/v1`

## Error Handling

### Backend
- Returns proper HTTP status codes
- Includes error messages in response
- Validates required fields

### Web Client
- ErrorContext for global error display
- Loading states during API calls
- Fallback data if API fails

### Mobile App
- Either/Failure pattern for error handling
- Loading, Success, Error states in cubit
- Retry button on error
- Graceful fallback to empty state

## Achievement Formatting
The `achievement` field supports multi-line text:
- Each line becomes a bullet point
- Empty lines are filtered out
- Displayed with checkmark icons
- RTL text direction support

Example:
```
تحديث شامل للهيكل التنظيمي
تطوير اللائحة الداخلية
تحسين آليات العمل
```

## Future Enhancements
- [ ] Add image support for timeline events
- [ ] Add localization for timeline content
- [ ] Add search/filter functionality
- [ ] Add pagination in mobile app
- [ ] Add cache support in mobile app
- [ ] Add real-time updates via WebSocket

## Troubleshooting

### Timeline not loading in mobile app
1. Check network connectivity
2. Verify API base URL is correct
3. Check backend server is running
4. Verify timeline events exist in database
5. Check console logs for API errors

### Timeline CRUD not working in admin dashboard
1. Verify user has admin role
2. Check authentication token is valid
3. Verify backend routes are registered
4. Check CORS configuration
5. Check network tab in browser DevTools

### Build errors in mobile app
1. Run `flutter pub get`
2. Run `flutter clean`
3. Check all imports are correct
4. Verify dependency injection is properly configured
5. Check for syntax errors in Dart files

## Summary
The Timeline feature is now fully integrated across:
- ✅ Backend API with CRUD operations
- ✅ Web admin dashboard for management
- ✅ Web public page for display
- ✅ Mobile app with dynamic backend integration
- ✅ Proper error handling and loading states
- ✅ Dependency injection and state management
