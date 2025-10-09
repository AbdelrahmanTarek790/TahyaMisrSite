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
    })
})
