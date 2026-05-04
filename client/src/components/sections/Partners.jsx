"use client"
import { InViewSection, InViewStagger } from "@/components/ui/MotionComponents"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Handshake, ArrowRight } from "lucide-react"
import { Button } from "../ui/enhanced-button"

const Partners = () => {
    const [partners, setPartners] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchPartners()
    }, [])

    const fetchPartners = async () => {
        try {
            setIsLoading(true)
            const response = await fetch("https://tmbackend.tahyamisryu.com/api/v1/partners")
            if (response.ok) {
                const data = await response.json()
                if (data.data && data.data.length > 0) {
                    setPartners(data.data)
                    return
                }
            }
        } catch (error) {
            console.error("Failed to fetch partners:", error)
        } finally {
            setIsLoading(false)
        }

        // Set empty state if fetch fails
        setPartners([])
    }

    if (!isLoading && partners.length === 0) return null

    return (
        <section className="py-24 bg-egypt-white overflow-hidden">
            <div className="container mx-auto px-6">
                <InViewSection animation="fadeInUp" className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-egypt-red/5 border border-egypt-red/10 mb-6">
                        <Handshake className="w-5 h-5 text-egypt-red" />
                        <span className="text-egypt-red font-bold text-sm tracking-widest uppercase">شركاء النجاح</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-egypt-black mb-6">
                        نحن لا نعمل <span className="text-egypt-red italic">بمفردنا</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        نفخر بالتعاون مع كبرى المؤسسات والكيانات الوطنية والخاصة لتحقيق أهدافنا المشتركة في دعم وتمكين الشباب المصري.
                    </p>
                </InViewSection>

                {isLoading ? (
                    <div className="flex flex-wrap justify-center gap-12 opacity-30">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="w-40 h-20 bg-gray-200 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="relative group">
                        {/* Smooth Scroll Container */}
                        <div className="flex overflow-hidden relative">
                            <InViewStagger className="flex flex-wrap justify-center items-center gap-8 md:gap-16 lg:gap-24" staggerDelay={0.1}>
                                {partners.map((partner) => (
                                    <div 
                                        key={partner._id}
                                        className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center p-4 transition-all duration-500 hover:scale-110 hover:grayscale-0 grayscale opacity-70 hover:opacity-100"
                                    >
                                        <img 
                                            src={partner.logo ? (partner.logo.startsWith('http') ? partner.logo : `https://tmbackend.tahyamisryu.com${partner.logo.startsWith('/') ? '' : '/'}${partner.logo}`) : "/placeholder.png"} 
                                            alt={partner.name}
                                            title={partner.name}
                                            className="max-w-full max-h-full object-contain filter drop-shadow-sm"
                                        />
                                    </div>
                                ))}
                            </InViewStagger>
                        </div>

                        {/* Decoration */}
                        <div className="absolute top-1/2 left-0 w-32 h-full bg-gradient-to-r from-egypt-white to-transparent -translate-y-1/2 z-10 pointer-events-none"></div>
                        <div className="absolute top-1/2 right-0 w-32 h-full bg-gradient-to-l from-egypt-white to-transparent -translate-y-1/2 z-10 pointer-events-none"></div>
                    </div>
                )}

                <div className="mt-20 text-center">
                    <Link href="/partners">
                        <Button variant="outline" size="xl" className="border-2 hover:bg-egypt-red hover:text-egypt-white hover:border-egypt-red transition-all duration-500 rounded-full px-12">
                            جميع الشركاء والرعاة
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default Partners
