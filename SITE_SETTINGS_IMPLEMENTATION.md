# Site Settings Feature - Implementation Summary

## Overview

Created a SiteSettings model to control site-wide features, starting with join request availability.

## Backend Changes

### 1. New Model: `models/SiteSettings.js`

-   **Fields:**

    -   `joinRequestsEnabled` (Boolean, default: true) - Controls if join requests are accepted
    -   `maintenanceMode` (Boolean, default: false) - Future use for maintenance mode
    -   `maintenanceMessage` (String) - Message to show during maintenance
    -   `joinRequestMessage` (String) - Message to show when join requests are disabled

-   **Static Methods:**
    -   `getSettings()` - Get or create settings (ensures single document)
    -   `updateSettings(updates)` - Update settings

### 2. New Controller: `controllers/siteSettingsController.js`

-   **Endpoints:**
    -   `GET /api/v1/site-settings` - Get current settings (public)
    -   `PUT /api/v1/site-settings` - Update settings (admin only)
    -   `POST /api/v1/site-settings/toggle-join-requests` - Quick toggle (admin only)

### 3. New Routes: `routes/siteSettings.js`

-   Public route for getting settings
-   Admin-only routes for updates
-   Uses `protect` and `adminOnly` middleware

### 4. Updated: `controllers/joinRequestController.js`

-   Added `SiteSettings` import
-   Added check in `createJoinRequest()`:
    -   Fetches settings before processing request
    -   Returns 403 error if `joinRequestsEnabled` is false
    -   Shows custom `joinRequestMessage` to user

### 5. Updated: `server.js`

-   Added site settings route: `/api/v1/site-settings`

## Frontend Changes

### 1. Updated API: `client/src/api/index.js`

-   Added `siteSettingsAPI` with methods:
    -   `getSettings()` - Fetch current settings
    -   `updateSettings(settings)` - Update settings
    -   `toggleJoinRequests()` - Quick toggle

### 2. New Admin Page: `client/src/pages/admin/SiteSettingsManagement.jsx`

-   **Features:**
    -   Toggle join requests on/off
    -   Edit join request disabled message
    -   Toggle maintenance mode (future use)
    -   Edit maintenance message
    -   Quick action button to toggle join requests
    -   Save all settings at once

### 3. Updated: `client/src/pages/public/JoinRequestPage.jsx`

-   Fetches site settings on load
-   Shows warning message if join requests are disabled
-   Hides form completely when disabled
-   Displays custom message from settings

### 4. Updated: `client/src/AppRoutes.jsx`

-   Added route: `/admin/site-settings`
-   Protected with admin role

### 5. Updated: `client/src/components/layout/AppSidebar.jsx`

-   Added "إعدادات الموقع" menu item with Cog icon
-   Visible to admins only

## API Endpoints

### Public

```
GET /api/v1/site-settings
```

### Admin Only

```
PUT /api/v1/site-settings
POST /api/v1/site-settings/toggle-join-requests
```

## Usage Flow

1. **Admin disables join requests:**

    - Goes to "إعدادات الموقع" in admin panel
    - Toggles "تفعيل طلبات الانضمام" switch
    - Optionally edits the disabled message
    - Clicks "حفظ الإعدادات"

2. **User tries to join:**

    - Visits `/join` page
    - Sees warning message instead of form
    - Message displays: "عذراً، التسجيل غير متاح حالياً" (or custom message)
    - Can click "العودة للرئيسية" button

3. **API blocks requests:**
    - Even if user bypasses frontend
    - Backend returns 403 error with message
    - No join request is created

## Database

-   Creates single `siteSettings` document on first access
-   Singleton pattern (only one settings document exists)

## Security

-   Only admins can modify settings
-   Public can read settings (needed for join page check)
-   Backend validates all requests

## Testing Checklist

-   [ ] Settings document created on first access
-   [ ] Admin can toggle join requests
-   [ ] Join page shows/hides form correctly
-   [ ] API blocks requests when disabled
-   [ ] Custom messages display properly
-   [ ] Quick toggle button works
-   [ ] Settings persist after server restart
