import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Newspaper, Camera, Users, MapPin, Bell } from "lucide-react"

const Features = () => {
    const features = [
        {
            icon: Calendar,
            title: "Events & Activities",
            description: "Join workshops, seminars, volunteer activities, and cultural events across Egypt.",
            color: "text-egypt-red",
        },
        {
            icon: Newspaper,
            title: "News & Updates",
            description: "Stay informed with the latest news, announcements, and union developments.",
            color: "text-egypt-gold",
        },
        {
            icon: Camera,
            title: "Media Gallery",
            description: "Explore photos and videos from our events, showcasing our active community.",
            color: "text-egypt-red",
        },
        {
            icon: Users,
            title: "Leadership Positions",
            description: "Apply for leadership roles and positions within your governorate or nationally.",
            color: "text-egypt-gold",
        },
        {
            icon: MapPin,
            title: "Local Chapters",
            description: "Connect with union members in your governorate and participate locally.",
            color: "text-egypt-red",
        },
        {
            icon: Bell,
            title: "Notifications",
            description: "Receive instant updates about events, opportunities, and important announcements.",
            color: "text-egypt-gold",
        },
    ]

    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                        Platform <span className="text-egypt-gold">Features</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Our comprehensive platform provides everything you need to engage with the youth community and participate in meaningful
                        activities across Egypt.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className="bg-card border-border hover:shadow-card transition-all duration-300 hover:-translate-y-2 group animate-slide-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <CardHeader className="text-center pb-4">
                                <div className="w-16 h-16 bg-[linear-gradient(180deg,_rgb(255,255,255),_rgb(245,245,245))] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow transition-all duration-300">
                                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                                </div>
                                <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <div className="bg-[linear-gradient(145deg,_rgb(255,255,255),_rgb(242,242,242))] rounded-xl p-8 shadow-card">
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h3>
                        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                            Join thousands of young Egyptians who are already making a difference in their communities.
                        </p>
                        <button className="bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] text-egypt-white px-8 py-3 rounded-lg font-semibold hover:shadow-glow hover:scale-105 transition-all duration-300">
                            Create Your Account
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Features
