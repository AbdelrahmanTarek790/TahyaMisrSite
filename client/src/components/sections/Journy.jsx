import React, { useState, useEffect } from "react"
import Icon from "../AppIcon"
import { timelineAPI } from "../../api"

const Journy = () => {
    const [activeTimeline, setActiveTimeline] = useState(0)
    const [timelineEvents, setTimelineEvents] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchTimeline()
    }, [])

    const fetchTimeline = async () => {
        try {
            setIsLoading(true)
            const response = await timelineAPI.getAll()
            const events = response.data?.timeline || []
            setTimelineEvents(events)
        } catch (error) {
            console.error("Failed to fetch timeline:", error)
            // Fallback to hardcoded data if API fails
            setTimelineEvents(fallbackTimelineEvents)
        } finally {
            setIsLoading(false)
        }
    }

    // Fallback timeline events in case API fails
    const fallbackTimelineEvents = [
        {
            year: "2019",
            title: "Union Founded",
            description: "Started with 500 students from 5 universities",
            achievement: "First student policy paper submitted to Parliament",
        },
        {
            year: "2020",
            title: "National Expansion",
            description: "Reached all 27 governorates with 5,000+ members",
            achievement: "Launched Egypt's largest student leadership program",
        },
        {
            year: "2021",
            title: "Government Partnership",
            description: "Official recognition and collaboration agreements",
            achievement: "15 policy recommendations adopted by ministries",
        },
        {
            year: "2022",
            title: "International Recognition",
            description: "Awarded 'Best Student Organization' by Arab League",
            achievement: "50+ alumni placed in government positions",
        },
        {
            year: "2023",
            title: "Digital Innovation",
            description: "Launched digital platform connecting 25,000+ students",
            achievement: "100+ community projects completed nationwide",
        },
        {
            year: "2024",
            title: "Future Leaders",
            description: "50,000+ active members shaping Egypt's tomorrow",
            achievement: "Direct influence on 3 major national initiatives",
        },
    ]

    const pillars = [
        {
            icon: "Award",
            title: "Leadership Development",
            description: "Comprehensive training programs, mentorship from government officials, and hands-on experience in real policy initiatives.",
            features: ["Monthly leadership workshops", "Government mentorship program", "Policy research projects", "Public speaking training"],
        },
        {
            icon: "Network",
            title: "Nationwide Networking",
            description: "Connect with like-minded students across all 27 governorates, building relationships that last beyond university.",
            features: ["Cross-governorate events", "Alumni network access", "Industry connections", "Peer collaboration projects"],
        },
        {
            icon: "Target",
            title: "Direct Impact Opportunities",
            description: "Work on real initiatives that shape Egypt's future, from local community projects to national policy recommendations.",
            features: [
                "Community development projects",
                "Policy recommendation committees",
                "Youth representation in government",
                "Social impact campaigns",
            ],
        },
    ]

    return (
        <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-block px-4 py-2 bg-success/10 text-success rounded-full text-sm font-medium mb-4">
                        The Tahya Misr Solution
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 font-arabic">
                        Three Pillars of Student Empowerment
                    </h2>
                    <p className="text-xl text-text-secondary max-w-3xl mx-auto">
                        We've created Egypt's most comprehensive platform for student leadership, connecting passionate young Egyptians with real
                        opportunities to shape their country's future.
                    </p>
                </div>

                {/* Three Pillars */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                    {pillars?.map((pillar, index) => (
                        <div
                            key={index}
                            className="bg-card rounded-2xl p-8 shadow-card hover:shadow-elevation transition-smooth border border-border"
                        >
                            <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mb-6">
                                <Icon name={pillar?.icon} size={32} className="text-green-500" />
                            </div>

                            <h3 className="text-2xl font-bold text-foreground mb-4">{pillar?.title}</h3>
                            <p className="text-text-secondary mb-6 leading-relaxed">{pillar?.description}</p>

                            <ul className="space-y-3">
                                {pillar?.features?.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-center gap-3">
                                        <Icon name="Check" size={16} className="text-green-500" />
                                        <span className="text-sm text-text-secondary">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Interactive Timeline */}
                <div className="bg-muted rounded-3xl p-8 lg:p-12">
                    <h3 className="text-3xl font-bold text-foreground mb-12 text-center">Our Journey of Impact</h3>

                    {isLoading ? (
                        <div className="flex flex-col lg:flex-row gap-12">
                            {/* Loading skeleton */}
                            <div className="lg:w-1/3">
                                <div className="space-y-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-full p-4 rounded-xl bg-gray-300 animate-pulse">
                                            <div className="h-6 bg-gray-400 rounded mb-2"></div>
                                            <div className="h-4 bg-gray-400 rounded"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="lg:w-2/3">
                                <div className="bg-background rounded-2xl p-8 shadow-card animate-pulse">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                                        <div>
                                            <div className="h-6 bg-gray-300 rounded mb-2"></div>
                                            <div className="h-4 bg-gray-300 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-4 bg-gray-300 rounded"></div>
                                        <div className="h-4 bg-gray-300 rounded"></div>
                                        <div className="h-4 bg-gray-300 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : timelineEvents.length > 0 ? (
                        <div className="flex flex-col lg:flex-row gap-12">
                            {/* Timeline Navigation */}
                            <div className="lg:w-1/3">
                                <div className="space-y-4">
                                    {timelineEvents?.map((event, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveTimeline(index)}
                                            className={`w-full text-left p-4 rounded-xl transition-smooth ${
                                                activeTimeline === index
                                                    ? "bg-egypt-gold text-primary-foreground"
                                                    : "bg-background hover:bg-background/80"
                                            }`}
                                        >
                                            <div className="font-bold text-lg">{event?.year}</div>
                                            <div className={`text-sm ${activeTimeline === index ? "text-primary-foreground/80" : "text-text-secondary"}`}>
                                                {event?.title}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Timeline Content */}
                            <div className="lg:w-2/3">
                                <div className="bg-background rounded-2xl p-8 shadow-card">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-egypt-gold rounded-full flex items-center justify-center text-primary-foreground font-bold">
                                            {timelineEvents?.[activeTimeline]?.year?.slice(-2)}
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-bold text-foreground">{timelineEvents?.[activeTimeline]?.title}</h4>
                                            <p className="text-text-secondary">{timelineEvents?.[activeTimeline]?.description}</p>
                                        </div>
                                    </div>

                                    <div className="bg-success/10 rounded-xl p-6 border-l-4 border-success">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Icon name="Trophy" size={20} color="var(--color-success)" />
                                            <span className="font-semibold text-success">Key Achievement</span>
                                        </div>
                                        <p className="text-foreground">{timelineEvents?.[activeTimeline]?.achievement}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-text-secondary text-lg">No timeline events available at the moment.</p>
                        </div>
                    )}
                </div>

                {/* Success Metrics */}
                <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { number: "50,000+", label: "Active Members" },
                        { number: "47", label: "Universities" },
                        { number: "150+", label: "Projects Completed" },
                        { number: "25", label: "Policy Influences" },
                    ]?.map((metric, index) => (
                        <div key={index} className="text-center">
                            <div className="text-4xl font-bold text-egypt-gold mb-2">{metric?.number}</div>
                            <div className="text-text-secondary">{metric?.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Journy
