/**
 * Deep Link Handler Utility
 * Generates Universal Links (iOS) and App Links (Android) for Tahya Misr app
 * Falls back to custom URL scheme for older implementations
 */

export const DeepLinkConfig = {
    // Custom URL scheme (legacy fallback)
    scheme: "tahyamisr",

    // Universal Links domain (preferred method)
    webBaseUrl: "https://tahyamisryu.com",

    // App identifiers
    androidPackage: "com.tahyamisr.app", // Update with your actual package name
    iosAppId: "123456789", // Update with your actual app ID from App Store Connect
    iosTeamId: "TEAM_ID", // Update with your Apple Developer Team ID

    // Store URLs
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.tahyamisr.app",
    appStoreUrl: "https://apps.apple.com/app/tahya-misr/id123456789",
}

/**
 * Generate smart link that works as Universal Link (seamless on mobile)
 * This is the PREFERRED method - no confirmation dialogs!
 *
 * @param {string} type - Type of content (news, events, achievements, activities)
 * @param {string} id - Content ID
 * @returns {string} Universal Link URL
 */
export const generateSmartLink = (type, id) => {
    return `${DeepLinkConfig.webBaseUrl}/app/${type}/${id}`
}

/**
 * Generate custom URL scheme link (legacy fallback)
 * Use only if Universal Links are not configured
 *
 * @param {string} type - Type of content
 * @param {string} id - Content ID
 * @returns {string} Custom scheme URL
 */
export const generateCustomSchemeLink = (type, id) => {
    return `${DeepLinkConfig.scheme}://${type}/${id}`
}

/**
 * Deep link types
 */
export const DeepLinkTypes = {
    NEWS: "news",
    EVENTS: "events",
    ACHIEVEMENTS: "achievements",
    ACTIVITIES: "activities",
    PROFILE: "profile",
    HOME: "home",
}

/**
 * Detect if user is on mobile device
 */
export const isMobileDevice = () => {
    return /android|iphone|ipad|ipod/i.test(navigator.userAgent)
}

/**
 * Detect platform
 */
export const getPlatform = () => {
    const userAgent = navigator.userAgent.toLowerCase()
    if (/android/i.test(userAgent)) return "android"
    if (/iphone|ipad|ipod/i.test(userAgent)) return "ios"
    return "web"
}
