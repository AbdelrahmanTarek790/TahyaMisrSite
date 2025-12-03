import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { ArrowLeft, Calendar, MapPin, Clock, Share2, Facebook, Twitter, Linkedin, Users, User } from "lucide-react"
import { eventsAPI } from "../../api"
import Logo from "../../assets/Logo.webp"
import { useAuth } from "@/context/AuthContext"
import GuestEventRegisterDialog from "@/components/dialogs/GuestEventRegisterDialog"

const EventDetailPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [event, setEvent] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [relatedEvents, setRelatedEvents] = useState([])
    const [isRegistering, setIsRegistering] = useState(false)
    const [guestDialogOpen, setGuestDialogOpen] = useState(false)
    const [isRegistered, setIsRegistered] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([fetchEvent(), fetchRelatedEvents()])
        }
        fetchData()
    }, [id, user])

    const fetchEvent = async () => {
        try {
            setIsLoading(true)
            // For public access, make direct fetch request
            const response = await fetch(`https://form.codepeak.software/api/v1/events/${id}`)
            if (response.ok) {
                const data = await response.json()
                const eventData = data.event || data.data
                setEvent(eventData)

                // Check if user is already registered (if logged in)
                if (user?._id && eventData.registeredUsers) {
                    setIsRegistered(eventData.registeredUsers.some((u) => u._id === user._id))
                }
            } else {
                setError("Event not found")
            }
        } catch (error) {
            console.error("Failed to fetch event:", error)
            setError("Failed to load event")
        } finally {
            setIsLoading(false)
        }
    }

    const fetchRelatedEvents = async () => {
        try {
            const response = await fetch(`https://form.codepeak.software/api/v1/events?limit=3`)
            if (response.ok) {
                const data = await response.json()
                setRelatedEvents((data.data.events || data.data || []).filter((item) => item._id !== id).slice(0, 3))
            }
        } catch (error) {
            console.error("Failed to fetch related events:", error)
        }
    }

    const formatDate = (dateString) => {
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

    const formatTime = (dateString) => {
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

    const isEventPast = (dateString) => {
        return new Date(dateString) < new Date()
    }

    const isEventToday = (dateString) => {
        const eventDate = new Date(dateString)
        const today = new Date()
        return eventDate.getDate() === today.getDate() && eventDate.getMonth() === today.getMonth() && eventDate.getFullYear() === today.getFullYear()
    }

    const handleRegistration = async () => {
        const token = localStorage.getItem("token")
        if (!token) {
            setGuestDialogOpen(true)
            return
        }

        try {
            setIsRegistering(true)
            await eventsAPI.register(id)
            setIsRegistered(true)
        } catch (error) {
            console.error("Failed to register for event:", error)
            setError(error.error || "Failed to register for event")
        } finally {
            setIsRegistering(false)
        }
    }

    const submitGuestRegistration = async (payload, reset) => {
        try {
            setIsRegistering(true)
            await eventsAPI.guestRegister(id, payload)
            setIsRegistered(true)
            setGuestDialogOpen(false)
            reset?.()
        } catch (error) {
            console.error("Failed to guest-register for event:", error)
            setError(error.error || "تعذر التسجيل كضيف")
        } finally {
            setIsRegistering(false)
        }
    }

    const shareOnSocial = (platform) => {
        const url = window.location.href
        const title = event?.title

        let shareUrl = ""
        switch (platform) {
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
                break
            case "twitter":
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
                break
            case "linkedin":
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
                break
        }

        if (shareUrl) {
            window.open(shareUrl, "_blank", "width=600,height=400")
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href)
        // You could add a toast notification here
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-egypt-red mx-auto mb-4"></div>
                    <p className="text-gray-600 font-arabic">جاري تحميل الفعالية...</p>
                </div>
            </div>
        )
    }

    if (error || !event) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4 font-arabic">لم يتم العثور على الفعالية</h1>
                    <p className="text-gray-600 mb-6 font-arabic">{error || "لا يمكن العثور على الفعالية المطلوبة."}</p>
                    <Link to="/public/events">
                        <Button className="font-arabic">
                            <ArrowLeft className="ml-2 h-4 w-4" />
                            العودة للفعاليات
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50">
            {/* Header Navigation */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 font-arabic">
                        <ArrowLeft className="ml-2 h-4 w-4" />
                        العودة
                    </Button>
                </div>
            </div>

            {/* Event Content */}
            <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Image */}
                {event.image && (
                    <div className="mb-8 rounded-xl overflow-hidden shadow-elegant">
                        <img
                            src={`https://form.codepeak.software/uploads/${event.image}`}
                            crossOrigin="anonymous"
                            alt={event.title}
                            className="w-full h-64 md:h-96 object-cover"
                            onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=400&fit=crop"
                            }}
                        />
                    </div>
                )}

                {/* Event Header */}
                <div className="bg-white rounded-xl shadow-elegant p-8 mb-8">
                    <header className="mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            {isEventPast(event.date) && (
                                <span className="px-3 py-1 bg-gray-500 text-white text-sm font-medium rounded-full font-arabic">انتهت</span>
                            )}
                            {isEventToday(event.date) && (
                                <span className="px-3 py-1 bg-egypt-red text-white text-sm font-medium rounded-full font-arabic">اليوم</span>
                            )}
                            {!isEventPast(event.date) && !isEventToday(event.date) && (
                                <span className="px-3 py-1 bg-egypt-gold text-black text-sm font-medium rounded-full font-arabic">قادمة</span>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight font-arabic text-right">{event.title}</h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
                            <div className="flex items-center justify-end font-arabic">
                                <span>
                                    {formatDate(event.date)} في {formatTime(event.date)}
                                </span>
                                <Calendar className="ml-2 h-4 w-4" />
                            </div>

                            <div className="flex items-center justify-end font-arabic">
                                <span>{event.location}</span>
                                <MapPin className="ml-2 h-4 w-4" />
                            </div>

                            <div className="flex items-center justify-end font-arabic">
                                <span>{event.registeredUsers?.length || 0} مسجل</span>
                                <Users className="ml-2 h-4 w-4" />
                            </div>

                            <div className="flex items-center justify-end font-arabic">
                                <span>نظمه {event.createdBy?.name || "الإدارة"}</span>
                                <User className="ml-2 h-4 w-4" />
                            </div>
                        </div>

                        {/* Registration Button */}
                        {!isEventPast(event.date) && (
                            <div className="mb-6">
                                {isRegistered ? (
                                    <Button disabled className="bg-green-600 text-white font-arabic">
                                        ✓ أنت مسجل في هذه الفعالية
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleRegistration}
                                        disabled={isRegistering}
                                        className="bg-egypt-red hover:bg-egypt-red/90 text-white font-arabic"
                                    >
                                        {isRegistering ? "جاري التسجيل..." : "سجل في الفعالية"}
                                    </Button>
                                )}
                            </div>
                        )}

                        {/* Share Buttons */}
                        <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                            <span className="text-sm text-gray-600 ml-2 font-arabic">شارك:</span>
                            <Button variant="outline" size="sm" onClick={() => shareOnSocial("facebook")} className="text-blue-600 hover:bg-blue-50">
                                <Facebook className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => shareOnSocial("twitter")} className="text-blue-400 hover:bg-blue-50">
                                <Twitter className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => shareOnSocial("linkedin")} className="text-blue-700 hover:bg-blue-50">
                                <Linkedin className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={copyToClipboard} className="text-gray-600 hover:bg-gray-50">
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </div>
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
                            <h3 className="font-semibold text-gray-900 mb-2 font-arabic">الحضور</h3>
                            <p className="text-gray-600 font-arabic">{event.registeredUsers?.length || 0} شخص مسجل</p>
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
                                    <Link to={`/events/${relatedEvent._id}`}>
                                        {relatedEvent.image && (
                                            // {`https://form.codepeak.software/uploads/${event.image}`}
                                            <div className="aspect-video overflow-hidden rounded-t-lg">
                                                <img
                                                    crossOrigin="anonymous"
                                                    src={`https://form.codepeak.software/uploads/${relatedEvent.image}`}
                                                    alt={relatedEvent.title}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform"
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
                    <p className="text-xl mb-8 max-w-2xl mx-auto font-arabic text-right leading-relaxed">
                        انضم إلى مجتمعنا للحصول على إشعارات حول الفعاليات القادمة وكن جزءاً من شبكتنا المتنامية
                    </p>
                    <Link to="/register">
                        <Button size="lg" className="bg-white text-egypt-red hover:bg-gray-100 hover:text-egypt-red px-8 py-3 font-arabic">
                            انضم إلى مجتمعنا
                        </Button>
                    </Link>
                </div>
            </section>
            {/* Guest Register Dialog */}
            <GuestEventRegisterDialog
                open={guestDialogOpen}
                onOpenChange={setGuestDialogOpen}
                onSubmit={submitGuestRegistration}
                loading={isRegistering}
            />
        </div>
    )
}

export default EventDetailPage
