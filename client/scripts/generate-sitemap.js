// scripts/generate-sitemap.js
import fs from "fs"
import path from "path"
import { SitemapStream, streamToPromise } from "sitemap"
import { createWriteStream } from "fs"
import fetch from "node-fetch" // only if Node <18; for Node >=18, use global fetch

// Base url for your site
const BASE_URL = process.env.SITE_URL || "https://tahyamisryu.com"

// Static routes with SEO priorities
const staticRoutes = [
    { url: "/", changefreq: "daily", priority: 1.0 },
    { url: "/about", changefreq: "monthly", priority: 0.9 },
    { url: "/contact", changefreq: "monthly", priority: 0.8 },
    { url: "/news", changefreq: "daily", priority: 0.9 },
    { url: "/events", changefreq: "weekly", priority: 0.9 },
    { url: "/journey", changefreq: "yearly", priority: 0.7 },
    { url: "/join", changefreq: "monthly", priority: 0.8 },
    { url: "/help", changefreq: "monthly", priority: 0.6 },
    { url: "/terms", changefreq: "yearly", priority: 0.5 },
    { url: "/privacy", changefreq: "yearly", priority: 0.5 },
    { url: "/faq", changefreq: "monthly", priority: 0.7 },
]

// If you have dynamic slugs, fetch them from your API or DB
async function getDynamicPaths() {
    try {
        const res = await fetch("https://form.codepeak.software/api/v1/news")
        const json = await res.json()

        // return full objects instead of just slugs
        return json.data?.news || []
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

    // Add static routes with their SEO configurations
    staticRoutes.forEach((route) => smStream.write(route))

    // Add dynamic
    const dynamic = await getDynamicPaths()

    dynamic.forEach((doc) =>
        smStream.write({
            url: `/news/${doc.slug}`,
            changefreq: "monthly",
            priority: 0.6,

            // Google News fields
            news: {
                publication: {
                    name: "Tahya Misr Youth News",
                    language: "ar",
                },
                publication_date: new Date(doc.createdAt).toISOString(),
                title: doc.title,
            },
            // Image fields
            img: {
                url: `https://form.codepeak.software/uploads/${doc.image}`,
                caption: doc.title,
            },
        })
    )

    smStream.end()
    await streamToPromise(smStream)

    console.log("✅ Sitemap written to", sitemapPath)
}

generate().catch((err) => {
    console.error(err)
    process.exit(1)
})
