import EventsClient from "./EventsClient"

// Generate metadata for SEO
export const metadata = {
    title: "الفعاليات والأنشطة - اتحاد شباب تحيا مصر | Events",
    description: "اكتشف ورش العمل، المؤتمرات، الفعاليات الثقافية والأنشطة المجتمعية التي ينظمها اتحاد شباب تحيا مصر. سجل الآن للمشاركة",
    keywords: "فعاليات, events, أنشطة, ورش عمل, مؤتمرات, تدريب, اتحاد شباب تحيا مصر, youth activities",
    openGraph: {
        title: "فعاليات اتحاد شباب تحيا مصر",
        description: "اكتشف الفعاليات والأنشطة القادمة",
        url: "https://tahyamisryu.com/events",
        siteName: "اتحاد شباب تحيا مصر",
        images: [
            {
                url: "https://tahyamisryu.com/Logo.webp",
                width: 1200,
                height: 630,
                alt: "فعاليات اتحاد شباب تحيا مصر",
            },
        ],
        locale: "ar_EG",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "فعاليات اتحاد شباب تحيا مصر",
        description: "الفعاليات والأنشطة القادمة",
        images: ["https://tahyamisryu.com/Logo.webp"],
    },
    alternates: {
        canonical: "https://tahyamisryu.com/events",
    },
}

// Fetch initial events data on server
async function getInitialEvents() {
    try {
        const response = await fetch(
            "https://tmbackend.tahyamisryu.com/api/v1/events?page=1&limit=9",
            { next: { revalidate: 300 } } // Revalidate every 5 minutes
        )

        if (!response.ok) {
            return { events: [], total: 0 }
        }

        const data = await response.json()
        return {
            events: data.data.events || [],
            total: data.data.pagination?.total || 0,
        }
    } catch (error) {
        console.error("Failed to fetch events:", error)
        return { events: [], total: 0 }
    }
}

export default async function PublicEventsPage() {
    const initialData = await getInitialEvents()

    return (
        <>
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CollectionPage",
                        name: "فعاليات اتحاد شباب تحيا مصر",
                        description: "مجموعة الفعاليات والأنشطة الشبابية",
                        url: "https://tahyamisryu.com/events",
                        inLanguage: "ar",
                        isPartOf: {
                            "@type": "WebSite",
                            name: "اتحاد شباب تحيا مصر",
                            url: "https://tahyamisryu.com",
                        },
                    }),
                }}
            />
            <EventsClient initialEvents={initialData.events} initialTotal={initialData.total} />
        </>
    )
}

export const revalidate = 300 // Revalidate page every 5 minutes
