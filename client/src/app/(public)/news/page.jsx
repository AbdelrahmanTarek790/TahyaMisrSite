import NewsClient from "./NewsClient"

// Generate metadata for SEO
export const metadata = {
    title: "الأخبار - اتحاد شباب تحيا مصر | News",
    description: "تابع آخر الأخبار والإعلانات والإنجازات من اتحاد شباب تحيا مصر. أخبار الفعاليات، المبادرات، والأنشطة الشبابية",
    keywords: "أخبار, news, إعلانات, فعاليات, مبادرات, اتحاد شباب تحيا مصر, أخبار الشباب",
    openGraph: {
        title: "أخبار اتحاد شباب تحيا مصر",
        description: "آخر الأخبار والإنجازات",
        url: "https://tahyamisryu.com/news",
        siteName: "اتحاد شباب تحيا مصر",
        images: [
            {
                url: "https://tahyamisryu.com/Logo.webp",
                width: 1200,
                height: 630,
                alt: "أخبار اتحاد شباب تحيا مصر",
            },
        ],
        locale: "ar_EG",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "أخبار اتحاد شباب تحيا مصر",
        description: "تابع آخر الأخبار والإنجازات",
        images: ["https://tahyamisryu.com/Logo.webp"],
    },
    alternates: {
        canonical: "https://tahyamisryu.com/news",
    },
}

// Fetch initial news data on server
async function getInitialNews() {
    try {
        const response = await fetch(
            "https://tmbackend.tahyamisryu.com/api/v1/news?page=1&limit=9",
            { next: { revalidate: 300 } } // Revalidate every 5 minutes
        )

        if (!response.ok) {
            return { news: [], total: 0 }
        }

        const data = await response.json()
        return {
            news: data.data.news || [],
            total: data.data.pagination?.total || 0,
        }
    } catch (error) {
        console.error("Failed to fetch news:", error)
        return { news: [], total: 0 }
    }
}

export default async function PublicNewsPage() {
    const initialData = await getInitialNews()

    return (
        <>
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CollectionPage",
                        name: "أخبار اتحاد شباب تحيا مصر",
                        description: "مجموعة أخبار ومقالات اتحاد شباب تحيا مصر",
                        url: "https://tahyamisryu.com/news",
                        inLanguage: "ar",
                        isPartOf: {
                            "@type": "WebSite",
                            name: "اتحاد شباب تحيا مصر",
                            url: "https://tahyamisryu.com",
                        },
                    }),
                }}
            />
            <NewsClient initialNews={initialData.news} initialTotal={initialData.total} />
        </>
    )
}

export const revalidate = 300 // Revalidate page every 5 minutes
