// scripts/generate-sitemap.js
import fs from "fs"
import path from "path"
import { SitemapStream, streamToPromise } from "sitemap"
import { createWriteStream } from "fs"
// Node.js 18+ has global fetch

// Base url for your site
const BASE_URL = process.env.SITE_URL || "https://tahyamisryu.com"
const API_BASE = "https://form.codepeak.software/api/v1"

// Static routes with SEO priorities and lastmod
const staticRoutes = [
    { url: "/", changefreq: "daily", priority: 1.0, lastmod: new Date().toISOString() },
    { url: "/about", changefreq: "monthly", priority: 0.9 },
    { url: "/contact", changefreq: "monthly", priority: 0.8 },
    { url: "/news", changefreq: "daily", priority: 0.9, lastmod: new Date().toISOString() },
    { url: "/events", changefreq: "weekly", priority: 0.9, lastmod: new Date().toISOString() },
    { url: "/journey", changefreq: "yearly", priority: 0.7 },
    { url: "/join", changefreq: "monthly", priority: 0.8 },
    { url: "/help", changefreq: "monthly", priority: 0.6 },
    { url: "/terms", changefreq: "yearly", priority: 0.5 },
    { url: "/privacy", changefreq: "yearly", priority: 0.5 },
    { url: "/faq", changefreq: "monthly", priority: 0.7 },
]

// Fetch data with retry logic
async function fetchWithRetry(url, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            console.log(`🔄 Fetching ${url} (attempt ${i + 1}/${retries})`)
            const response = await fetch(url, {
                timeout: 10000,
                headers: {
                    "User-Agent": "Sitemap Generator",
                    Accept: "application/json",
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            console.log(`✅ Successfully fetched ${url}`)
            return data
        } catch (err) {
            console.warn(`⚠️ Attempt ${i + 1} failed for ${url}:`, err.message)
            if (i === retries - 1) throw err
            await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)))
        }
    }
}

// Fetch news articles
async function getNewsArticles() {
    try {
        const json = await fetchWithRetry(`${API_BASE}/news`)
        return json.data?.news || []
    } catch (err) {
        console.error("❌ Error fetching news articles:", err.message)
        return []
    }
}

// Fetch events
async function getEvents() {
    try {
        const json = await fetchWithRetry(`${API_BASE}/events`)
        return json.data?.events || []
    } catch (err) {
        console.error("❌ Error fetching events:", err.message)
        return []
    }
}

// Validate sitemap size and structure
function validateSitemap(filePath) {
    try {
        const stats = fs.statSync(filePath)
        const sizeInMB = (stats.size / 1024 / 1024).toFixed(2)

        if (stats.size > 50 * 1024 * 1024) {
            // 50MB limit
            console.warn(`⚠️ Sitemap is large (${sizeInMB}MB). Consider splitting it.`)
        }

        console.log(`📊 Sitemap size: ${sizeInMB}MB`)
        return true
    } catch (err) {
        console.error("❌ Sitemap validation failed:", err.message)
        return false
    }
}

async function generate() {
    console.log("🚀 Starting sitemap generation...")
    const startTime = Date.now()

    const sitemapPath = path.resolve("dist/sitemap.xml")
    const ws = createWriteStream(sitemapPath)
    const smStream = new SitemapStream({
        hostname: BASE_URL,
        cacheTime: 600000, // 10 min cache period
        xmlns: {
            news: true,
            image: true,
            video: false,
        },
    })

    smStream.pipe(ws)

    // Add static routes
    console.log("📄 Adding static routes...")
    staticRoutes.forEach((route) => smStream.write(route))

    // Fetch and add news articles
    console.log("📰 Fetching news articles...")
    const newsArticles = await getNewsArticles()
    console.log(`📰 Found ${newsArticles.length} news articles`)

    newsArticles.forEach((article) => {
        const lastmod = article.updatedAt || article.createdAt
        smStream.write({
            url: `/news/${article.slug}`,
            changefreq: "monthly",
            priority: 0.6,
            lastmod: new Date(lastmod).toISOString(),

            // Google News fields (only for recent articles)
            news: isRecentArticle(article.createdAt)
                ? {
                      publication: {
                          name: "Tahya Misr Youth News",
                          language: "ar",
                      },
                      publication_date: new Date(article.createdAt).toISOString(),
                      title: article.title,
                  }
                : undefined,

            // Image fields
            img: article.image
                ? {
                      url: `https://form.codepeak.software/uploads/${article.image}`,
                      caption: article.title,
                  }
                : undefined,
        })
    })

    // Fetch and add events
    console.log("🎉 Fetching events...")
    const events = await getEvents()
    console.log(`🎉 Found ${events.length} events`)

    events.forEach((event) => {
        const lastmod = event.updatedAt || event.createdAt
        smStream.write({
            url: `/events/${event.slug}`,
            changefreq: "weekly",
            priority: 0.7,
            lastmod: new Date(lastmod).toISOString(),

            // Image fields
            img: event.image
                ? {
                      url: `https://form.codepeak.software/uploads/${event.image}`,
                      caption: event.title,
                  }
                : undefined,
        })
    })

    smStream.end()
    await streamToPromise(smStream)

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    const totalUrls = staticRoutes.length + newsArticles.length + events.length

    console.log(`✅ Sitemap generated successfully!`)
    console.log(`📊 Total URLs: ${totalUrls}`)
    console.log(`⏱️ Generation time: ${duration}s`)
    console.log(`📁 Saved to: ${sitemapPath}`)

    // Validate the generated sitemap
    validateSitemap(sitemapPath)

    return { totalUrls, duration, filePath: sitemapPath }
}

// Check if article is recent (within 2 days) for Google News
function isRecentArticle(createdAt) {
    const articleDate = new Date(createdAt)
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    return articleDate > twoDaysAgo
}

// Main execution - run if this is the main module
const isMainModule = process.argv[1] && import.meta.url.includes(process.argv[1])
if (isMainModule) {
    console.log("🚀 Starting sitemap generation...")
    generate().catch((err) => {
        console.error("❌ Sitemap generation failed:", err.message)
        console.error(err)
        process.exit(1)
    })
}

export { generate, validateSitemap }
