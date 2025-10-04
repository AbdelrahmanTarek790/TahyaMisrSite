# Password Management Quick Reference

## User Flow Diagrams

### Forgot Password Flow
```
Login Page
    ↓ (Click "نسيت كلمة المرور؟")
Forgot Password Page
    ↓ (Enter email)
Email Sent Confirmation
    ↓
User's Email Inbox
    ↓ (Click reset link)
Reset Password Page
    ↓ (Enter new password)
Login Page (with new password)
```

### Change Password Flow (Authenticated)
```
Profile → Settings
    ↓ (Click "تغيير كلمة المرور")
Change Password Page
    ↓ (Enter current & new password)
Settings Page (with success message)
```

## Navigation Paths

### For Users (Not Logged In)
- `/login` → Click "نسيت كلمة المرور؟" → `/forgot-password`
- Email link → `/reset-password?token=<token>`

### For Users (Logged In)
- `/profile/settings` → Click "تغيير كلمة المرور" → `/change-password`

## File Structure

```
mobile/lib/features/auth/
├── data/
│   ├── models/
│   │   ├── forgot_password_request.dart ............... Model for forgot password
│   │   ├── reset_password_request.dart ................ Model for reset password
│   │   └── change_password_request.dart ............... Model for change password
│   ├── services/
│   │   └── auth_api_service.dart ...................... API service methods
│   └── repositories/
│       └── auth_repository.dart ....................... Repository methods
└── presentation/
    ├── cubits/
    │   └── auth_cubit.dart ............................ State management
    └── pages/
        ├── login_page.dart ............................ Added forgot password link
        ├── forgot_password_page.dart .................. New: Request reset
        ├── reset_password_page.dart ................... New: Set new password
        └── change_password_page.dart .................. New: Change password

mobile/lib/features/profile/presentation/pages/
└── settings_page.dart ................................. Added change password option

mobile/lib/core/
├── network/
│   └── api_client.dart ................................ Added 3 password endpoints
└── utils/
    ├── app_router.dart ................................ Added 3 routes
    └── route_guard.dart ............................... Updated access rules
```

## Code Snippets

### Navigation Examples

```dart
// Navigate to Forgot Password
context.push('/forgot-password');

// Navigate to Reset Password with token
context.push('/reset-password?token=$token');

// Navigate to Change Password
context.push('/change-password');
```

### Using AuthCubit

```dart
// Forgot Password
context.read<AuthCubit>().forgotPassword(email: email);

// Reset Password
context.read<AuthCubit>().resetPassword(token: token, password: password);

// Change Password
context.read<AuthCubit>().changePassword(
  currentPassword: currentPassword,
  newPassword: newPassword,
);
```

## Validation Rules

### Email
- Required
- Must be valid email format (contains @ and domain)

### Password (New/Reset)
- Required
- Minimum 6 characters
- Must match confirmation field

### Current Password (Change Password)
- Required
- Must be correct
- New password must be different from current

## Success Messages (Arabic)

- **Forgot Password**: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني"
- **Reset Password**: "تم إعادة تعيين كلمة المرور بنجاح"
- **Change Password**: "تم تغيير كلمة المرور بنجاح"

## Error Messages (Common)

- Invalid email format
- Password too short (< 6 characters)
- Passwords don't match
- Invalid/expired reset token
- Incorrect current password
- Network connection error
- Server error

## Testing Checklist

- [ ] Forgot password sends email
- [ ] Reset password link works from email
- [ ] Reset password validates inputs
- [ ] Reset password redirects to login
- [ ] Change password requires authentication
- [ ] Change password validates current password
- [ ] Change password updates password
- [ ] Change password maintains session
- [ ] All error messages display correctly
- [ ] All success messages display correctly
- [ ] Loading states work properly
- [ ] Password visibility toggles work
- [ ] Form validation works on all fields
- [ ] Animations work smoothly

## Troubleshooting

### "Forgot password email not received"
- Check spam/junk folder
- Verify email address is correct
- Check server email configuration
- Verify user exists in database

### "Invalid reset token"
- Token may have expired (check token expiry time)
- Token may have been used already
- Request new reset link

### "Change password fails"
- Verify current password is correct
- Ensure new password meets requirements
- Check authentication token is valid
- Verify network connection

### "Route navigation not working"
- Check route definitions in app_router.dart
- Verify route guard configuration
- Check authentication state
