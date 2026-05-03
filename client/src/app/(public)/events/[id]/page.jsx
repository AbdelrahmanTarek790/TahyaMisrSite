import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, User } from "lucide-react"
import Link from "next/link"
import ShareButtons from "./ShareButtons"
import BackButton from "./BackButton"
import EventRegistration from "./EventRegistration"

// Server-side data fetching
async function getEvent(id) {
    try {
        const response = await fetch(`https://tmbackend.tahyamisryu.com/api/v1/events/${id}`, {
            next: { revalidate: 60 }, // Revalidate every 60 seconds
        })

        if (!response.ok) {
            return null
        }

        const data = await response.json()
        return data.event || data.data
    } catch (error) {
        console.error("Failed to fetch event:", error)
        return null
    }
}

async function getRelatedEvents(currentId) {
    try {
        const response = await fetch(`https://tmbackend.tahyamisryu.com/api/v1/events?limit=4`, {
            next: { revalidate: 300 }, // Revalidate every 5 minutes
        })

        if (!response.ok) {
            return []
        }

        const data = await response.json()
        const allEvents = data.data?.events || data.data || []
        return allEvents.filter((item) => item._id !== currentId).slice(0, 3)
    } catch (error) {
        console.error("Failed to fetch related events:", error)
        return []
    }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }) {
    const params2 = await params
    const event = await getEvent(params2.id)

    if (!event) {
        return {
            title: "لم يتم العثور على الفعالية - تحيا مصر",
            description: "الفعالية المطلوبة غير متوفرة",
        }
    }

    return {
        title: `${event.title} - اتحاد شباب تحيا مصر`,
        description: event.description?.substring(0, 160) || "اكتشف فعالياتنا وأنشطتنا المجتمعية",
        keywords: `${event.title}, فعاليات, أنشطة, اتحاد شباب تحيا مصر, ${event.location || ""}`,
        openGraph: {
            title: event.title,
            description: event.description?.substring(0, 200),
            images: event.image ? [`https://tmbackend.tahyamisryu.com/uploads/${event.image}`] : ["https://tahyamisryu.com/Logo.webp"],
            type: "article",
            locale: "ar_EG",
            url: `https://tahyamisryu.com/events/${params2.id}`,
        },
        twitter: {
            card: "summary_large_image",
            title: event.title,
            description: event.description?.substring(0, 200),
            images: event.image ? [`https://tmbackend.tahyamisryu.com/uploads/${event.image}`] : ["https://tahyamisryu.com/Logo.webp"],
        },
        alternates: {
            canonical: `https://tahyamisryu.com/events/${params2.id}`,
        },
    }
}

