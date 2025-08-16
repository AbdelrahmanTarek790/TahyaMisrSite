import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "../ui/enhanced-button"

import { Calendar, MapPin, Users, Clock, ArrowRight, Star } from "lucide-react"

const Events = () => {
    const events = [
        {
            id: 1,
            title: "National Youth Summit 2024",
            description:
                "Join hundreds of young leaders from across Egypt for our biggest annual event featuring workshops, networking, and keynote speeches.",
            date: "January 15, 2025",
            time: "9:00 AM - 6:00 PM",
            location: "Cairo International Convention Center",
            attendees: 500,
            category: "Summit",
            price: "Free",
            featured: true,
            image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=400&fit=crop",
        },
        {
            id: 2,
            title: "Digital Marketing Workshop",
            description: "Learn essential digital marketing skills including social media management, content creation, and analytics.",
            date: "December 20, 2024",
            time: "2:00 PM - 5:00 PM",
            location: "Alexandria Tech Hub",
            attendees: 50,
            category: "Workshop",
            price: "Free",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
        },
        {
            id: 3,
            title: "Community Cleanup Initiative",
            description: "Join us for a community service day focused on environmental cleanup and awareness in local neighborhoods.",
            date: "December 22, 2024",
            time: "8:00 AM - 12:00 PM",
            location: "Nile Corniche, Cairo",
            attendees: 200,
            category: "Volunteer",
            price: "Free",
            image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=600&h=400&fit=crop",
        },
        {
            id: 4,
            title: "Entrepreneurship Bootcamp",
            description: "3-day intensive bootcamp covering business planning, funding, and startup development for aspiring entrepreneurs.",
            date: "January 5-7, 2025",
            time: "9:00 AM - 5:00 PM",
            location: "Giza Business District",
            attendees: 100,
            category: "Bootcamp",
            price: "Free",
            image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop",
        },
    ]

    return (
        <section className="py-20 bg-[linear-gradient(180deg,_rgb(255,255,255),_rgb(245,245,245))] overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                        Upcoming <span className="text-egypt-gold">Events</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Join us for exciting events, workshops, and community initiatives designed to empower and connect Egyptian youth across the
                        country.
                    </p>
                </div>

                {/* Featured Event */}
                <div className="mb-16 animate-scale-in">
                    <Card className="group bg-[linear-gradient(145deg,_rgb(255,255,255),_rgb(242,242,242))] border-0 shadow-elegant hover:shadow-glow transition-all duration-500 overflow-hidden">
                        <div className="relative">
                            <img
                                src={events[0].image}
                                alt={events[0].title}
                                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-egypt-black/80 via-egypt-black/40 to-transparent"></div>
                            <div className="absolute top-6 left-6">
                                <div className="flex items-center space-x-2">
                                    <Star className="w-5 h-5 text-egypt-gold animate-float" />
                                    <span className="bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] text-egypt-white px-4 py-2 rounded-full text-sm font-semibold animate-bounce-in">
                                        Featured Event
                                    </span>
                                </div>
                            </div>
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="text-egypt-white">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="bg-egypt-gold text-egypt-black px-3 py-1 rounded-full text-sm font-semibold">
                                            {events[0].category}
                                        </span>
                                        <span className="text-egypt-gold font-semibold">{events[0].price}</span>
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
                                        <span className="font-semibold">{events[0].attendees} attendees expected</span>
                                    </div>
                                </div>
                                <Button variant="hero" size="lg" className="hover:shadow-glow hover:scale-105 transition-all duration-300">
                                    Register Now
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
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
                                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-egypt-gold text-egypt-black px-3 py-1 rounded-full text-sm font-semibold">
                                        {event.category}
                                    </span>
                                </div>
                                <div className="absolute top-4 right-4">
                                    <span className="bg-egypt-white/90 text-egypt-black px-3 py-1 rounded-full text-sm font-semibold">
                                        {event.price}
                                    </span>
                                </div>
                            </div>
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-egypt-red transition-colors duration-300">
                                    {event.title}
                                </h3>
                                <p className="text-muted-foreground mb-4 leading-relaxed">{event.description.substring(0, 120)}...</p>

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
                                        <span>{event.attendees} expected</span>
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    className="w-full group-hover:bg-egypt-gold group-hover:text-egypt-black group-hover:border-egypt-gold transition-all duration-300"
                                >
                                    Learn More
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="text-center animate-bounce-in">
                    <Button variant="cta" size="lg" className="hover:shadow-glow hover:scale-105 transition-all duration-300">
                        View All Events
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default Events
