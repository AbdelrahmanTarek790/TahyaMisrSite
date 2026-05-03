"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronUp, Search, HelpCircle, Users, Calendar, Shield, Settings, CreditCard, Globe } from "lucide-react"

export default function FAQClient({ faqs }) {
    const categories = [
        { id: "all", name: "جميع الأسئلة", icon: HelpCircle },
        { id: "membership", name: "العضوية", icon: Users },
        { id: "events", name: "الفعاليات", icon: Calendar },
        { id: "security", name: "الأمان", icon: Shield },
        { id: "account", name: "الحساب", icon: Settings },
        { id: "payments", name: "المدفوعات", icon: CreditCard },
        { id: "technical", name: "المساعدة التقنية", icon: Globe },
    ]
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [expandedFAQ, setExpandedFAQ] = useState(null)

    const filteredFAQs = faqs.filter((faq) => {
        const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
        const matchesSearch =
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesCategory && matchesSearch
    })

    return (
        <>
            {/* Search and Filter Section */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="relative">
                            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="ابحث في الأسئلة الشائعة..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-4 pr-12 py-6 text-lg text-right"
                            />
                        </div>
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                                    selectedCategory === category.id
                                        ? "bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                <category.icon className="w-5 h-5" />
                                <span className="font-arabic">{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ List */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto space-y-4">
                        {filteredFAQs.length > 0 ? (
                            filteredFAQs.map((faq) => (
                                <Card key={faq.id} className="bg-white shadow-card hover:shadow-elegant transition-all duration-300">
                                    <button onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)} className="w-full p-6 text-right">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 font-arabic leading-relaxed">{faq.question}</h3>
                                            </div>
                                            {expandedFAQ === faq.id ? (
                                                <ChevronUp className="w-6 h-6 text-egypt-red flex-shrink-0" />
                                            ) : (
                                                <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                                            )}
                                        </div>
                                    </button>

                                    {expandedFAQ === faq.id && (
                                        <div className="px-6 pb-6">
                                            <div className="pt-4 border-t border-gray-100">
                                                <p className="text-gray-600 leading-relaxed font-arabic text-right">{faq.answer}</p>
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-600 text-lg font-arabic">لم يتم العثور على أسئلة تطابق بحثك. جرب كلمات مفتاحية أخرى.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}