// Generate static params for static generation (optional)
export async function generateStaticParams() {
    try {
        const response = await fetch("https://tmbackend.tahyamisryu.com/api/v1/events?limit=50")

        if (!response.ok) {
            return []
        }

        const data = await response.json()
        const events = data.data?.events || []

        return events.map((item) => ({
            id: item._id,
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

function formatTime(dateString) {
    try {
        const date = new Date(dateString)
        return date.toLocaleTimeString("ar-EG", {
            hour: "2-digit",
            minute: "2-digit",
        })
    } catch (error) {
        return dateString
    }
}

function isEventPast(dateString) {
    return new Date(dateString) < new Date()
}

function isEventToday(dateString) {
    const eventDate = new Date(dateString)
    const today = new Date()
    return eventDate.toDateString() === today.toDateString()
}

function getEventStatusBadge(dateString) {
    if (isEventToday(dateString)) {
        return <span className="px-3 py-1 bg-egypt-red text-white text-sm font-medium rounded-full font-arabic">اليوم</span>
    }
    if (isEventPast(dateString)) {
        return <span className="px-3 py-1 bg-gray-500 text-white text-sm font-medium rounded-full font-arabic">انتهت</span>
    }
    return <span className="px-3 py-1 bg-egypt-gold text-black text-sm font-medium rounded-full font-arabic">قادمة</span>
}

// Main Server Component
export default async function EventDetailPage({ params }) {
    const params2 = await params
    const [event, relatedEvents] = await Promise.all([getEvent(params2.id), getRelatedEvents(params2.id)])

    if (!event) {
        notFound()
    }

    // Structured data for SEO
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Event",
        name: event.title,
        description: event.description,
        startDate: event.date,
        location: {
            "@type": "Place",
            name: event.location,
            address: {
                "@type": "PostalAddress",
                addressLocality: event.location,
                addressCountry: "EG",
            },
        },
        image: event.image ? `https://tmbackend.tahyamisryu.com/uploads/${event.image}` : "https://tahyamisryu.com/Logo.webp",
        organizer: {
            "@type": "Organization",
            name: event.createdBy?.name || "اتحاد شباب تحيا مصر",
            url: "https://tahyamisryu.com",
        },
        eventStatus: isEventPast(event.date) ? "https://schema.org/EventCancelled" : "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        url: `https://tahyamisryu.com/events/${params2.id}`,
        inLanguage: "ar",
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

                {/* Event Content */}
                <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Hero Image */}
                    {event.image && (
                        <div className="mb-8 rounded-xl overflow-hidden shadow-elegant">
                            <img
                                src={`https://tmbackend.tahyamisryu.com/uploads/${event.image}`}
                                crossOrigin="anonymous"
                                alt={event.title}
                                className="w-full h-64 md:h-96 object-cover"
                                loading="eager"
                                fetchPriority="high"
                            />
                        </div>
                    )}

                    {/* Event Header */}
                    <div className="bg-white rounded-xl shadow-elegant p-8 mb-8">
                        <header className="mb-6">
                            <div className="flex items-center gap-2 mb-4">{getEventStatusBadge(event.date)}</div>

                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight font-arabic text-right">{event.title}</h1>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
                                <div className="flex items-center font-arabic">
                                    <span>
                                        {formatDate(event.date)} في {formatTime(event.date)}
                                    </span>
                                    <Calendar className="ml-2 h-4 w-4" />
                                </div>

                                <div className="flex items-center font-arabic">
                                    <span>{event.location}</span>
                                    <MapPin className="ml-2 h-4 w-4" />
                                </div>

                                {/* <div className="flex items-center justify-end font-arabic">
                                    <span>نظمه {event.createdBy?.name || "الإدارة"}</span>
                                    <User className="ml-2 h-4 w-4" />
                                </div> */}
                            </div>

                            {/* Registration Button - Client Component */}
                            {!isEventPast(event.date) && <EventRegistration eventId={params2.id} />}

                            {/* Share Buttons - Client Component */}
                            <ShareButtons title={event.title} />
                        </header>

                        {/* Event Description */}
                        <div className="prose prose-lg max-w-none">
                            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed font-arabic text-right">{event.description}</div>
                        </div>
                    </div>

                    {/* Event Details Card */}
                    <div className="bg-white rounded-xl shadow-elegant p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-arabic text-right">تفاصيل الفعالية</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="text-right">
                                <h3 className="font-semibold text-gray-900 mb-2 font-arabic">التاريخ والوقت</h3>
                                <p className="text-gray-600 font-arabic">{formatDate(event.date)}</p>
                                <p className="text-gray-600 font-arabic">{formatTime(event.date)}</p>
                            </div>
                            <div className="text-right">
                                <h3 className="font-semibold text-gray-900 mb-2 font-arabic">المكان</h3>
                                <p className="text-gray-600 font-arabic">{event.location}</p>
                            </div>
                            <div className="text-right">
                                <h3 className="font-semibold text-gray-900 mb-2 font-arabic">المنظم</h3>
                                <p className="text-gray-600 font-arabic">{event.createdBy?.name || "الإدارة"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Related Events */}
                    {relatedEvents.length > 0 && (
                        <section className="bg-white rounded-xl shadow-elegant p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-arabic text-right">فعاليات ذات صلة</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {relatedEvents.map((relatedEvent) => (
                                    <Card
                                        key={relatedEvent._id}
                                        className="hover:shadow-elegant transition-shadow cursor-pointer bg-white border-gray-200"
                                    >
                                        <Link href={`/events/${relatedEvent._id}`}>
                                            {relatedEvent.image && (
                                                <div className="aspect-video overflow-hidden rounded-t-lg">
                                                    <img
                                                        crossOrigin="anonymous"
                                                        src={`https://tmbackend.tahyamisryu.com/uploads/${relatedEvent.image}`}
                                                        alt={relatedEvent.title}
                                                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            )}
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-lg line-clamp-2 font-arabic text-right">{relatedEvent.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-gray-600 line-clamp-3 mb-2 font-arabic text-right">
                                                    {relatedEvent.description}
                                                </p>
                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-end text-xs text-gray-500 font-arabic">
                                                        <span>{formatDate(relatedEvent.date)}</span>
                                                        <Calendar className="ml-1 h-3 w-3" />
                                                    </div>
                                                    <div className="flex items-center justify-end text-xs text-gray-500 font-arabic">
                                                        <span>{relatedEvent.location}</span>
                                                        <MapPin className="ml-1 h-3 w-3" />
                                                    </div>
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
                        <h2 className="text-3xl font-bold mb-6 font-arabic">لا تفوت الفعاليات القادمة</h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto font-arabic text-center leading-relaxed">
                            انضم إلى مجتمعنا للحصول على إشعارات حول الفعاليات القادمة وكن جزءاً من شبكتنا المتنامية
                        </p>
                        <Link href="/join">
                            <button className="bg-white text-egypt-red hover:bg-gray-100 hover:text-egypt-red px-8 py-3 rounded-lg font-arabic text-lg font-semibold transition-all">
                                انضم إلى مجتمعنا
                            </button>
                        </Link>
                    </div>
                </section>
            </div>
        </>
    )
}
