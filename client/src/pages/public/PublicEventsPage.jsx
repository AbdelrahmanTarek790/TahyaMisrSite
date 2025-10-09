import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Search, Calendar, MapPin, Users, ArrowLeft } from "lucide-react"
import Logo from "@/assets/Logo.webp"

const PublicEventsPage = () => {
    const [events, setEvents] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0 })

    useEffect(() => {
        fetchEvents()
    }, [pagination.page])

    const fetchEvents = async () => {
        try {
            setIsLoading(true)
            // For public access, we'll make a request without authentication headers
            const response = await fetch(`https://form.codepeak.software/api/v1/events?page=${pagination.page}&limit=${pagination.limit}`)
            if (response.ok) {
                const data = await response.json()
                setEvents(data.data.events || [])
                setPagination((prev) => ({
                    ...prev,
                    total: data.total || 0,
                }))
            }
        } catch (error) {
            console.error("Failed to fetch events:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredEvents = events.filter(
        (event) =>
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const isEventPast = (dateString) => {
        return new Date(dateString) < new Date()
    }

    const isEventToday = (dateString) => {
        const eventDate = new Date(dateString)
        const today = new Date()
        return eventDate.toDateString() === today.toDateString()
    }

    const getEventStatus = (dateString) => {
        if (isEventToday(dateString)) return { label: "اليوم", className: "bg-egypt-red text-white" }
        if (isEventPast(dateString)) return { label: "انتهى", className: "bg-muted text-muted-foreground" }
        return { label: "قادم", className: "bg-egypt-gold text-white" }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="py-20 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] text-white overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="animate-fade-in">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 font-arabic">
                            الفعاليات و <span className="text-white">الأنشطة</span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90 font-arabic text-right leading-relaxed">
                            اكتشف ورش العمل والمؤتمرات والفعاليات الثقافية والأنشطة المجتمعية التي ينظمها اتحاد شباب تحيا مصر
                        </p>
                    </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-20 left-10 w-20 h-20 bg-white/20 rounded-full animate-float"></div>
                    <div
                        className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full animate-float"
                        style={{ animationDelay: "2s" }}
                    ></div>
                    <div className="absolute top-1/2 left-20 w-16 h-16 bg-white/30 rounded-full animate-float" style={{ animationDelay: "1s" }}></div>
                </div>
            </section>

            {/* Content */}
            <section className="py-20 bg-[linear-gradient(180deg,_rgb(255,255,255),_rgb(245,245,245))]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Search */}
                    <div className="mb-12 animate-fade-in">
                        <div className="relative max-w-md mx-auto">
                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-egypt-gold h-5 w-5" />
                            <Input
                                type="text"
                                placeholder="ابحث في الفعاليات..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pr-12 h-12 border-2 border-egypt-gold/20 focus:border-egypt-gold rounded-xl text-right font-arabic"
                            />
                        </div>
                    </div>

                    {/* Events Grid */}
                    {isLoading && events.length === 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(9)].map((_, i) => (
                                <Card key={i} className="animate-pulse bg-white border-gray-200 overflow-hidden">
                                    <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                                    <CardHeader>
                                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                                        <div className="h-6 bg-gray-300 rounded"></div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="h-3 bg-gray-300 rounded"></div>
                                            <div className="h-3 bg-gray-300 rounded"></div>
                                            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : filteredEvents.length === 0 ? (
                        <Card className="bg-white border-gray-200 shadow-card">
                            <CardContent className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <h3 className="text-lg font-medium text-foreground mb-2 font-arabic">
                                        {searchTerm ? "لم يتم العثور على فعاليات" : "لا توجد فعاليات متاحة"}
                                    </h3>
                                    <p className="text-muted-foreground font-arabic">
                                        {searchTerm ? "جرب تعديل مصطلحات البحث" : "تحقق لاحقاً للحصول على الفعاليات القادمة"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredEvents.map((event, index) => {
                                const status = getEventStatus(event.date)
                                return (
                                    <Card
                                        key={event._id}
                                        className="group overflow-hidden hover:shadow-elegant hover:-translate-y-2 transition-all duration-500 bg-white border-gray-200 animate-slide-up"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        {event.image && (
                                            <div className="aspect-video overflow-hidden relative">
                                                <img
                                                    src={`https://form.codepeak.software/uploads/${event.image}`}
                                                    alt={event.title}
                                                    crossOrigin="anonymous"
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    onError={(e) => {
                                                        e.target.src = Logo
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                <div className="absolute top-4 right-4">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold font-arabic ${status.className}`}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-egypt-red transition-colors duration-300 font-arabic text-right">
                                                {event.title}
                                            </CardTitle>
                                            <CardDescription className="space-y-2">
                                                <div className="flex items-center justify-end text-sm text-egypt-gold font-arabic">
                                                    <span>{formatDate(event.date)}</span>
                                                    <Calendar className="ml-2 h-4 w-4" />
                                                </div>
                                                <div className="flex items-center justify-end text-sm text-muted-foreground font-arabic">
                                                    <span>{event.location}</span>
                                                    <MapPin className="ml-2 h-4 w-4" />
                                                </div>
                                                <div className="flex items-center justify-end text-sm text-muted-foreground font-arabic">
                                                    <span>{(event.registeredUsers?.length || 0) + (event.guestRegistrationsCount || 0)} مسجل</span>
                                                    <Users className="ml-2 h-4 w-4" />
                                                </div>
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground line-clamp-3 mb-4 leading-relaxed font-arabic text-right">
                                                {event.description}
                                            </p>
                                            <div className="flex justify-between items-center">
                                                <Link to={`/events/${event._id}`}>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="group-hover:bg-egypt-gold group-hover:text-white group-hover:border-egypt-gold transition-all duration-300 font-arabic"
                                                    >
                                                        عرض التفاصيل
                                                    </Button>
                                                </Link>
                                                {!isEventPast(event.date) ? (
                                                    <span className="text-xs text-egypt-gold font-arabic">الفعالية قادمة</span>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground font-arabic">انتهت الفعالية</span>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.total > pagination.limit && !searchTerm && (
                        <div className="flex justify-center space-x-3 space-x-reverse mt-12 animate-fade-in">
                            <Button
                                variant="outline"
                                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                                disabled={pagination.page === 1 || isLoading}
                                className="border-egypt-gold text-egypt-red hover:bg-egypt-gold hover:text-white transition-all duration-300 font-arabic"
                            >
                                السابق
                            </Button>
                            <span className="flex items-center px-6 py-2 bg-white border border-gray-200 rounded-lg text-foreground font-medium font-arabic">
                                صفحة {pagination.page} من {Math.ceil(pagination.total / pagination.limit)}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                                disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit) || isLoading}
                                className="border-egypt-gold text-egypt-red hover:bg-egypt-gold hover:text-white transition-all duration-300 font-arabic"
                            >
                                التالي
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] text-white relative overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="animate-fade-in">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 font-arabic">هل أنت مستعد للمشاركة؟</h2>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90 font-arabic text-right leading-relaxed">
                            انضم إلى مجتمعنا للتسجيل في الفعاليات والمشاركة في الأنشطة والتواصل مع زملائك الشباب.
                        </p>
                        <Link to="/register">
                            <Button
                                size="lg"
                                className="bg-white text-egypt-red hover:bg-gray-100 hover:text-egypt-red px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-glow font-arabic"
                            >
                                انضم إلى مجتمعنا
                            </Button>
                        </Link>
                    </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-10 right-10 w-24 h-24 bg-white/10 rounded-full animate-float"></div>
                    <div
                        className="absolute bottom-10 left-10 w-32 h-32 bg-white/20 rounded-full animate-float"
                        style={{ animationDelay: "1.5s" }}
                    ></div>
                    <div
                        className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/20 rounded-full animate-float"
                        style={{ animationDelay: "0.5s" }}
                    ></div>
                </div>
            </section>
        </div>
    )
}

export default PublicEventsPage
