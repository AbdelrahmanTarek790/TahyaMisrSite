// src/server/getNewsMeta.js
import fetch from "node-fetch"

// Mock version — replace with your real API call
export async function getNewsMeta(url) {
    // Match `/news/something`
    const match = url.match(/^\/news\/([^/]+)/)
    if (!match) return null
    console.log("Fetching metadata for", url);
    console.log(match);
    const slug = match[1]

    try {
        // Example: your API endpoint that returns SEO fields for this article
        const response = await fetch(`https://form.codepeak.software/api/v1/news/${slug}`)
        if (!response.ok) throw new Error("Metadata not found")

        const data = await response.json()

        return {
            title: data.title || `News | My App`,
            description: data.description || `Latest news about ${data.title}`,
            image: `https://form.codepeak.software/uploads/${data.image}` || "/assets/default-news.jpg",
        }
    } catch (error) {
        console.error("Failed to fetch news metadata:", error)
        return {
            title: "News | My App",
            description: "Latest news and updates.",
            image: "/assets/default-news.jpg",
        }
    }
}
