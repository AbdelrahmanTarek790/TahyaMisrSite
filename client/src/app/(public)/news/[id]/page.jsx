// e:\Programming\Development\ThyaMisr\tahyamisrjsnext\src\app\(public)\news\[id]\page.jsx

import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User, Clock } from "lucide-react"
import Link from "next/link"
import ShareButtons from "./ShareButtons"
import BackButton from "./BackButton"

// Server-side data fetching
async function getNewsItem(id) {
    try {
        const response = await fetch(`https://tmbackend.tahyamisryu.com/api/v1/news/${encodeURIComponent(id)}`, {
            next: { revalidate: 60 }, // Revalidate every 60 seconds
        })

        if (!response.ok) {
            return null
        }

        const data = await response.json()
        return data.news || data.data
    } catch (error) {
        console.error("Failed to fetch news:", error)
        return null
    }
}

async function getRelatedNews(currentId) {
    try {
        const response = await fetch(`https://tmbackend.tahyamisryu.com/api/v1/news?limit=4`, {
            next: { revalidate: 300 }, // Revalidate every 5 minutes
        })

        if (!response.ok) {
            return []
        }

        const data = await response.json()
        const allNews = data.data?.news || data.data || []
        return allNews.filter((item) => item._id !== currentId && item.slug !== currentId).slice(0, 3)
    } catch (error) {
        console.error("Failed to fetch related news:", error)
        return []
    }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }) {
    const params2 = await params
    // console.log(params2)
    const newsItem = await getNewsItem(params2.id)

    if (!newsItem) {
        return {
            title: "لم يتم العثور على الخبر - تحيا مصر",
            description: "الخبر المطلوب غير متوفر",
        }
    }

    return {
        title: `${newsItem.title} - اتحاد شباب تحيا مصر`,
        description: newsItem.content?.substring(0, 160) || "اقرأ المزيد من أخبار اتحاد شباب تحيا مصر",
        keywords: `${newsItem.title}, أخبار, اتحاد شباب تحيا مصر, ${newsItem.category || ""}`,
        openGraph: {
            title: newsItem.title,
            description: newsItem.content?.substring(0, 200),
            images: newsItem.image ? [`https://tmbackend.tahyamisryu.com/uploads/${newsItem.image}`] : ["https://tahyamisryu.com/Logo.webp"],
            type: "article",
            locale: "ar_EG",
            url: `https://tahyamisryu.com/news/${params2.id}`,
            publishedTime: newsItem.createdAt,
            modifiedTime: newsItem.updatedAt || newsItem.createdAt,
            authors: [newsItem.author?.name || "اتحاد شباب تحيا مصر"],
        },
        twitter: {
            card: "summary_large_image",
            title: newsItem.title,
            description: newsItem.content?.substring(0, 200),
            images: newsItem.image ? [`https://tmbackend.tahyamisryu.com/uploads/${newsItem.image}`] : ["https://tahyamisryu.com/Logo.webp"],
        },
        alternates: {
            canonical: `https://tahyamisryu.com/news/${params2.id}`,
        },
    }
}

// Generate static params for static generation (optional)
export async function generateStaticParams() {
    try {
        const response = await fetch("https://tmbackend.tahyamisryu.com/api/v1/news?limit=50")

        if (!response.ok) {
            return []
        }

        const data = await response.json()
        const news = data.data?.news || []

        return news.map((item) => ({
            id: item.slug || item._id,
        }))
    } catch (error) {
        console.error("Failed to generate static params:", error)
        return []
    }
}

// Utility functions
function formatDate(dateString) {
    try {
        const date = new Date(dateString)
        return date.toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
        })
    } catch (error) {
        return dateString
    }
}

function getReadingTime(content) {
    const wordsPerMinute = 200
    const wordCount = content.length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)
    return readingTime + " دقائق قراءة"
}

