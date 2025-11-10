# Universal Links & App Links Configuration Guide

This guide explains how to configure Universal Links (iOS) and App Links (Android) for seamless deep linking.

## 🎯 Benefits of Universal Links/App Links

✅ **No confirmation dialogs** - Opens app directly without "Open in app?" prompt
✅ **Graceful fallback** - Opens website if app not installed
✅ **Secure & verified** - OS verifies ownership of domain
✅ **Better UX** - Works in all browsers and social media
✅ **SEO friendly** - Same URLs work for web and app

## 📁 Files Created

### 1. `.well-known/apple-app-site-association` (iOS Universal Links)

Location: `client/public/.well-known/apple-app-site-association`

**⚠️ IMPORTANT: Update these values:**

```json
"appID": "TEAM_ID.com.tahyamisr.app"
```

Replace:

-   `TEAM_ID` → Your Apple Developer Team ID (found in App Store Connect)
-   `com.tahyamisr.app` → Your actual iOS bundle identifier

### 2. `.well-known/assetlinks.json` (Android App Links)

Location: `client/public/.well-known/assetlinks.json`

**⚠️ IMPORTANT: Update these values:**

```json
"package_name": "com.tahyamisr.app",
"sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT_HERE"]
```

Replace:

-   `com.tahyamisr.app` → Your actual Android package name
-   `YOUR_SHA256_FINGERPRINT_HERE` → Your app's SHA-256 fingerprint

**How to get SHA-256 fingerprint:**

```bash
# For release keystore
keytool -list -v -keystore your-release-key.keystore -alias your-key-alias

# For debug (testing)
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

Look for "SHA256:" in the output and copy the fingerprint.

## 🔧 Server Configuration

The Express server now serves these files at:

-   `https://tahyamisryu.com/.well-known/apple-app-site-association`
-   `https://tahyamisryu.com/.well-known/assetlinks.json`

**⚠️ CRITICAL: These files MUST:**

1. Be served over HTTPS (required by Apple and Google)
2. Have `Content-Type: application/json` header (already configured)
3. Be accessible without authentication
4. Return 200 status code

## 📱 Flutter App Configuration

### iOS Configuration (Info.plist)

Add to `mobile/ios/Runner/Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleTypeRole</key>
        <string>Editor</string>
        <key>CFBundleURLName</key>
        <string>com.tahyamisr.app</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>tahyamisr</string>
        </array>
    </dict>
</array>

<!-- Universal Links Support -->
<key>com.apple.developer.associated-domains</key>
<array>
    <string>applinks:tahyamisryu.com</string>
</array>
```

**Enable Associated Domains in Xcode:**

1. Open `Runner.xcworkspace` in Xcode
2. Select Runner target → Signing & Capabilities
3. Click "+ Capability" → Add "Associated Domains"
4. Add: `applinks:tahyamisryu.com`

### Android Configuration (AndroidManifest.xml)

Add to `mobile/android/app/src/main/AndroidManifest.xml`:

```xml
<activity
    android:name=".MainActivity"
    android:launchMode="singleTop"
    android:exported="true">

    <!-- Existing intent-filter for app launch -->
    <intent-filter>
        <action android:name="android.intent.action.MAIN"/>
        <category android:name="android.intent.category.LAUNCHER"/>
    </intent-filter>

    <!-- Custom URL Scheme (fallback) -->
    <intent-filter>
        <action android:name="android.intent.action.VIEW"/>
        <category android:name="android.intent.category.DEFAULT"/>
        <category android:name="android.intent.category.BROWSABLE"/>
        <data android:scheme="tahyamisr"/>
    </intent-filter>

    <!-- App Links (Universal Links for Android) -->
    <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.VIEW"/>
        <category android:name="android.intent.category.DEFAULT"/>
        <category android:name="android.intent.category.BROWSABLE"/>

        <data android:scheme="https"/>
        <data android:host="tahyamisryu.com"/>
        <data android:pathPrefix="/app/news/"/>
        <data android:pathPrefix="/app/events/"/>
        <data android:pathPrefix="/app/achievements/"/>
        <data android:pathPrefix="/app/activities/"/>
    </intent-filter>
</activity>
```

### Flutter Code (main.dart)

Add deep link handling:

```dart
import 'package:uni_links/uni_links.dart';
import 'dart:async';

class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  StreamSubscription? _linkSubscription;

  @override
  void initState() {
    super.initState();
    _initDeepLinks();
  }

  Future<void> _initDeepLinks() async {
    // Handle initial link if app was closed
    try {
      final initialLink = await getInitialLink();
      if (initialLink != null) {
        _handleDeepLink(initialLink);
      }
    } catch (e) {
      print('Error getting initial link: $e');
    }

    // Handle links while app is running
    _linkSubscription = linkStream.listen((String? link) {
      if (link != null) {
        _handleDeepLink(link);
      }
    });
  }

  void _handleDeepLink(String link) {
    final uri = Uri.parse(link);

    // Extract type and ID from URL
    // Format: https://tahyamisryu.com/app/news/123
    // or: tahyamisr://news/123

    final pathSegments = uri.pathSegments;
    if (pathSegments.isEmpty) return;

    String type;
    String? id;

    if (uri.scheme == 'https' || uri.scheme == 'http') {
      // Universal Link format: /app/news/123
      if (pathSegments.length >= 3 && pathSegments[0] == 'app') {
        type = pathSegments[1]; // news, events, etc.
        id = pathSegments[2];
      } else {
        return;
      }
    } else {
      // Custom scheme format: tahyamisr://news/123
      type = pathSegments[0];
      id = pathSegments.length > 1 ? pathSegments[1] : null;
    }

    // Navigate based on type
    switch (type) {
      case 'news':
        if (id != null) {
          Navigator.pushNamed(context, '/news/$id');
        }
        break;
      case 'events':
        if (id != null) {
          Navigator.pushNamed(context, '/events/$id');
        }
        break;
      case 'achievements':
        if (id != null) {
          Navigator.pushNamed(context, '/achievements/$id');
        }
        break;
      case 'activities':
        if (id != null) {
          Navigator.pushNamed(context, '/activities/$id');
        }
        break;
    }
  }

  @override
  void dispose() {
    _linkSubscription?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      // Your app configuration
    );
  }
}
```

