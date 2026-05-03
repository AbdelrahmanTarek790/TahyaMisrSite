"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send, MessageCircle } from "lucide-react"
import { useState } from "react"

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        // TODO: Handle form submission to API
        console.log("Contact form submitted:", formData)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        alert("شكراً لك على رسالتك! سنتواصل معك قريباً.")
        setFormData({ name: "", email: "", subject: "", message: "" })
        setIsSubmitting(false)
    }

    return (
        <Card className="bg-[linear-gradient(145deg,_rgb(255,255,255),_rgb(242,242,242))] border-0 shadow-elegant animate-fade-in">
            <CardContent className="p-8 md:p-12">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground mb-4 font-arabic">أرسل لنا رسالة</h2>
                    <p className="text-muted-foreground font-arabic">سنتواصل معك في أقرب وقت ممكن</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 font-arabic text-right">
                                الاسم الكامل *
                            </label>
                            <Input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                placeholder="أدخل اسمك الكامل"
                                className="text-right font-arabic"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 font-arabic text-right">
                                البريد الإلكتروني *
                            </label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                placeholder="أدخل بريدك الإلكتروني"
                                className="text-right font-arabic"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2 font-arabic text-right">
                            الموضوع *
                        </label>
                        <Input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                            placeholder="ما هو موضوع رسالتك؟"
                            className="text-right font-arabic"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2 font-arabic text-right">
                            الرسالة *
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                            rows={6}
                            disabled={isSubmitting}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-egypt-red focus:border-egypt-red text-right font-arabic disabled:opacity-50"
                            placeholder="أخبرنا المزيد عن استفسارك..."
                        />
                    </div>

                    <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] text-white hover:scale-105 transition-all duration-300 font-arabic disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="h-5 w-5 ml-2" />
                        {isSubmitting ? "جاري الإرسال..." : "إرسال الرسالة"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
