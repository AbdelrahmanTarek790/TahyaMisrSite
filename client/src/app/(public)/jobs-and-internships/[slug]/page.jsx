import JobDetailClient from "./JobDetailClient"
import { notFound } from "next/navigation"

async function getJob(slug) {
    try {
        const response = await fetch(`https://tmbackend.tahyamisryu.com/api/v1/jobs-and-internships/${slug}`, {
            next: { revalidate: 60 },
        })

        if (!response.ok) return null
        const data = await response.json()
        return data.data
    } catch (error) {
        console.error("Failed to fetch job details:", error)
        return null
    }
}

export async function generateMetadata({ params }) {
    const { slug } = await params

    const job = await getJob(slug)

    if (!job) {
        return {
            title: "غير موجود | اتحاد شباب تحيا مصر",
        }
    }

    const labels = {
        trainings: "تدريب",
        scholarships: "منحة",
        jobs: "وظيفة",
        trips: "رحلة",
        camps: "معسكر",
    }
    const catLabel = labels[job.category] || job.category

    return {
        title: `${job.title} | ${catLabel} - اتحاد شباب تحيا مصر`,
        description: job.description.substring(0, 160) + "...",
        openGraph: {
            title: job.title,
            description: job.description.substring(0, 160) + "...",
            imageUrl: [
                {
                    url: job.imageUrl.startsWith('http') ? job.imageUrl : `https://tmbackend.tahyamisryu.com${job.imageUrl}`,
                    width: 1200,
                    height: 630,
                    alt: job.title,
                },
            ],
            type: "article",
            publishedTime: job.createdAt,
        },
    }
}

export default async function JobDetailPage({ params }) {
    const { slug } = await params
    
    const job = await getJob(slug)

    if (!job) {
        notFound()
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "JobPosting", // Note: generic fallback, could be Course depending on category
                        title: job.title,
                        description: job.description,
                        datePosted: job.createdAt,
                        imageUrl: job.imageUrl.startsWith('http') ? job.imageUrl : `https://tmbackend.tahyamisryu.com${job.imageUrl}`,
                        hiringOrganization: {
                            "@type": "Organization",
                            name: "اتحاد شباب تحيا مصر",
                            sameAs: "https://tahyamisryu.com"
                        }
                    }),
                }}
            />
            <JobDetailClient job={job} />
        </>
    )
}
