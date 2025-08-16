import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Search, Calendar, MapPin, Users, ArrowLeft } from "lucide-react"

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
        if (isEventToday(dateString)) return { label: "Today", className: "bg-egypt-red text-white" }
        if (isEventPast(dateString)) return { label: "Past", className: "bg-muted text-muted-foreground" }
        return { label: "Upcoming", className: "bg-egypt-gold text-white" }
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <nav className="bg-background border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="flex items-center space-x-2 text-egypt-red hover:text-egypt-red/80 transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="font-medium">Back to Home</span>
                        </Link>
                        <h1 className="text-xl font-bold text-foreground">Events & Activities</h1>
                        <div></div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-br from-egypt-gold via-egypt-gold/90 to-egypt-red text-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="animate-fade-in">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 font-arabic">
                            Events & <span className="text-egypt-red">Activities</span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90">
                            Discover workshops, conferences, cultural events, and community activities organized by the Tahya Misr Students Union
                        </p>
                    </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-20 left-10 w-20 h-20 bg-egypt-red/20 rounded-full animate-float"></div>
                    <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 left-20 w-16 h-16 bg-egypt-red/30 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
                </div>
            </section>

            {/* Content */}
            <section className="py-20 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Search */}
                    <div className="mb-12 animate-fade-in">
                        <div className="relative max-w-md mx-auto">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-egypt-gold h-5 w-5" />
                            <Input
                                type="text"
                                placeholder="Search events..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 h-12 border-2 border-egypt-gold/20 focus:border-egypt-gold rounded-xl"
                            />
                        </div>
                    </div>

                    {/* Events Grid */}
                    {isLoading && events.length === 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(9)].map((_, i) => (
                                <Card key={i} className="animate-pulse bg-card border-border overflow-hidden">
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
                        <Card className="bg-card border-border">
                            <CardContent className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <h3 className="text-lg font-medium text-foreground mb-2">
                                        {searchTerm ? "No events found" : "No events available"}
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {searchTerm ? "Try adjusting your search terms" : "Check back later for upcoming events"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredEvents.map((event, index) => {
                                const status = getEventStatus(event.date)
                                return (
                                    <Card key={event._id} className="group overflow-hidden hover:shadow-elegant hover:-translate-y-2 transition-all duration-500 bg-card border-border animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                        {event.image && (
                                            <div className="aspect-video overflow-hidden relative">
                                                <img
                                                    src={`https://form.codepeak.software/uploads/${event.image}`}
                                                    alt={event.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    onError={(e) => {
                                                        e.target.src = "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=400&fit=crop";
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-egypt-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                <div className="absolute top-4 left-4">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${status.className}`}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-egypt-red transition-colors duration-300">{event.title}</CardTitle>
                                            <CardDescription className="space-y-2">
                                                <div className="flex items-center text-sm text-egypt-gold">
                                                    <Calendar className="mr-2 h-4 w-4" />
                                                    {formatDate(event.date)}
                                                </div>
                                                <div className="flex items-center text-sm text-muted-foreground">
                                                    <MapPin className="mr-2 h-4 w-4" />
                                                    {event.location}
                                                </div>
                                                <div className="flex items-center text-sm text-muted-foreground">
                                                    <Users className="mr-2 h-4 w-4" />
                                                    {event.registrations?.length || 0} registered
                                                </div>
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground line-clamp-3 mb-4 leading-relaxed">{event.description}</p>
                                            <div className="flex justify-between items-center">
                                                <Button variant="outline" size="sm" className="group-hover:bg-egypt-gold group-hover:text-white group-hover:border-egypt-gold transition-all duration-300">
                                                    View Details
                                                </Button>
                                                {!isEventPast(event.date) ? (
                                                    <Link to="/register">
                                                        <Button size="sm" className="bg-egypt-red hover:bg-egypt-red/90 text-white">Join to Register</Button>
                                                    </Link>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">Event ended</span>
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
                        <div className="flex justify-center space-x-3 mt-12 animate-fade-in">
                            <Button
                                variant="outline"
                                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                                disabled={pagination.page === 1 || isLoading}
                                className="border-egypt-gold text-egypt-red hover:bg-egypt-gold hover:text-white transition-all duration-300"
                            >
                                Previous
                            </Button>
                            <span className="flex items-center px-6 py-2 bg-card border border-border rounded-lg text-foreground font-medium">
                                Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                                disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit) || isLoading}
                                className="border-egypt-gold text-egypt-red hover:bg-egypt-gold hover:text-white transition-all duration-300"
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 bg-gradient-to-br from-egypt-gold to-egypt-red text-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="animate-fade-in">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 font-arabic">Ready to Participate?</h2>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90">
                            Join our community to register for events, participate in activities, and connect with fellow students
                        </p>
                        <Link to="/register">
                            <Button size="lg" className="bg-white text-egypt-red hover:bg-egypt-gold hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-glow">
                                Join Our Community
                            </Button>
                        </Link>
                    </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-10 right-10 w-24 h-24 bg-white/10 rounded-full animate-float"></div>
                    <div className="absolute bottom-10 left-10 w-32 h-32 bg-egypt-red/20 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
                    <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/20 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
                </div>
            </section>
        </div>
    )
}

export default PublicEventsPage
