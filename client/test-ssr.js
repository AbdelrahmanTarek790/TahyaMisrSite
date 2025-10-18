import { default as fetch } from "node-fetch"

async function testSSR() {
    const testUrls = [
        "http://localhost:5173/",
        "http://localhost:5173/about",
        "http://localhost:5173/contact",
        "http://localhost:5173/news",
        "http://localhost:5173/events",
    ]

    console.log("🧪 Testing SSR Implementation...\n")

    for (const url of testUrls) {
        try {
            const response = await fetch(url)
            const html = await response.text()

            // Check if HTML contains actual content (not just a root div)
            const hasContent = html.includes("<div") && !html.match(/<div id="root"><\/div>/) && html.includes("</div>")

            // Check for meta tags
            const hasMetaTags = html.includes('<meta name="description"') || html.includes('<meta property="og:title"')

            // Check for title tag
            const hasTitle = html.includes("<title>") && !html.includes("<title></title>")

            console.log(`📄 ${url}`)
            console.log(`   ✅ SSR Content: ${hasContent ? "Yes" : "No"}`)
            console.log(`   ✅ Meta Tags: ${hasMetaTags ? "Yes" : "No"}`)
            console.log(`   ✅ Title Tag: ${hasTitle ? "Yes" : "No"}`)
            console.log("")
        } catch (error) {
            console.log(`❌ ${url}: ${error.message}\n`)
        }
    }

    // Test SPA-only routes
    console.log("🔒 Testing SPA-only routes...\n")

    const spaUrls = ["http://localhost:5173/dashboard", "http://localhost:5173/admin"]

    for (const url of spaUrls) {
        try {
            const response = await fetch(url)
            const html = await response.text()

            // SPA routes should return the template with minimal content
            const isSpaMode = html.includes("<!--app-html-->") || html.includes('<div id="root"></div>')

            console.log(`🔒 ${url}`)
            console.log(`   ✅ SPA Mode: ${isSpaMode ? "Yes" : "No"}`)
            console.log("")
        } catch (error) {
            console.log(`❌ ${url}: ${error.message}\n`)
        }
    }
}

testSSR().catch(console.error)
