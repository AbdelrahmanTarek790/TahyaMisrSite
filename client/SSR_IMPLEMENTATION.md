# SSR Implementation Guide

This project now supports Server-Side Rendering (SSR) using Vite and React 19's native metadata capabilities.

## Architecture Overview

-   **Client Entry**: `src/entry-client.jsx` - Hydrates the SSR-rendered HTML
-   **Server Entry**: `src/entry-server.jsx` - Renders React components to HTML on the server
-   **Express Server**: `server/index.js` - Handles SSR requests and static file serving
-   **Shared Routes**: `src/AppRoutes.jsx` - Route definitions used by both client and server

## Features

✅ **React 19 Native Metadata** - No need for react-helmet-async  
✅ **Streaming SSR** - Uses `renderToPipeableStream` for better performance  
✅ **Selective SSR** - Public routes are SSR'd, private routes use SPA mode  
✅ **SSR-Safe Context** - Authentication and localization work on both server and client  
✅ **SEO Optimized** - Meta tags, Open Graph, Twitter Cards, and structured data  
✅ **Development & Production** - Works with Vite dev server and production builds

## SSR-Enabled Routes

The following routes are server-side rendered for better SEO and performance:

-   `/` - Home page
-   `/about` - About page
-   `/contact` - Contact page
-   `/team` - Team page
-   `/news` - Public news listing
-   `/news/:id` - News detail pages
-   `/events` - Public events listing
-   `/events/:id` - Event detail pages
-   `/journey` - Journey page
-   `/help` - Help page
-   `/terms` - Terms of service
-   `/privacy` - Privacy policy
-   `/faq` - FAQ page
-   `/join` - Join request page
-   `/login` - Login page (if not authenticated)

## SPA-Only Routes

These routes are served as a traditional SPA (no SSR) to avoid authentication complexity:

-   `/dashboard/*` - User dashboard
-   `/admin/*` - Admin panel
-   `/profile` - User profile
-   `/settings` - User settings
-   `/media` - Media management

## Development Scripts

```bash
# Regular development (SPA mode)
npm run dev

# Development with SSR
npm run dev:ssr

# Build for production
npm run build

# Build with SSR support
npm run build:ssr

# Serve production build with SSR
npm run serve:ssr
```

## How SSR Works

### 1. Client-Side Hydration

The client entry (`src/entry-client.jsx`) uses `hydrateRoot` instead of `createRoot` to hydrate the server-rendered HTML:

```jsx
hydrateRoot(document.getElementById("root"), <App />)
```

### 2. Server-Side Rendering

The server entry (`src/entry-server.jsx`) exports a `render` function that uses `MemoryRouter` and `renderToPipeableStream`:

```jsx
export function render(url) {
    return new Promise((resolve, reject) => {
        const { pipe, abort } = renderToPipeableStream(
            <MemoryRouter initialEntries={[url]}>
                <AppRoutes />
            </MemoryRouter>,
            {
                onShellReady() {
                    resolve({ pipe, abort })
                },
            }
        )
    })
}
```

### 3. Express Server

The server (`server/index.js`) handles:

-   Static file serving in production
-   Vite dev middleware in development
-   Route-based SSR vs SPA decisions
-   HTML template processing and streaming

### 4. SEO Metadata

Using React 19's built-in metadata support, components can include:

```jsx
function MyPage() {
    return (
        <>
            <title>Page Title</title>
            <meta name="description" content="Page description" />
            <meta property="og:title" content="Page Title" />
            {/* Other content */}
        </>
    )
}
```

## SSR-Safe Patterns

### 1. Browser API Guards

Always check for browser environment:

```jsx
// ❌ Will crash on server
const theme = localStorage.getItem("theme")

// ✅ SSR-safe
const theme = typeof window !== "undefined" ? localStorage.getItem("theme") : null
```

### 2. Conditional Client-Only Code

```jsx
useEffect(() => {
    // This only runs on the client
    if (typeof window !== "undefined") {
        // Browser-only code here
    }
}, [])
```

### 3. Safe Context Providers

The AuthContext uses a safe localStorage wrapper:

```jsx
const safeLocalStorage = {
    getItem: (key) => (typeof window !== "undefined" ? localStorage.getItem(key) : null),
    setItem: (key, value) => typeof window !== "undefined" && localStorage.setItem(key, value),
    removeItem: (key) => typeof window !== "undefined" && localStorage.removeItem(key),
}
```

## Performance Benefits

1. **Faster Time to First Contentful Paint (FCP)** - Content is visible immediately
2. **Better SEO** - Search engines see fully rendered HTML
3. **Improved Core Web Vitals** - Better LCP and CLS scores
4. **Social Media Previews** - Open Graph tags work properly

## Testing SSR

### 1. Check View Source

Visit any public page and view page source. You should see:

-   Fully rendered HTML content (not just a root div)
-   Meta tags populated with page-specific data
-   Structured data (JSON-LD) for better SEO

### 2. Lighthouse SEO Score

Run Lighthouse on public pages to verify:

-   SEO score improvements
-   Meta description presence
-   Open Graph tags
-   Structured data

### 3. Hydration Warnings

Check the browser console for hydration mismatches. The console should be clean without React hydration warnings.

## Troubleshooting

### Common Issues

1. **Hydration Mismatch**: Different content rendered server vs client

    - Solution: Ensure consistent rendering, use SSR-safe patterns

2. **"window is not defined"**: Browser APIs used on server

    - Solution: Add `typeof window !== 'undefined'` guards

3. **CSS Styling Issues**: Styles not loading properly

    - Solution: Ensure CSS imports are in both client and server entries

4. **Route Not Working**: Pages showing 404 in production
    - Solution: Check if route is excluded from SSR in `spaOnlyRoutes` array

### Debug Mode

For debugging, you can add logging to the server:

```jsx
// In server/index.js
console.log("SSR rendering:", url)
console.log("Is SPA only:", isSpaOnlyRoute)
```

## Deployment Considerations

1. **Static Assets**: Ensure `/dist/client/assets/` are served properly
2. **Environment Variables**: Set `NODE_ENV=production` for production
3. **Memory Usage**: Monitor server memory usage with SSR
4. **Caching**: Consider adding response caching for better performance

## Future Enhancements

-   **Data Loading**: Add server-side data fetching for dynamic content
-   **Caching**: Add response caching with appropriate headers
-   **Preloading**: Add link preloading for critical route chunks
-   **Error Boundaries**: Improve error handling for SSR failures
