#!/usr/bin/env node
// scripts/sitemap-cron.js
// Periodic sitemap generation script for cron jobs or scheduled tasks

import { generate as generateSitemap } from "./generate-sitemap.js"

const WEBHOOK_URL = process.env.SITEMAP_WEBHOOK_URL // Optional webhook to call after generation

async function runScheduledSitemapUpdate() {
    console.log(`🕒 [${new Date().toISOString()}] Starting scheduled sitemap update...`)

    try {
        // Generate the sitemap
        const result = await generateSitemap()

        console.log(`✅ Scheduled sitemap update completed successfully`)
        console.log(`📊 Generated ${result.totalUrls} URLs in ${result.duration}s`)

        // Optionally notify webhook
        if (WEBHOOK_URL) {
            try {
                const response = await fetch(WEBHOOK_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        type: "sitemap_updated",
                        ...result,
                        timestamp: new Date().toISOString(),
                    }),
                })

                if (response.ok) {
                    console.log(`📡 Webhook notification sent successfully`)
                } else {
                    console.warn(`⚠️ Webhook notification failed: ${response.status}`)
                }
            } catch (webhookError) {
                console.warn(`⚠️ Webhook notification error:`, webhookError.message)
            }
        }

        process.exit(0)
    } catch (error) {
        console.error(`❌ [${new Date().toISOString()}] Scheduled sitemap update failed:`, error.message)
        process.exit(1)
    }
}

runScheduledSitemapUpdate()
