# Password Management Implementation

This document describes the password management features added to the mobile application.

## Features Added

### 1. Forgot Password
- **Route**: `/forgot-password`
- **Access**: Public (no authentication required)
- **Description**: Allows users to request a password reset email
- **User Flow**:
  1. User navigates to login page
  2. Clicks "نسيت كلمة المرور؟" (Forgot Password?)
  3. Enters their email address
  4. Receives a success message and email with reset link
  5. Redirected to login page

### 2. Reset Password
- **Route**: `/reset-password?token=<token>`
- **Access**: Public (no authentication required)
- **Description**: Allows users to set a new password using the token from the reset email
- **User Flow**:
  1. User clicks the link in the reset password email
  2. Enters new password and confirmation
  3. Password is reset
  4. Redirected to login page to sign in

### 3. Change Password
- **Route**: `/change-password`
- **Access**: Protected (requires authentication)
- **Description**: Allows authenticated users to change their password
- **User Flow**:
  1. User navigates to Settings page
  2. Under "Account Settings", clicks "تغيير كلمة المرور" (Change Password)
  3. Enters current password, new password, and confirmation
  4. Password is changed
  5. Returns to Settings page

## Files Added

### Data Models
```
mobile/lib/features/auth/data/models/
├── forgot_password_request.dart
├── forgot_password_request.g.dart
├── reset_password_request.dart
├── reset_password_request.g.dart
├── change_password_request.dart
└── change_password_request.g.dart
```

### UI Pages
```
mobile/lib/features/auth/presentation/pages/
├── forgot_password_page.dart
├── reset_password_page.dart
└── change_password_page.dart
```

## Files Modified

### Core Files
- `mobile/lib/core/network/api_client.dart` - Added password management endpoints
- `mobile/lib/core/network/api_client.g.dart` - Generated code for new endpoints
- `mobile/lib/core/utils/app_router.dart` - Added routes for password pages
- `mobile/lib/core/utils/route_guard.dart` - Updated route protection rules

### Auth Files
- `mobile/lib/features/auth/data/services/auth_api_service.dart` - Added password management service methods
- `mobile/lib/features/auth/data/repositories/auth_repository.dart` - Added repository methods
- `mobile/lib/features/auth/presentation/cubits/auth_cubit.dart` - Added state management methods

### UI Files
- `mobile/lib/features/auth/presentation/pages/login_page.dart` - Added "Forgot Password" link
- `mobile/lib/features/profile/presentation/pages/settings_page.dart` - Added "Change Password" option

## API Endpoints Used

### POST `/auth/forgot-password`
Request:
```json
{
  "email": "user@example.com"
}
```
Response:
```json
{
  "success": true,
  "data": {
    "message": "Password reset email sent"
  },
  "error": null
}
```

### POST `/auth/reset-password`
Request:
```json
{
  "token": "reset_token_from_email",
  "password": "new_password"
}
```
Response:
```json
{
  "success": true,
  "data": {
    "message": "Password reset successful",
    "token": "jwt_token",
    "user": {...}
  },
  "error": null
}
```

### PUT `/auth/change-password`
Request:
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```
Response:
```json
{
  "success": true,
  "data": {
    "message": "Password changed successfully",
    "token": "jwt_token"
  },
  "error": null
}
```

## Testing

To test the implementation:

1. **Forgot Password**:
   - Go to login page
   - Click "نسيت كلمة المرور؟"
   - Enter a valid email
   - Check email for reset link
   - Verify email is sent successfully

2. **Reset Password**:
   - Click the link from the reset password email
   - Enter a new password (minimum 6 characters)
   - Confirm password matches
   - Verify redirect to login
   - Login with new password

3. **Change Password**:
   - Login to the app
   - Navigate to Profile → Settings
   - Click "تغيير كلمة المرور" under Account Settings
   - Enter current password
   - Enter new password (minimum 6 characters, different from current)
   - Confirm new password
   - Verify success message
   - Logout and login with new password

## Error Handling

All pages handle the following errors:
- Network connectivity issues
- Invalid credentials/tokens
- Server errors
- Validation errors (email format, password length, password mismatch)

Errors are displayed using toast notifications with appropriate messages in Arabic.

## UI/UX Features

- All pages use Material 3 design
- Smooth animations using flutter_animate
- Password visibility toggle on password fields
- Loading states with progress indicators
- Success/error feedback with toast notifications
- Form validation with helpful error messages
- Consistent styling with the rest of the app

## Notes

- The implementation follows the existing clean architecture pattern
- All state management is handled through BLoC/Cubit
- The API integration matches the backend endpoints exactly
- Route guards ensure proper access control
- All user-facing text is in Arabic to match the app language
