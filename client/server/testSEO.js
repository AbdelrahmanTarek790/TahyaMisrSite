// Test script to verify the new SEO system
import { getPageMeta } from "./getPageMeta.js"

async function testSEOSystem() {
    console.log("🧪 Testing SEO System...")
    console.log("=" * 50)

    // Test different page types
    const testUrls = ["/", "/about", "/team", "/news", "/contact", "/news/test-news-id", "/news/invalid-id", "/unknown-page"]

    for (const url of testUrls) {
        console.log(`\n📄 Testing URL: ${url}`)
        console.log("-".repeat(30))

        try {
            const meta = await getPageMeta(url, "ar")

            console.log(`✅ Title: ${meta.title}`)
            console.log(`✅ Description: ${meta.description.substring(0, 100)}...`)
            console.log(`✅ Keywords: ${meta.keywords}`)
            console.log(`✅ Image: ${meta.image}`)
            console.log(`✅ URL: ${meta.url}`)
            console.log(`✅ Type: ${meta.type}`)
            console.log(`✅ Author: ${meta.author}`)
            console.log(`✅ Locale: ${meta.locale}`)
            console.log(`✅ Structured Data: ${meta.structuredData ? "Present" : "Missing"}`)

            if (meta.structuredData) {
                console.log(`✅ Schema Type: ${meta.structuredData["@type"]}`)
            }
        } catch (error) {
            console.error(`❌ Error testing ${url}:`, error.message)
        }
    }

    console.log("\n🎉 SEO System Test Complete!")
}

// Run the test
testSEOSystem().catch(console.error)