// Main Server Component
export default async function NewsDetailPage({ params }) {
    const params2 = await params
    const [newsItem, relatedNews] = await Promise.all([getNewsItem(params2.id), getRelatedNews(params2.id)])

    if (!newsItem) {
        notFound()
    }

    // Structured data for SEO
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: newsItem.title,
        description: newsItem.content?.substring(0, 200),
        image: newsItem.image ? `https://tmbackend.tahyamisryu.com/uploads/${newsItem.image}` : "https://tahyamisryu.com/Logo.webp",
        author: {
            "@type": "Organization",
            name: newsItem.author?.name || "اتحاد شباب تحيا مصر",
        },
        publisher: {
            "@type": "Organization",
            name: "اتحاد شباب تحيا مصر",
            logo: {
                "@type": "ImageObject",
                url: "https://tahyamisryu.com/Logo.webp",
            },
        },
        datePublished: newsItem.createdAt,
        dateModified: newsItem.updatedAt || newsItem.createdAt,
        url: `https://tahyamisryu.com/news/${params2.id}`,
        inLanguage: "ar",
        articleBody: newsItem.content,
    }

    return (
        <>
            {/* JSON-LD structured data */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50">
                {/* Header Navigation */}
                <div className="bg-white border-b border-gray-200">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <BackButton />
                    </div>
                </div>

                {/* Article Content */}
                <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Hero Image */}
                    {newsItem.image && (
                        <div className="mb-8 rounded-xl overflow-hidden shadow-elegant">
                            <img
                                src={`https://tmbackend.tahyamisryu.com/uploads/${newsItem.image}`}
                                crossOrigin="anonymous"
                                alt={newsItem.title}
                                className="md:w-1/2 mx-auto object-cover"
                                loading="eager"
                                fetchPriority="high"
                            />
                        </div>
                    )}

                    {/* Article Header */}
                    <div className="bg-white rounded-xl shadow-elegant p-8 mb-8">
                        <header className="mb-6">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight font-arabic text-right">
                                {newsItem.title}
                            </h1>

                            <div className="flex flex-wrap items-center  gap-4 text-sm text-gray-600 mb-6">
                                <div className="flex items-center font-arabic">
                                    <span>{formatDate(newsItem.createdAt)}</span>
                                    <Calendar className="ml-2 h-4 w-4" />
                                </div>

                                <div className="flex items-center font-arabic">
                                    <span>بواسطة {newsItem.author?.name || "الإدارة"}</span>
                                    <User className="ml-2 h-4 w-4" />
                                </div>

                                <div className="flex items-center font-arabic">
                                    <span>{getReadingTime(newsItem.content)}</span>
                                    <Clock className="ml-2 h-4 w-4" />
                                </div>
                            </div>

                            {/* Share Buttons - Client Component */}
                            <ShareButtons title={newsItem.title} />
                        </header>

                        {/* Article Content */}
                        <div className="prose prose-lg max-w-none">
                            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed font-arabic text-right break-words">
                                {newsItem.content}
                            </div>
                        </div>
                    </div>

                    {/* Related Articles */}
                    {relatedNews.length > 0 && (
                        <section className="bg-white rounded-xl shadow-elegant p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-arabic text-right">مقالات ذات صلة</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {relatedNews.map((article) => (
                                    <Card
                                        key={article._id}
                                        className="hover:shadow-elegant transition-shadow cursor-pointer bg-white h-full border-gray-200"
                                    >
                                        <Link href={`/news/${article.slug || article._id}`}>
                                            {article.image && (
                                                <div className="overflow-hidden rounded-t-lg">
                                                    <img
                                                        crossOrigin="anonymous"
                                                        src={`https://tmbackend.tahyamisryu.com/uploads/${article.image}`}
                                                        alt={article.title}
                                                        className="w-full object-cover hover:scale-105 transition-transform"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            )}
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-lg line-clamp-2 font-arabic text-right">{article.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-gray-600 line-clamp-3 mb-2 font-arabic text-right">{article.content}</p>
                                                <div className="flex items-center justify-end text-xs text-gray-500 font-arabic">
                                                    <span>{formatDate(article.createdAt)}</span>
                                                    <Calendar className="ml-1 h-3 w-3" />
                                                </div>
                                            </CardContent>
                                        </Link>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    )}
                </article>

                {/* Call to Action */}
                <section className="py-16 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] text-white mt-12">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold mb-6 font-arabic">هل تريد البقاء على اطلاع؟</h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto font-arabic text-center leading-relaxed">
                            انضم إلى مجتمعنا للحصول على آخر الأخبار والتحديثات مباشرة في لوحة التحكم الخاصة بك
                        </p>
                        <Link href="/join">
                            <Button size="lg" className="bg-white text-egypt-red hover:bg-gray-100 hover:text-egypt-red px-8 py-3 font-arabic">
                                انضم إلى مجتمعنا
                            </Button>
                        </Link>
                    </div>
                </section>
            </div>
        </>
    )
}
