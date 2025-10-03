import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InViewSection, InViewStagger } from "@/components/ui/MotionComponents"
import { Button } from "../ui/enhanced-button"
import { Calendar, MapPin, Users, Clock, ArrowRight, Star } from "lucide-react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Logo from "@/assets/Logo.webp"
const Events = () => {
    const [events, setEvents] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        try {
            setIsLoading(true)
            const response = await fetch("https://form.codepeak.software/api/v1/events?page=1&limit=4")
            if (response.ok) {
                const data = await response.json()
                const eventsData = data.data?.events || []
                // Transform backend data to match component format
                const transformedEvents = eventsData.map((item, index) => ({
                    id: item._id,
                    title: item.title,
                    description: item.description,
                    date: formatDate(item.date),
                    time: formatTime(item.date),
                    location: item.location,
                    attendees: item.registeredUsers?.length || 0,
                    category: "Event",
                    price: "Free",
                    featured: index === 0,
                    image: item.image ? `https://form.codepeak.software/uploads/${item.image}` : Logo,
                }))
                setEvents(transformedEvents)
            }
        } catch (error) {
            console.error("Failed to fetch events:", error)
            // Fallback to empty array if API fails
            setEvents([])
        } finally {
            setIsLoading(false)
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const formatTime = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        })
    }

    return (
        <section id="events-section" className="py-20 bg-[linear-gradient(180deg,_rgb(255,255,255),_rgb(245,245,245))] overflow-hidden">
            <div className="container mx-auto px-6">
                <InViewSection animation="fadeInUp" className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                        <span className="text-egypt-gold">الفعاليات</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        انضم إلينا في فعاليات مثيرة وورش عمل ومبادرات مجتمعية تهدف إلى تمكين وربط الشباب المصري في جميع أنحاء البلاد.
                    </p>
                </InViewSection>

                {isLoading ? (
                    <div>
                        {/* Loading skeleton for featured event */}
                        <div className="mb-16 animate-pulse">
                            <Card className="bg-card border-0 shadow-elegant overflow-hidden">
                                <div className="w-full h-80 bg-gray-300"></div>
                                <CardContent className="p-6">
                                    <div className="h-10 bg-gray-300 rounded"></div>
                                </CardContent>
                            </Card>
                        </div>
                        {/* Loading skeleton for other events */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {[1, 2, 3].map((i) => (
                                <Card key={i} className="bg-card border-border overflow-hidden animate-pulse">
                                    <div className="w-full h-48 bg-gray-300"></div>
                                    <CardContent className="p-6">
                                        <div className="h-6 bg-gray-300 rounded mb-3"></div>
                                        <div className="h-4 bg-gray-300 rounded mb-4"></div>
                                        <div className="space-y-2 mb-4">
                                            <div className="h-3 bg-gray-300 rounded"></div>
                                            <div className="h-3 bg-gray-300 rounded"></div>
                                            <div className="h-3 bg-gray-300 rounded"></div>
                                        </div>
                                        <div className="h-10 bg-gray-300 rounded"></div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : events.length > 0 ? (
                    <InViewStagger staggerDelay={0.3}>
                        {/* Featured Event */}
                        <div className="mb-16">
                            <Card className="group bg-[linear-gradient(145deg,_rgb(255,255,255),_rgb(242,242,242))] border-0 shadow-elegant hover:shadow-glow transition-all duration-500 overflow-hidden">
                                <div className="relative">
                                    <img
                                        src={events[0].image}
                                        alt={events[0].title}
                                        crossOrigin="anonymous"
                                        className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=400&fit=crop"
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-egypt-black/80 via-egypt-black/40 to-transparent"></div>
                                    <div className="absolute top-6 left-6">
                                        <div className="flex items-center space-x-2">
                                            <Star className="w-5 h-5 text-egypt-gold animate-float" />
                                            <span className="bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] text-egypt-white px-4 py-2 rounded-full text-sm font-semibold animate-bounce-in">
                                                مميز
                                            </span>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="text-egypt-white">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="bg-egypt-gold text-egypt-black px-3 py-1 rounded-full text-sm font-semibold">
                                                    {events[0].category}
                                                </span>
                                                {/* <span className="text-egypt-gold font-semibold">{events[0].price}</span> */}
                                            </div>
                                            <h3 className="text-3xl font-bold mb-3">{events[0].title}</h3>
                                            <p className="text-egypt-white/90 mb-4 leading-relaxed max-w-2xl">{events[0].description}</p>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="w-4 h-4 text-egypt-gold" />
                                                    <span>{events[0].date}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Clock className="w-4 h-4 text-egypt-gold" />
                                                    <span>{events[0].time}</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <MapPin className="w-4 h-4 text-egypt-gold" />
                                                    <span>{events[0].location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2 text-muted-foreground">
                                                <Users className="w-5 h-5 text-egypt-red" />
                                                <span className="font-semibold">{events[0].attendees} مسجلين</span>
                                            </div>
                                        </div>
                                        <Link to={`/events/${events[0].id}`}>
                                            <Button
                                                variant="hero"
                                                size="lg"
                                                className="hover:shadow-glow hover:scale-105 transition-all duration-300"
                                            >
                                                <span className="text-sm font-semibold">اقرأ المزيد</span>
                                                <ArrowRight className="w-5 h-5 ml-2" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Other Events */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {events.slice(1).map((event, index) => (
                                <Card
                                    key={event.id}
                                    className="group bg-card border-border hover:shadow-card transition-all duration-500 hover:-translate-y-3 overflow-hidden animate-slide-up"
                                    style={{ animationDelay: `${index * 0.15}s` }}
                                >
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={event.image}
                                            alt={event.title}
                                            crossOrigin="anonymous"
                                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                                            onError={(e) => {
                                                e.target.src = Logo
                                            }}
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-egypt-gold text-egypt-black px-3 py-1 rounded-full text-sm font-semibold">
                                                {event.category}
                                            </span>
                                        </div>
                                        {/* <div className="absolute top-4 right-4">
                                            <span className="bg-egypt-white/90 text-egypt-black px-3 py-1 rounded-full text-sm font-semibold">
                                                {event.price}
                                            </span>
                                        </div> */}
                                    </div>
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-egypt-red transition-colors duration-300">
                                            {event.title}
                                        </h3>
                                        <p className="text-muted-foreground mb-4 leading-relaxed">
                                            {event.description.length > 120 ? event.description.substring(0, 120) + "..." : event.description}
                                        </p>

                                        <div className="space-y-2 mb-4 text-sm">
                                            <div className="flex items-center space-x-2 text-muted-foreground">
                                                <Calendar className="w-4 h-4 text-egypt-gold" />
                                                <span>{event.date}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-muted-foreground">
                                                <Clock className="w-4 h-4 text-egypt-gold" />
                                                <span>{event.time}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-muted-foreground">
                                                <MapPin className="w-4 h-4 text-egypt-gold" />
                                                <span>{event.location}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-muted-foreground">
                                                <Users className="w-4 h-4 text-egypt-red" />
                                                <span>
                                                    {event.attendees}
                                                    مسجلين
                                                </span>
                                            </div>
                                        </div>

                                        <Link to={`/events/${event.id}`}>
                                            <Button
                                                variant="outline"
                                                className="w-full group-hover:bg-egypt-gold group-hover:text-egypt-black group-hover:border-egypt-gold transition-all duration-300"
                                            >
                                                <span className="text-sm font-semibold">اقرأ المزيد</span>
                                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </InViewStagger>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">لا توجد فعاليات متاحة في الوقت الحالي.</p>
                    </div>
                )}

                <div className="text-center animate-bounce-in">
                    <Link to="/events">
                        <Button variant="cta" size="lg" className="hover:shadow-glow hover:scale-105 transition-all duration-300">
                            <ArrowRight className="w-5 h-5 ml-2" />
                            عرض جميع الفعاليات
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default Events
