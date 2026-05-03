import axios from "axios"

const API_BASE_URL = "https://tmbackend.tahyamisryu.com/api/v1"

export default async function sitemap() {
    const baseUrl = "https://tahyamisryu.com"

    // Static public pages
    const publicRoutes = [
        { route: "", changeFreq: "daily", priority: 1.0 },
        { route: "/about", changeFreq: "monthly", priority: 0.8 },
        { route: "/contact", changeFreq: "monthly", priority: 0.7 },
        { route: "/events", changeFreq: "daily", priority: 0.9 },
        { route: "/faq", changeFreq: "monthly", priority: 0.6 },
        { route: "/help", changeFreq: "monthly", priority: 0.6 },
        { route: "/join", changeFreq: "weekly", priority: 0.9 },
        { route: "/journey", changeFreq: "monthly", priority: 0.7 },
        { route: "/news", changeFreq: "daily", priority: 0.9 },
        { route: "/privacy", changeFreq: "yearly", priority: 0.4 },
        { route: "/team", changeFreq: "monthly", priority: 0.7 },
        { route: "/terms", changeFreq: "yearly", priority: 0.4 },
    ]

    // Static auth pages
    const authRoutes = [
        { route: "/login", changeFreq: "monthly", priority: 0.6 },
        { route: "/forgot-password", changeFreq: "monthly", priority: 0.5 },
    ]

    const staticRoutes = [...publicRoutes, ...authRoutes].map(({ route, changeFreq, priority }) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: changeFreq,
        priority,
    }))

    // Fetch dynamic news posts
    let newsRoutes = []
    try {
        const newsResponse = await axios.get(`${API_BASE_URL}/news?limit=10000`)
        const newsPosts = newsResponse.data?.data.news || []
        // console.log(newsPosts)

        newsRoutes = newsPosts.map((post) => ({
            url: `${baseUrl}/news/${post.slug}`,
            lastModified: new Date(post.updatedAt || post.createdAt),
            changeFrequency: "monthly",
            priority: 0.7,
            images: post.image ? [`https://tmbackend.tahyamisryu.com/uploads/${post.image}`] : [],
            
        }))
    } catch (error) {
        console.error("Error fetching news for sitemap:", error)
    }

    // Fetch dynamic events
    let eventRoutes = []
    try {
        const eventsResponse = await axios.get(`${API_BASE_URL}/events?limit=10000`)
        const events = eventsResponse.data?.data.events || []
        eventRoutes = events.map((event) => ({
            url: `${baseUrl}/events/${event._id}`,
            lastModified: new Date(event.updatedAt || event.createdAt),
            changeFrequency: "weekly",

            priority: 0.8,
            images: [`https://tmbackend.tahyamisryu.com/uploads/${event.image}`],
        }))
    } catch (error) {
        console.error("Error fetching events for sitemap:", error)
    }

    return [...staticRoutes, ...newsRoutes, ...eventRoutes]
}

// ISR: Revalidate sitemap every hour (3600 seconds)
export const revalidate = 3600
