# 🔗 Universal Links Quick Reference

## ⚠️ CRITICAL: Update Before Production

### 1. Apple App Site Association

File: `client/public/.well-known/apple-app-site-association`

```json
"appID": "TEAM_ID.com.tahyamisr.app"
```

**Find your Team ID:**

1. Go to https://developer.apple.com/account
2. Click "Membership" in sidebar
3. Copy "Team ID" (10 characters, e.g., "ABC123DEFG")

### 2. Android Asset Links

File: `client/public/.well-known/assetlinks.json`

```bash
# Get SHA-256 fingerprint:
keytool -list -v -keystore your-release-key.keystore -alias your-key-alias
```

Copy the SHA256 line (70 hex characters with colons).

### 3. Deep Link Config

File: `client/src/utils/deepLinkHandler.js`

Update these values:

```javascript
iosTeamId: "TEAM_ID",        // Your Apple Team ID
iosAppId: "123456789",       // Your App Store app ID
playStoreUrl: "...",         // Your Play Store URL
appStoreUrl: "...",          // Your App Store URL
```

## 🧪 Testing URLs

Once deployed to HTTPS:

**Validate iOS:**

-   https://branch.io/resources/aasa-validator/
-   Enter: `https://tahyamisryu.com`

**Validate Android:**

```bash
curl https://tahyamisryu.com/.well-known/assetlinks.json
```

**Test Links:**

-   `https://tahyamisryu.com/app/news/690e4dd876f189fa6997bc04`
-   `https://tahyamisryu.com/app/events/[EVENT_ID]`
-   `https://tahyamisryu.com/app/achievements/[ACHIEVEMENT_ID]`
-   `https://tahyamisryu.com/app/activities/[ACTIVITY_ID]`

## 📱 What Users Experience

### With Universal Links (After Configuration):

✅ Tap link → App opens **instantly** (no dialog)
✅ App not installed → Website opens
✅ Works in all apps (WhatsApp, Messages, Gmail, etc.)

### Without Universal Links (Current):

⚠️ Tap link → "Open in Tahya Misr?" dialog appears
⚠️ App not installed → Error message
⚠️ May not work in some apps

## 🚀 Quick Deploy Steps

1. **Update placeholder values** in all 3 files above
2. **Deploy to production** (HTTPS required)
3. **Test accessibility:**
    ```bash
    curl https://tahyamisryu.com/.well-known/apple-app-site-association
    curl https://tahyamisryu.com/.well-known/assetlinks.json
    ```
4. **Configure Flutter app** (see UNIVERSAL_LINKS_GUIDE.md)
5. **Test on real devices**

## 📄 Full Documentation

See `UNIVERSAL_LINKS_GUIDE.md` for complete instructions.