Add dependency to `pubspec.yaml`:

```yaml
dependencies:
    uni_links: ^0.5.1
```

## 🧪 Testing

### Test Universal Links (iOS)

1. **Deploy .well-known files to production** (MUST be HTTPS)
2. **Validate configuration:**

    - Open: https://branch.io/resources/aasa-validator/
    - Enter: `https://tahyamisryu.com`
    - Verify it shows your app configuration

3. **Test on device:**
    - Send link via Notes app or Messages
    - Tap the link
    - Should open app directly (no dialog!)
    - If app not installed, opens website

### Test App Links (Android)

1. **Deploy .well-known files to production** (MUST be HTTPS)
2. **Validate configuration:**

    ```bash
    # Check if assetlinks.json is accessible
    curl https://tahyamisryu.com/.well-known/assetlinks.json
    ```

3. **Test verification:**

    ```bash
    # Connect device via ADB
    adb shell pm get-app-links com.tahyamisr.app

    # Manually verify
    adb shell pm verify-app-links --re-verify com.tahyamisr.app
    ```

4. **Test on device:**
    - Send link via WhatsApp, Gmail, or Chrome
    - Tap the link
    - Should open app directly
    - Check settings: Apps → Tahya Misr → Open by default

## 🚀 Deployment Checklist

### Before Going Live:

1. ✅ Update `.well-known/apple-app-site-association`:

    - [ ] Replace `TEAM_ID` with your Apple Team ID
    - [ ] Replace bundle identifier if different

2. ✅ Update `.well-known/assetlinks.json`:

    - [ ] Replace package name if different
    - [ ] Add your release keystore SHA-256 fingerprint

3. ✅ Update `client/src/utils/deepLinkHandler.js`:

    - [ ] Set correct `iosTeamId`
    - [ ] Set correct `iosAppId` (from App Store Connect)
    - [ ] Update store URLs when app is published

4. ✅ Deploy to production with HTTPS

    - [ ] Verify files are accessible at:
        - `https://tahyamisryu.com/.well-known/apple-app-site-association`
        - `https://tahyamisryu.com/.well-known/assetlinks.json`

5. ✅ Configure Flutter app:

    - [ ] Add iOS Info.plist configuration
    - [ ] Add Android manifest intent-filters
    - [ ] Implement deep link handler in main.dart
    - [ ] Test on both platforms

6. ✅ Validate:
    - [ ] Use Apple's AASA validator
    - [ ] Test Android App Links verification
    - [ ] Test on real devices

## 📊 How It Works

### User Flow with Universal Links:

1. **User taps link:** `https://tahyamisryu.com/app/news/123`
2. **OS checks:** Is this domain verified for an installed app?
3. **If YES:** Opens app directly → `tahyamisr://news/123`
4. **If NO:** Opens in browser → Your React website

### Fallback Chain:

1. **Universal Link** (preferred) → Opens app seamlessly
2. **Custom Scheme** (fallback) → Shows "Open in app?" dialog
3. **Web Page** (final fallback) → Shows website with install button

## 🔍 Troubleshooting

### iOS Universal Links Not Working:

-   ✅ Ensure HTTPS (required)
-   ✅ Verify Team ID and bundle ID match exactly
-   ✅ Check Associated Domains capability is enabled in Xcode
-   ✅ File must be at root: `/.well-known/apple-app-site-association`
-   ✅ File must have no `.json` extension
-   ✅ Clear cache: Delete app, reinstall
-   ✅ Test link from Notes app or Messages (not Safari directly)

### Android App Links Not Working:

-   ✅ Ensure HTTPS (required)
-   ✅ Verify SHA-256 fingerprint matches your keystore
-   ✅ Check `android:autoVerify="true"` is set
-   ✅ Wait a few minutes after installation for verification
-   ✅ Use `pm verify-app-links` command to force verification
-   ✅ Check app settings: Apps → Open by default

## 📝 Summary

You now have:

1. ✅ `.well-known` files for Universal Links (iOS) and App Links (Android)
2. ✅ Express routes serving these files with correct headers
3. ✅ Updated deep link utilities with both methods
4. ✅ Complete Flutter configuration examples
5. ✅ Testing and validation procedures

**Next Steps:**

1. Update placeholder values (Team ID, SHA-256, etc.)
2. Deploy to production with HTTPS
3. Configure Flutter app with provided code
4. Test on real devices
5. Validate with Apple and Google tools

Your app will now open seamlessly without confirmation dialogs! 🎉
