import { Card, CardContent } from "@/components/ui/card"
import { Users, Target, Heart, Zap } from "lucide-react"

const About = () => {
    const values = [
        {
            icon: Users,
            title: "Unity",
            description: "Bringing together youth from all backgrounds and governorates across Egypt.",
        },
        {
            icon: Target,
            title: "Purpose",
            description: "Focused on meaningful civic engagement and positive community impact.",
        },
        {
            icon: Heart,
            title: "Passion",
            description: "Driven by love for Egypt and commitment to its bright future.",
        },
        {
            icon: Zap,
            title: "Action",
            description: "Turning ideas into reality through organized campaigns and initiatives.",
        },
    ]

    return (
        <section className="py-20 bg-[linear-gradient(180deg,_rgb(255,255,255),_rgb(245,245,245))]">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-slide-up">
                        About Our <span className="text-egypt-red animate-float">Mission</span>
                    </h2>
                    <p
                        className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-slide-up"
                        style={{ animationDelay: "0.2s" }}
                    >
                        The Long Live Egypt Youth Union is a platform dedicated to empowering young Egyptians through education, civic participation,
                        and community service. We believe in the power of youth to shape Egypt's future.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {values.map((value, index) => (
                        <Card
                            key={index}
                            className="bg-[linear-gradient(145deg,_rgb(255,255,255),_rgb(242,242,242))] border-0 shadow-card hover:shadow-elegant transition-all duration-500 hover:-translate-y-2 group animate-scale-in"
                            style={{ animationDelay: `${index * 0.15}s` }}
                        >
                            <CardContent className="p-6 text-center">
                                <div className="w-16 h-16 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-float transition-all duration-300">
                                    <value.icon className="w-8 h-8 text-egypt-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] rounded-2xl p-8 md:p-12 text-center shadow-elegant animate-bounce-in">
                    <h3 className="text-3xl md:text-4xl font-bold text-egypt-white mb-6 animate-slide-up">Join the Movement</h3>
                    <p className="text-xl text-egypt-white/90 mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>
                        Be part of something bigger. Connect with like-minded youth, participate in meaningful initiatives, and help build a stronger
                        Egypt for future generations.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in" style={{ animationDelay: "0.4s" }}>
                        <a
                            href="#register"
                            className="inline-flex items-center justify-center px-8 py-3 bg-egypt-white text-egypt-red font-semibold rounded-lg hover:bg-egypt-white/90 transition-all duration-300 hover:scale-105 hover:shadow-glow"
                        >
                            Become a Member
                        </a>
                        <a
                            href="#contact"
                            className="inline-flex items-center justify-center px-8 py-3 border-2 border-egypt-white text-egypt-white font-semibold rounded-lg hover:bg-egypt-white hover:text-egypt-red transition-all duration-300 hover:scale-105"
                        >
                            Get in Touch
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About
