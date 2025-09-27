// scripts/generate-sitemap.js
import fs from "fs"
import path from "path"
import { SitemapStream, streamToPromise } from "sitemap"
import { createWriteStream } from "fs"
import fetch from "node-fetch" // only if Node <18; for Node >=18, use global fetch

// Base url for your site
const BASE_URL = process.env.SITE_URL || "https://tahyamisryu.com"

// Static routes
const staticRoutes = [
    "/",
    "/about",
    "/contact",
    "/news",
    "/events",
    "/journey",
    "/help",
    "/terms",
    "/privacy",
    "/faq",
    "/join",
    "/login",
    "/register",
]

// If you have dynamic slugs, fetch them from your API or DB
async function getDynamicPaths() {
    try {
        const res = await fetch("https://form.codepeak.software/api/v1/news")
        console.log(res)

        const json = await res.json()
        console.log(json);
        
        return json.data?.news.map((item) => `/news/${item.slug}`) || []
    } catch (err) {
        console.error("Error fetching dynamic paths:", err.message)
        return []
    }
}

async function generate() {
    const sitemapPath = path.resolve("public/sitemap.xml")
    const ws = createWriteStream(sitemapPath)
    const smStream = new SitemapStream({ hostname: BASE_URL })

    smStream.pipe(ws)

    // Add static
    staticRoutes.forEach((r) => smStream.write({ url: r, changefreq: "weekly", priority: 0.7 }))

    // Add dynamic
    const dynamic = await getDynamicPaths()
    dynamic.forEach((r) => smStream.write({ url: r, changefreq: "monthly", priority: 0.6 }))

    smStream.end()
    await streamToPromise(smStream)

    console.log("✅ Sitemap written to", sitemapPath)
}

generate().catch((err) => {
    console.error(err)
    process.exit(1)
})
