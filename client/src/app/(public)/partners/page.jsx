"use client"
import { InViewSection, InViewStagger } from "@/components/ui/MotionComponents"
import { Handshake, Building2, Globe, ArrowUpRight } from "lucide-react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

export default function PartnersPage() {
    const [partners, setPartners] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                setIsLoading(true)
                const response = await fetch("https://tmbackend.tahyamisryu.com/api/v1/partners")
                if (response.ok) {
                    const data = await response.json()
                    if (data.data && data.data.length > 0) {
                        setPartners(data.data)
                        setIsLoading(false)
                        return
                    }
                }
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }

            // Set empty state if fetch fails
            setPartners([])
        }
        fetchPartners()
    }, [])

    const strategicPartners = partners.filter(p => p.category === 'strategic')
    const sponsors = partners.filter(p => p.category === 'sponsor')

    return (
        <div className="min-h-screen bg-background py-20" dir="rtl">
                <div className="container mx-auto px-6">
                    <InViewSection animation="fadeInUp" className="text-center mb-24">
                        <div className="w-20 h-20 bg-egypt-red/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                            <Handshake className="w-10 h-10 text-egypt-red" />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-egypt-black mb-6">
                            شركاء <span className="text-egypt-red">النجاح</span>
                        </h1>
                        <p className="text-muted-foreground text-xl max-w-3xl mx-auto">
                            نتعاون مع نخبة من المؤسسات والشركات التي تشاركنا رؤيتنا في تمكين الشباب وبناء مستقبل مشرق لمصر.
                        </p>
                    </InViewSection>

                    {/* Strategic Partners */}
                    {strategicPartners.length > 0 && (
                        <div className="mb-24">
                            <h2 className="text-3xl font-bold text-egypt-black mb-12 flex items-center gap-4">
                                <span className="w-12 h-1 bg-egypt-red rounded-full"></span>
                                الشركاء الاستراتيجيون
                            </h2>
                            <InViewStagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8" staggerDelay={0.1}>
                                {strategicPartners.map((partner) => (
                                    <PartnerCard key={partner._id} partner={partner} isStrategic={true} />
                                ))}
                            </InViewStagger>
                        </div>
                    )}

                    {/* Sponsors */}
                    {sponsors.length > 0 && (
                        <div>
                            <h2 className="text-3xl font-bold text-egypt-black mb-12 flex items-center gap-4">
                                <span className="w-12 h-1 bg-egypt-gold rounded-full"></span>
                                الرعاة والمساهمون
                            </h2>
                            <InViewStagger className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6" staggerDelay={0.05}>
                                {sponsors.map((partner) => (
                                    <PartnerCard key={partner._id} partner={partner} isStrategic={false} />
                                ))}
                            </InViewStagger>
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-egypt-red"></div>
                        </div>
                    )}
            </div>
        </div>
    )
}

function PartnerCard({ partner, isStrategic }) {
    return (
        <Card className={`group relative bg-white border-gray-100 hover:border-egypt-red/30 transition-all duration-500 rounded-3xl overflow-hidden hover:shadow-elegant ${isStrategic ? 'p-8' : 'p-6'}`}>
            <CardContent className="p-0 flex flex-col items-center text-center">
                <div className={`relative mb-6 ${isStrategic ? 'w-32 h-32' : 'w-24 h-24'} flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500`}>
                    <img 
                        src={partner.logo ? (partner.logo.startsWith('http') ? partner.logo : `https://tmbackend.tahyamisryu.com${partner.logo.startsWith('/') ? '' : '/'}${partner.logo}`) : "/placeholder.png"} 
                        alt={partner.name}
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
                <h3 className="text-lg font-bold text-egypt-black mb-2">{partner.name}</h3>
                {partner.websiteUrl && (
                    <a 
                        href={partner.websiteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-egypt-red text-sm font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                        زيارة الموقع <ArrowUpRight className="w-3 h-3" />
                    </a>
                )}
            </CardContent>
        </Card>
    )
}
