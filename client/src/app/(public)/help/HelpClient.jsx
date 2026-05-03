"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, ChevronDown, ChevronUp } from "lucide-react"

export default function HelpClient({ faqItems }) {
    const [searchQuery, setSearchQuery] = useState("")
    const [expandedFaq, setExpandedFaq] = useState(null)

    const filteredFaqs = faqItems.filter(
        (item) => item.question.toLowerCase().includes(searchQuery.toLowerCase()) || item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const toggleFaq = (index) => {
        setExpandedFaq(expandedFaq === index ? null : index)
    }

    return (
        <>
            {/* Search Bar in Hero */}
            <div className="relative max-w-2xl mx-auto">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="ابحث عن إجابة لسؤالك..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-12 py-4 rounded-lg text-foreground text-right border-0 focus:ring-4 focus:ring-white/20"
                />
            </div>

            {/* FAQ List */}
            <section className="py-20 bg-[linear-gradient(180deg,_rgb(245,245,245),_rgb(255,255,255))]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-arabic">الأسئلة الشائعة</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-arabic">
                            إجابات على الأسئلة الأكثر شيوعًا حول اتحاد شباب تحيا مصر
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        {filteredFaqs.length > 0 ? (
                            <div className="space-y-4">
                                {filteredFaqs.map((faq, index) => (
                                    <Card key={index} className="overflow-hidden">
                                        <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => toggleFaq(index)}>
                                            <CardTitle className="text-right flex items-center justify-between">
                                                <span className="text-lg font-arabic">{faq.question}</span>
                                                {expandedFaq === index ? (
                                                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                                )}
                                            </CardTitle>
                                        </CardHeader>
                                        {expandedFaq === index && (
                                            <CardContent className="pt-0">
                                                <div className="border-t pt-6">
                                                    <p className="text-muted-foreground text-right leading-relaxed font-arabic">{faq.answer}</p>
                                                </div>
                                            </CardContent>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="text-center py-16">
                                <CardContent>
                                    <p className="text-muted-foreground text-xl font-arabic">لم نجد أسئلة مطابقة لبحثك</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}
