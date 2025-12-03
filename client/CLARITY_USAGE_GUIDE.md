# Microsoft Clarity Usage Guide

This guide covers how to use Microsoft Clarity's advanced features in your React application.

## Table of Contents

1. [Basic Setup](#basic-setup)
2. [Identify API](#identify-api)
3. [Custom Tags API](#custom-tags-api)
4. [Custom Events API](#custom-events-api)
5. [Cookie Consent](#cookie-consent)
6. [Upgrade Session API](#upgrade-session-api)
7. [Integration Examples](#integration-examples)

---

## Basic Setup

Clarity is already initialized in `src/main.jsx`. It automatically:

-   Checks for Do Not Track (DNT) settings
-   Only loads in production (unless `VITE_CLARITY_ENABLE_DEVELOPMENT=true`)
-   Handles errors gracefully

### Environment Variables

Set these in your `.env` file:

```bash
# Your Clarity project ID (required)
VITE_CLARITY_ID=your-project-id

# Enable in development mode (optional, default: false)
VITE_CLARITY_ENABLE_DEVELOPMENT=true
```

---

## Identify API

Use the Identify API to track custom user identifiers. This is useful for:

-   Tracking authenticated users
-   Linking sessions to specific user IDs
-   Adding friendly names for easier identification

### Usage

```javascript
import Clarity from "@microsoft/clarity"

// Basic usage (only custom-id is required)
Clarity.identify("user-12345")

// With all parameters
Clarity.identify(
    "user-12345", // customId (required) - hashed before sending
    "session-abc123", // customSessionId (optional)
    "page-home", // customPageId (optional)
    "John Doe" // friendlyName (optional)
)
```

### Example: Track Authenticated Users

In your `AuthContext.jsx`:

```javascript
import { createContext, useContext, useState, useEffect } from "react"
import Clarity from "@microsoft/clarity"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        // When user logs in, identify them in Clarity
        if (user) {
            Clarity.identify(
                user.id,
                undefined, // Let Clarity generate session ID
                undefined, // Let Clarity generate page ID
                user.name
            )
        }
    }, [user])

    // ... rest of your auth logic
}
```

### Important Notes

-   Call `Clarity.identify()` on each page for optimal tracking
-   The `customId` is securely hashed on the client before sending to Clarity
-   This helps you filter sessions by specific users in the Clarity dashboard

---

## Custom Tags API

Custom tags let you add arbitrary metadata to your Clarity sessions. Use them to:

-   Track user properties (subscription tier, user role, etc.)
-   Mark sessions with specific characteristics
-   Filter and segment sessions in the Clarity dashboard

### Usage

```javascript
import Clarity from "@microsoft/clarity"

// Single value
Clarity.setTag("userRole", "admin")
Clarity.setTag("subscriptionTier", "premium")

// Multiple values (array)
Clarity.setTag("features", ["feature-a", "feature-b", "feature-c"])
```

### Example: Track User Roles

```javascript
// In your ProtectedRoute component or after login
import Clarity from "@microsoft/clarity"

function ProtectedRoute({ children, roles }) {
    const { user } = useAuth()

    useEffect(() => {
        if (user) {
            // Tag the session with user metadata
            Clarity.setTag("userRole", user.role)
            Clarity.setTag("university", user.university || "unknown")
            Clarity.setTag("memberSince", user.createdAt)
        }
    }, [user])

    // ... rest of component
}
```

### Example: Track Feature Flags

```javascript
// Tag sessions based on enabled features
const enabledFeatures = ["dark-mode", "beta-features"]
Clarity.setTag("features", enabledFeatures)
```

---

## Custom Events API

Track specific user actions manually using custom events. These appear alongside Smart events in Clarity.

### Usage

```javascript
import Clarity from "@microsoft/clarity"

// Track a custom event
Clarity.event("button-clicked")
Clarity.event("video-played")
Clarity.event("form-submitted")
```

### Example: Track Important Actions

```javascript
// In your form submission handler
function handleJoinRequest(formData) {
  // Track the form submission event
  Clarity.event("join-request-submitted");

  // Also tag the session for easier filtering
  Clarity.setTag("hasJoinRequest", "true");

  // Submit the form
  await api.submitJoinRequest(formData);
}
```

### Example: Track Navigation

```javascript
// In your App.jsx or a route change listener
import { useLocation } from "react-router-dom"
import { useEffect } from "react"
import Clarity from "@microsoft/clarity"

function useTrackPageViews() {
    const location = useLocation()

    useEffect(() => {
        // Track page views as custom events
        Clarity.event(`page-view-${location.pathname}`)

        // Also set the current page as a tag
        Clarity.setTag("currentPage", location.pathname)
    }, [location])
}
```

### Example: Track Errors

```javascript
// In your error boundary or error handler
function ErrorBoundary({ children }) {
    const handleError = (error, errorInfo) => {
        // Track the error in Clarity
        Clarity.event("error-occurred")
        Clarity.setTag("errorType", error.name)
        Clarity.setTag("errorMessage", error.message)
    }

    // ... rest of error boundary
}
```

---

## Cookie Consent

If your Clarity project requires cookie consent, you must call the consent API before tracking begins.

### Usage

```javascript
import Clarity from "@microsoft/clarity"

// Grant consent (default is true)
Clarity.consent()

// Or explicitly
Clarity.consent(true)

// Revoke consent
Clarity.consent(false)
```

### Example: GDPR Cookie Consent Banner

```javascript
import { useState, useEffect } from "react"
import Clarity from "@microsoft/clarity"

function CookieConsentBanner() {
    const [showBanner, setShowBanner] = useState(false)

    useEffect(() => {
        // Check if user has already given consent
        const hasConsent = localStorage.getItem("clarity-consent")
        if (!hasConsent) {
            setShowBanner(true)
        } else {
            // User has given consent, enable Clarity
            Clarity.consent(hasConsent === "true")
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem("clarity-consent", "true")
        Clarity.consent(true)
        setShowBanner(false)
    }

    const handleReject = () => {
        localStorage.setItem("clarity-consent", "false")
        Clarity.consent(false)
        setShowBanner(false)
    }

    if (!showBanner) return null

    return (
        <div className="cookie-banner">
            <p>We use cookies to improve your experience. Do you accept?</p>
            <button onClick={handleAccept}>Accept</button>
            <button onClick={handleReject}>Reject</button>
        </div>
    )
}
```

---

## Upgrade Session API

Use the upgrade API to prioritize specific sessions for recording. This is useful when:

-   You have limited recording quotas
-   You want to focus on sessions with specific events
-   You want to prioritize important user flows (checkout, sign-up, etc.)

### Usage

```javascript
import Clarity from "@microsoft/clarity"

// Upgrade the current session with a reason
Clarity.upgrade("user-checkout")
Clarity.upgrade("high-value-customer")
Clarity.upgrade("error-occurred")
```

### Example: Prioritize Important Flows

```javascript
// In your checkout page
function CheckoutPage() {
    useEffect(() => {
        // Prioritize checkout sessions for recording
        Clarity.upgrade("checkout-session")
    }, [])

    // ... rest of component
}
```

### Example: Prioritize Sessions with Errors

```javascript
// In your error handler
function handleError(error) {
    // Upgrade the session so we can review it
    Clarity.upgrade("error-occurred")
    Clarity.setTag("errorType", error.name)

    // Log the error
    console.error(error)
}
```

---

## Integration Examples

### Complete User Tracking Setup

```javascript
// In your AuthContext or after login
import Clarity from "@microsoft/clarity"

function trackUserSession(user) {
    // Identify the user
    Clarity.identify(user.id, undefined, undefined, user.name)

    // Add user metadata as tags
    Clarity.setTag("userRole", user.role)
    Clarity.setTag("university", user.university)
    Clarity.setTag("membershipType", user.membershipType)

    // Track login event
    Clarity.event("user-logged-in")

    // Upgrade the session if it's an admin or VIP
    if (user.role === "admin" || user.isVIP) {
        Clarity.upgrade("high-value-user")
    }
}
```

### Track Form Interactions

```javascript
import Clarity from "@microsoft/clarity"

function JoinRequestForm() {
    const handleSubmit = async (formData) => {
        // Track form submission
        Clarity.event("join-request-form-submitted")

        // Tag the session
        Clarity.setTag("hasSubmittedJoinRequest", "true")

        // Upgrade for important conversions
        Clarity.upgrade("join-request-submission")

        // Submit the form
        await api.submitJoinRequest(formData)
    }

    const handleFieldChange = (fieldName) => {
        // Track field interactions
        Clarity.event(`field-focused-${fieldName}`)
    }

    // ... rest of component
}
```

### Track E-Commerce Events

```javascript
import Clarity from "@microsoft/clarity"

// Product view
function ProductPage({ product }) {
    useEffect(() => {
        Clarity.event("product-viewed")
        Clarity.setTag("productCategory", product.category)
        Clarity.setTag("productPrice", product.price.toString())
    }, [product])
}

// Add to cart
function addToCart(product) {
    Clarity.event("add-to-cart")
    Clarity.setTag("cartValue", cart.total.toString())
    Clarity.upgrade("shopping-session")
}

// Purchase
function completePurchase(order) {
    Clarity.event("purchase-completed")
    Clarity.setTag("orderValue", order.total.toString())
    Clarity.upgrade("purchase-session")
}
```

---

## Best Practices

1. **Call Clarity APIs safely**: Always wrap calls in try-catch or check if Clarity is available

    ```javascript
    try {
        Clarity.event("my-event")
    } catch (error) {
        console.warn("Clarity not available:", error)
    }
    ```

2. **Don't track sensitive data**: Never send passwords, credit card numbers, or PII

    ```javascript
    // ❌ DON'T DO THIS
    Clarity.setTag("password", user.password)

    // ✅ DO THIS
    Clarity.setTag("hasPassword", "true")
    ```

3. **Use descriptive event names**: Make it easy to filter in the dashboard

    ```javascript
    // ❌ Bad
    Clarity.event("click")

    // ✅ Good
    Clarity.event("checkout-button-clicked")
    ```

4. **Tag early, filter later**: Add tags liberally, filter in the Clarity dashboard

    ```javascript
    Clarity.setTag("userType", user.type)
    Clarity.setTag("platform", "web")
    Clarity.setTag("version", "2.0")
    ```

5. **Respect user privacy**: Always check DNT and get consent when required
    - The implementation in `main.jsx` already respects DNT
    - Use `Clarity.consent()` if your project requires cookie consent

---

## Utility Hook Example

Create a custom hook for easier Clarity integration:

```javascript
// hooks/useClarity.js
import { useEffect } from "react"
import Clarity from "@microsoft/clarity"

export function useClarity() {
    const trackEvent = (eventName) => {
        try {
            Clarity.event(eventName)
        } catch (error) {
            console.warn("Clarity event tracking failed:", error)
        }
    }

    const setTag = (key, value) => {
        try {
            Clarity.setTag(key, value)
        } catch (error) {
            console.warn("Clarity tag setting failed:", error)
        }
    }

    const identify = (userId, sessionId, pageId, friendlyName) => {
        try {
            Clarity.identify(userId, sessionId, pageId, friendlyName)
        } catch (error) {
            console.warn("Clarity identify failed:", error)
        }
    }

    const upgrade = (reason) => {
        try {
            Clarity.upgrade(reason)
        } catch (error) {
            console.warn("Clarity upgrade failed:", error)
        }
    }

    return { trackEvent, setTag, identify, upgrade }
}

// Usage in components
function MyComponent() {
    const { trackEvent, setTag } = useClarity()

    const handleClick = () => {
        trackEvent("button-clicked")
        setTag("buttonClicked", "true")
    }

    return <button onClick={handleClick}>Click me</button>
}
```

---

## Additional Resources

-   [Clarity Dashboard](https://clarity.microsoft.com/)
-   [Clarity NPM Package](https://www.npmjs.com/package/@microsoft/clarity)
-   [Official Documentation](https://learn.microsoft.com/en-us/clarity/)
-   [Privacy Policy Template](https://learn.microsoft.com/en-us/clarity/setup-and-installation/privacy)

---

## Troubleshooting

### Clarity not loading in development

-   Check that `VITE_CLARITY_ENABLE_DEVELOPMENT=true` is set in your `.env` file
-   Restart your Vite dev server after changing environment variables

### Events not showing in dashboard

-   Wait a few minutes - Clarity has a slight delay in processing
-   Check that your project ID is correct
-   Ensure you're not in Do Not Track mode

### TypeScript errors

-   Install type definitions: `npm install --save-dev @types/microsoft__clarity`
-   Or add `// @ts-ignore` before Clarity imports

### Cookie consent not working

-   Ensure you're calling `Clarity.consent()` before any tracking
-   Check your Clarity project settings for cookie consent requirements
