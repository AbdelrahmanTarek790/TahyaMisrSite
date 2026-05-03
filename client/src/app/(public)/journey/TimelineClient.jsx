"use client"

import { useState } from "react"
import Icon from "@/components/AppIcon"

export default function TimelineClient({ timelineEvents }) {
    const [activeTimeline, setActiveTimeline] = useState(0)

    if (!timelineEvents || timelineEvents.length === 0) {
        return <div className="text-center text-gray-600 font-arabic py-8">لا توجد أحداث متاحة حالياً</div>
    }

    return (
        <div className="flex flex-col lg:flex-row gap-12">
            {/* Timeline Navigation */}
            <div className="lg:w-1/3">
                <div className="space-y-4">
                    {timelineEvents.map((event, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveTimeline(index)}
                            className={`w-full text-right p-4 rounded-xl transition-smooth ${
                                activeTimeline === index ? "bg-egypt-gold text-primary-foreground" : "bg-background hover:bg-background/80"
                            }`}
                        >
                            <div className="font-bold text-lg">{event.year}</div>
                            <div className="text-sm opacity-90">{event.title}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Timeline Content */}
            <div className="lg:w-2/3">
                <div className="bg-background rounded-2xl p-8 shadow-card">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-egypt-gold rounded-full flex items-center justify-center font-bold text-white">
                            {timelineEvents[activeTimeline]?.year}
                        </div>
                        <div>
                            <h4 className="text-2xl font-bold text-foreground">{timelineEvents[activeTimeline]?.title}</h4>
                            <p className="text-text-secondary">{timelineEvents[activeTimeline]?.description}</p>
                        </div>
                    </div>

                    <div className="bg-success/10 rounded-xl p-6">
                        <div className="flex items-start gap-3">
                            <Icon name="Award" size={24} className="text-green-500 flex-shrink-0 mt-1" />
                            <div>
                                <h5 className="font-semibold text-foreground mb-2">الإنجاز</h5>
                                <p className="text-text-secondary">{timelineEvents[activeTimeline]?.achievement}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
