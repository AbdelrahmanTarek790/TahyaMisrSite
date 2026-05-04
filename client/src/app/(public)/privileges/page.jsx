"use client"
import { InViewSection, InViewStagger } from "@/components/ui/MotionComponents"
import { Gift, CreditCard, Sparkles, Phone, MapPin, CheckCircle2 } from "lucide-react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function PrivilegesPage() {
    const [privileges, setPrivileges] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchPrivileges = async () => {
            try {
                setIsLoading(true)
                const response = await fetch("https://tmbackend.tahyamisryu.com/api/v1/privileges")
                if (response.ok) {
                    const data = await response.json()
                    if (data.data && data.data.length > 0) {
                        setPrivileges(data.data)
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
            setPrivileges([])
        }
        fetchPrivileges()
    }, [])

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgb(248,248,248),_rgb(255,255,255))] py-20" dir="rtl">
            <div className="container mx-auto px-6">
                <InViewSection animation="fadeInDown" className="text-center mb-24">
                    <div className="w-24 h-24 bg-egypt-gold/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                        <Gift className="w-12 h-12 text-egypt-gold" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-egypt-black mb-6">
                        امتيازات <span className="text-egypt-gold">الأعضاء</span>
                    </h1>
                    <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
                        عضوية اتحاد شباب تحيا مصر تمنحك عالماً من المزايا الحصرية والخصومات التي صممت خصيصاً لتقدير جهودكم ودعم احتياجاتكم.
                    </p>
                </InViewSection>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-64 bg-white border border-gray-100 rounded-[2rem] animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <InViewStagger className="grid grid-cols-1 md:grid-cols-2 gap-8" staggerDelay={0.1}>
                        {privileges.map((item) => (
                            <Card key={item._id} className="group bg-white border-white hover:border-egypt-gold/30 hover:shadow-elegant transition-all duration-500 rounded-[2rem] overflow-hidden">
                                <CardContent className="p-10">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="md:w-1/4">
                                            <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center group-hover:bg-egypt-gold/5 transition-colors">
                                                <img 
                                                    src={item.logo ? (item.logo.startsWith('http') ? item.logo : `https://tmbackend.tahyamisryu.com${item.logo.startsWith('/') ? '' : '/'}${item.logo}`) : "/placeholder.png"} 
                                                    alt={item.partnerName}
                                                    className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:w-3/4">
                                            <div className="flex justify-between items-start mb-4">
                                                <h2 className="text-2xl font-bold text-egypt-black group-hover:text-egypt-gold transition-colors">
                                                    {item.partnerName}
                                                </h2>
                                                <Badge variant="secondary" className="bg-egypt-gold/10 text-egypt-gold border-none px-4 py-1">
                                                    {item.type === 'union' ? 'امتياز داخلي' : 'شريك خارجي'}
                                                </Badge>
                                            </div>
                                            
                                            <p className="text-muted-foreground mb-6 leading-relaxed">
                                                {item.description}
                                            </p>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                                {item.privileges.map((priv, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-sm font-semibold text-egypt-black/80">
                                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                        {priv}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex flex-wrap gap-6 pt-6 border-t border-gray-50">
                                                {item.contactInfo && (
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Phone className="w-4 h-4 text-egypt-gold" />
                                                        {item.contactInfo}
                                                    </div>
                                                )}
                                                {item.address && (
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <MapPin className="w-4 h-4 text-egypt-gold" />
                                                        {item.address}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </InViewStagger>
                )}
            </div>
        </div>
    )
}
