import express from "express"
import { fileURLToPath } from "url"
import { dirname, resolve } from "path"
import fs from "fs"
import { Transform } from "stream"
import { generate as generateSitemap } from "../scripts/generate-sitemap.js"
import { getPageMeta } from "./getPageMeta.js"
import cron from "node-cron"
const __dirname = dirname(fileURLToPath(import.meta.url))
const isProduction = process.env.NODE_ENV === "production"
const port = process.env.PORT || 5173

// Routes that should NOT be server-side rendered (SPA-only routes)
const spaOnlyRoutes = ["/dashboard", "/admin", "/profile", "/settings", "/media"]

async function createServer() {
    const app = express()

    // Enable JSON parsing for webhook payloads
    app.use(express.json({ limit: "1mb" }))

    // Sitemap webhook endpoint for automatic updates
    app.post("/api/sitemap/regenerate", async (req, res) => {
        try {
            console.log("🔄 Sitemap regeneration triggered via webhook")
            const result = await generateSitemap()

            res.json({
                success: true,
                message: "Sitemap regenerated successfully",
                ...result,
                regeneratedAt: new Date().toISOString(),
            })
        } catch (error) {
            console.error("❌ Webhook sitemap regeneration failed:", error)
            res.status(500).json({
                success: false,
                error: error.message,
                timestamp: new Date().toISOString(),
            })
        }
    })

    // Sitemap status endpoint
    app.get("/api/sitemap/status", (req, res) => {
        try {
            const sitemapPath = resolve(__dirname, "../public/sitemap.xml")
            const stats = fs.statSync(sitemapPath)

            res.json({
                exists: true,
                lastModified: stats.mtime.toISOString(),
                size: stats.size,
                sizeFormatted: `${(stats.size / 1024).toFixed(2)}KB`,
            })
        } catch (error) {
            res.json({
                exists: false,
                error: "Sitemap not found",
            })
        }
    })

    // ==================== UNIVERSAL LINKS / APP LINKS ====================
    // Apple App Site Association (for iOS Universal Links)
    app.get("/.well-known/apple-app-site-association", (req, res) => {
        try {
            // Try production path first (dist), then development path (public)
            const prodPath = resolve(__dirname, "../dist/.well-known/apple-app-site-association")
            const devPath = resolve(__dirname, "../public/.well-known/apple-app-site-association")
            const filePath = fs.existsSync(prodPath) ? prodPath : devPath

            // Check if file exists
            if (!fs.existsSync(filePath)) {
                console.error("❌ apple-app-site-association not found")
                console.error("   Tried production path:", prodPath)
                console.error("   Tried development path:", devPath)
                return res.status(404).json({ error: "File not found" })
            }

            // Read file directly and send content
            const fileContent = fs.readFileSync(filePath, "utf-8")
            console.log("✅ Serving apple-app-site-association from:", filePath)
            
            res.setHeader("Content-Type", "application/json")
            res.setHeader("Cache-Control", "public, max-age=3600")
            res.send(fileContent)
        } catch (error) {
            console.error("❌ Error serving apple-app-site-association:", error)
            res.status(500).json({ error: "Internal server error" })
        }
    })

    // Android Asset Links (for Android App Links)
    app.get("/.well-known/assetlinks.json", (req, res) => {
        try {
            // Try production path first (dist), then development path (public)
            const prodPath = resolve(__dirname, "../dist/.well-known/assetlinks.json")
            const devPath = resolve(__dirname, "../public/.well-known/assetlinks.json")
            const filePath = fs.existsSync(prodPath) ? prodPath : devPath

            // Check if file exists
            if (!fs.existsSync(filePath)) {
                console.error("❌ assetlinks.json not found")
                console.error("   Tried production path:", prodPath)
                console.error("   Tried development path:", devPath)
                return res.status(404).json({ error: "File not found" })
            }

            // Read file directly and send content
            const fileContent = fs.readFileSync(filePath, "utf-8")
            console.log("✅ Serving assetlinks.json from:", filePath)
            
            res.setHeader("Content-Type", "application/json")
            res.setHeader("Cache-Control", "public, max-age=3600")
            res.send(fileContent)
        } catch (error) {
            console.error("❌ Error serving assetlinks.json:", error)
            res.status(500).json({ error: "Internal server error" })
        }
    })

    // ==================== DEEP LINK ROUTES ====================
    // Helper function to detect mobile and platform
    const getMobileInfo = (userAgent) => {
        const ua = (userAgent || "").toLowerCase()
        return {
            isMobile: /android|iphone|ipad|ipod/i.test(userAgent),
            isAndroid: /android/i.test(userAgent),
            isIOS: /iphone|ipad|ipod/i.test(userAgent),
        }
    }

    // Deep link HTML template
    const getDeepLinkHTML = (type, id, isAndroid, isIOS) => `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>فتح تطبيق تحيا مصر</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #1e40af 0%, #991b1b 100%);
            color: white;
            padding: 20px;
            text-align: center;
        }
        .container {
            max-width: 400px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }
        h1 {
            font-size: 24px;
            margin-bottom: 20px;
        }
        .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 30px auto;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .button {
            display: inline-block;
            margin: 10px;
            padding: 15px 30px;
            background: white;
            color: #1e40af;
            text-decoration: none;
            border-radius: 10px;
            font-weight: bold;
            transition: transform 0.2s;
        }
        .button:hover {
            transform: scale(1.05);
        }
        .message {
            margin-top: 20px;
            font-size: 14px;
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>جاري فتح التطبيق...</h1>
        <div class="spinner"></div>
        <p class="message" id="message">يرجى الانتظار</p>
        <div id="buttons" style="display: none;">
            <a href="https://tahyamisryu.com/${type}/${id}" class="button">
                فتح في المتصفح
            </a>
            <a href="${
                isAndroid ? "https://play.google.com/store/apps/details?id=com.tahya_misr.youth" : "https://apps.apple.com/app/tahya-misr/id123456789"
            }" 
               class="button">
                تحميل التطبيق
            </a>
        </div>
    </div>
    
    <script>
        const deepLink = 'tahyamisr://${type}/${id}';
        const isIOS = ${isIOS};
        
        // Attempt to open app
        window.location.href = deepLink;
        
        let appOpened = false;
        
        // Check if app opened
        const showFallback = () => {
            if (!appOpened) {
                document.getElementById('message').textContent = 'لم يتم العثور على التطبيق';
                document.getElementById('buttons').style.display = 'block';
            }
        };
        
        // Listen for page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                appOpened = true;
            }
        });
        
        // For iOS
        if (isIOS) {
            setTimeout(() => {
                if (!document.hidden) {
                    showFallback();
                }
            }, 2500);
        } else {
            // Android
            window.addEventListener('blur', () => {
                appOpened = true;
            });
            
            setTimeout(showFallback, 2500);
        }
    </script>
</body>
</html>
    `

    // News deep link
    app.get("/app/news/:id", (req, res) => {
        const { id } = req.params
        const { isMobile, isAndroid, isIOS } = getMobileInfo(req.headers["user-agent"])

        if (isMobile) {
            return res.send(getDeepLinkHTML("news", id, isAndroid, isIOS))
        }

        // Desktop: continue to next handler (will be handled by SSR)
        return res.redirect(`/news/${id}`)
    })

    // Events deep link
    app.get("/app/events/:id", (req, res) => {
        const { id } = req.params
        const { isMobile, isAndroid, isIOS } = getMobileInfo(req.headers["user-agent"])

        if (isMobile) {
            return res.send(getDeepLinkHTML("events", id, isAndroid, isIOS))
        }

        return res.redirect(`/events/${id}`)
    })

    // Achievements deep link
    app.get("/app/achievements/:id", (req, res) => {
        const { id } = req.params
        const { isMobile, isAndroid, isIOS } = getMobileInfo(req.headers["user-agent"])

        if (isMobile) {
            return res.send(getDeepLinkHTML("achievements", id, isAndroid, isIOS))
        }

        res.redirect("https://tahyamisryu.com/#achievements")
    })

    // Activities deep link
    app.get("/app/activities/:id", (req, res) => {
        const { id } = req.params
        const { isMobile, isAndroid, isIOS } = getMobileInfo(req.headers["user-agent"])

        if (isMobile) {
            return res.send(getDeepLinkHTML("activities", id, isAndroid, isIOS))
        }

        res.redirect("https://tahyamisryu.com/#activities")
    })

    // App install redirect
    app.get("/app/install", (req, res) => {
        const { isAndroid, isIOS } = getMobileInfo(req.headers["user-agent"])

        if (isAndroid) {
            return res.redirect("https://play.google.com/store/apps/details?id=com.tahyamisr.app")
        } else if (isIOS) {
            return res.redirect("https://apps.apple.com/app/tahya-misr/id123456789")
        }

        res.redirect("https://tahyamisryu.com/")
    })

    // ==================== END DEEP LINK ROUTES ====================

    let vite
    if (!isProduction) {
        // Development: Create Vite dev server in middleware mode
        const { createServer } = await import("vite")
        vite = await createServer({
            server: { middlewareMode: true },
            appType: "custom",
            root: resolve(__dirname, ".."),
            ssr: {
                noExternal: ["react-router-dom", "react-router"],
            },
            optimizeDeps: {
                include: ["react-router-dom"],
                force: true,
            },
        })
        app.use(vite.middlewares)
    } else {
        // Production: Serve static files
        app.use("/assets", express.static(resolve(__dirname, "../dist/assets")))
        app.use("/", express.static(resolve(__dirname, "../dist"), { index: false }))
    }

    app.use("/", async (req, res, next) => {
        // Skip if not a GET request
        if (req.method !== "GET") {
            return next()
        }
        const url = req.originalUrl

        try {
            // Check if this is a SPA-only route
            const isSpaOnlyRoute = spaOnlyRoutes.some((route) => url.startsWith(route))

            let template
            let render

            if (!isProduction) {
                // Development: Read template and transform it with Vite
                template = fs.readFileSync(resolve(__dirname, "../index.html"), "utf-8")
                template = await vite.transformIndexHtml(url, template)
                render = (await vite.ssrLoadModule("/src/entry-server.jsx")).render
            } else {
                // Production: Use pre-built template and server bundle
                template = fs.readFileSync(resolve(__dirname, "../dist/index.html"), "utf-8")
                render = (await import("../dist/server/entry-server.js")).render
            }

            if (isSpaOnlyRoute) {
                // For SPA-only routes, serve the template as-is (no SSR)
                res.status(200).set({ "Content-Type": "text/html" }).end(template)
                return
            }

            // Generate comprehensive page metadata using SEO configuration
            const meta = await getPageMeta(url, "ar")

            // Server-side render the React app
            const { pipe } = await render(url, { meta })
            // Split template around the app placeholder
            let [htmlStart, htmlEnd] = template.split("<!--app-html-->")
            if (!htmlStart || !htmlEnd) {
                res.status(500).send("Invalid HTML template: missing <!--app-html-->")
                return
            }
            if (meta) {
                // Generate comprehensive meta tags HTML
                const metaTags = `
                    <!-- SEO Meta Tags -->
                    <title>${meta.title}</title>
                    <meta name="description" content="${meta.description}" />
                    <meta name="keywords" content="${meta.keywords}" />
                    <meta name="author" content="${meta.author}" />
                    <meta name="robots" content="index, follow" />
                    <meta name="theme-color" content="#1e40af" />

                    <!-- Open Graph / Facebook -->
                    <meta property="og:type" content="${meta.type}" />
                    <meta property="og:title" content="${meta.title}" />
                    <meta property="og:description" content="${meta.description}" />
                    <meta property="og:image" content="${meta.image}" />
                    <meta property="og:image:width" content="1200" />
                    <meta property="og:image:height" content="630" />
                    <meta property="og:image:alt" content="${meta.title}" />
                    <meta property="og:url" content="${meta.url}" />
                    <meta property="og:locale" content="${meta.locale}_${meta.locale.toUpperCase()}" />
                    <meta property="og:site_name" content="اتحاد شباب تحيا مصر" />
                    <meta property="fb:app_id" content="" /><!-- Add your Facebook App ID here if you have one -->

                    <!-- Twitter Card -->
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content="${meta.title}" />
                    <meta name="twitter:description" content="${meta.description}" />
                    <meta name="twitter:image" content="${meta.image}" />

                    <!-- Canonical URL -->
                    <link rel="canonical" href="${meta.url}" />

                    <!-- Additional SEO -->
                    <meta name="language" content="${meta.locale}" />
                    <meta http-equiv="Content-Language" content="${meta.locale}" />

                    <!-- Structured Data (JSON-LD) -->
                    ${meta.structuredData ? `<script type="application/ld+json">${JSON.stringify(meta.structuredData)}</script>` : ""}
                `

                // Clean existing meta tags and inject new ones
                htmlStart = htmlStart
                    // Remove existing SEO tags
                    .replace(/<title>.*?<\/title>/gi, "")
                    .replace(/<meta name="description"[^>]*>/gi, "")
                    .replace(/<meta name="keywords"[^>]*>/gi, "")
                    .replace(/<meta name="author"[^>]*>/gi, "")
                    .replace(/<meta property="og:[^"]*"[^>]*>/gi, "")
                    .replace(/<meta name="twitter:[^"]*"[^>]*>/gi, "")
                    .replace(/<link rel="canonical"[^>]*>/gi, "")
                    // Inject new comprehensive meta tags
                    .replace("</head>", `${metaTags}</head>`)
            }
            if (!htmlStart || !htmlEnd) {
                // Fallback if template doesn't have the placeholder
                res.status(200).set({ "Content-Type": "text/html" }).end(template)
                return
            }

            // Set response headers
            res.status(200).set({ "Content-Type": "text/html" })

            // Write opening HTML
            res.write(htmlStart)

            // Create a transform stream to handle the end
            const endTransform = new Transform({
                transform(chunk, encoding, callback) {
                    callback(null, chunk)
                },
                flush(callback) {
                    // Write closing HTML when stream ends
                    this.push(htmlEnd)
                    callback()
                },
            })

            // Pipe: React stream -> transform -> response
            pipe(endTransform)
            endTransform.pipe(res)
        } catch (error) {
            // On error, fall back to the template
            if (!isProduction && vite) {
                vite.ssrFixStacktrace(error)
            }
            console.error("SSR Error:", error)

            let template
            if (!isProduction) {
                template = fs.readFileSync(resolve(__dirname, "../index.html"), "utf-8")
                template = await vite.transformIndexHtml(url, template)
            } else {
                template = fs.readFileSync(resolve(__dirname, "../dist/index.html"), "utf-8")
            }

            res.status(500).set({ "Content-Type": "text/html" }).end(template)
        }
    })

    // Schedule sitemap generation every day at midnight
    cron.schedule("0 0 * * *", async () => {
        try {
            console.log("🕒 Running daily sitemap generation cronjob...")
            const result = await generateSitemap()
            console.log("✅ Sitemap generated by cronjob:", result)
        } catch (error) {
            console.error("❌ Cronjob sitemap generation failed:", error)
        }
    })

    return { app, vite }
}

createServer().then(({ app }) => {
    app.listen(port, () => {
        console.log(`🚀 Server running at http://localhost:${port}`)
        console.log(`📄 SSR enabled for public routes`)
        console.log(`⚡ SPA mode for: ${spaOnlyRoutes.join(", ")}`)
        console.log(`🔗 Deep links enabled: /app/news/:id, /app/events/:id, /app/achievements/:id, /app/activities/:id`)
    })
})
