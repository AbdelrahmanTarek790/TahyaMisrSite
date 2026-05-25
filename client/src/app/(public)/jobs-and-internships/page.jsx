import JobsClient from "./JobsClient"

// Generate metadata for SEO
export const metadata = {
    title: "الوظائف والتدريبات - اتحاد شباب تحيا مصر",
    description: "اكتشف أحدث الوظائف، المنح الدراسية، والمعسكرات المتاحة للشباب من اتحاد شباب تحيا مصر.",
    keywords: "وظائف, تدريبات, منح, معسكرات, رحلات, اتحاد شباب تحيا مصر",
    openGraph: {
        title: "الوظائف والتدريبات - اتحاد شباب تحيا مصر",
        description: "اكتشف أحدث الفرص للشباب",
        url: "https://tahyamisryu.com/jobs-and-internships",
        siteName: "اتحاد شباب تحيا مصر",
        imageUrl: [
            {
                url: "https://tahyamisryu.com/Logo.webp",
                width: 1200,
                height: 630,
                alt: "فرص اتحاد شباب تحيا مصر",
            },
        ],
        locale: "ar_EG",
        type: "website",
    },
}

async function getInitialJobs() {
    try {
        const response = await fetch(
            "https://tmbackend.tahyamisryu.com/api/v1/jobs-and-internships?page=1&limit=9",
            { next: { revalidate: 300 } }
        )

        if (!response.ok) {
            return { jobs: [], total: 0 }
        }

        const data = await response.json()
        return {
            jobs: data.data?.jobs || data.data || [],
            total: data.data?.pagination?.total || data.count || 0,
        }
    } catch (error) {
        console.error("Failed to fetch jobs:", error)
        return { jobs: [], total: 0 }
    }
}

export default async function PublicJobsPage() {
    const initialData = await getInitialJobs()

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CollectionPage",
                        name: "وظائف وتدريبات اتحاد شباب تحيا مصر",
                        description: "مجموعة من الفرص والوظائف والتدريبات للشباب",
                        url: "https://tahyamisryu.com/jobs-and-internships",
                        inLanguage: "ar",
                    }),
                }}
            />
            <JobsClient initialJobs={initialData.jobs} initialTotal={initialData.total} />
        </>
    )
}

export const revalidate = 300
