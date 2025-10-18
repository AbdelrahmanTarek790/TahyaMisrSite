// Test all SEO routes
import { getPageMeta } from './getPageMeta.js'

async function testAllRoutes() {
    console.log("🧪 Testing All SEO Routes...")
    console.log("=" * 60)

    const routes = [
        "/",           // home
        "/about",      // about
        "/contact",    // contact
        "/news",       // news
        "/events",     // events
        "/journey",    // journey
        "/join",       // join
        "/help",       // help
        "/terms",      // terms
        "/privacy",    // privacy
        "/faq",        // faq
        "/team",       // team (not in robots.txt but should work)
    ]

    let passedTests = 0
    let failedTests = 0

    for (const route of routes) {
        console.log(`\n📄 Testing Route: ${route}`)
        console.log("-".repeat(40))
        
        try {
            const meta = await getPageMeta(route, "ar")
            
            // Basic validation
            const issues = []
            
            if (!meta.title || meta.title.length < 10) {
                issues.push("❌ Title too short")
            }
            
            if (!meta.description || meta.description.length < 50) {
                issues.push("❌ Description too short")
            }
            
            if (!meta.keywords) {
                issues.push("❌ Keywords missing")
            }
            
            if (!meta.image || !meta.image.startsWith('http')) {
                issues.push("❌ Invalid image URL")
            }
            
            if (!meta.url || !meta.url.startsWith('http')) {
                issues.push("❌ Invalid page URL")
            }
            
            if (!meta.structuredData) {
                issues.push("⚠️ No structured data")
            }
            
            if (issues.length > 0) {
                console.log("⚠️ Issues found:")
                issues.forEach(issue => console.log(`   ${issue}`))
                failedTests++
            } else {
                console.log("✅ All checks passed!")
                passedTests++
            }
            
            console.log(`📋 Title: ${meta.title}`)
            console.log(`📝 Description: ${meta.description.substring(0, 80)}...`)
            console.log(`🔗 URL: ${meta.url}`)
            console.log(`📊 Schema: ${meta.structuredData ? meta.structuredData['@type'] : 'None'}`)
            
        } catch (error) {
            console.error(`❌ Error testing ${route}:`, error.message)
            failedTests++
        }
    }

    console.log("\n" + "=" * 60)
    console.log("📊 Test Results Summary:")
    console.log(`✅ Passed: ${passedTests}`)
    console.log(`❌ Failed: ${failedTests}`)
    console.log(`📈 Success Rate: ${Math.round((passedTests / (passedTests + failedTests)) * 100)}%`)
    
    if (failedTests === 0) {
        console.log("\n🎉 All routes are working perfectly!")
        console.log("🚀 Your SEO system is ready for production!")
    } else {
        console.log("\n⚠️ Some routes need attention.")
    }
    
    console.log("\n🤖 Robots.txt Verification:")
    console.log("The following routes should be allowed in robots.txt:")
    routes.forEach(route => {
        console.log(`Allow: ${route}`)
    })
}

// Run the test
testAllRoutes().catch(console.error)