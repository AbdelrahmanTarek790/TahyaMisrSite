"use client"
import { InViewSection, InViewStagger } from "@/components/ui/MotionComponents"
import { Gift, CheckCircle, ArrowRight, ShieldCheck, Zap, Globe } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "../ui/enhanced-button"
import { Card, CardContent } from "@/components/ui/card"

const Privileges = () => {
    const [privileges, setPrivileges] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchPrivileges()
    }, [])

    const fetchPrivileges = async () => {
        try {
            setIsLoading(true)
            const response = await fetch("https://tmbackend.tahyamisryu.com/api/v1/privileges?limit=4")
            if (response.ok) {
                const data = await response.json()
                if (data.data && data.data.length > 0) {
                    setPrivileges(data.data)
                    return
                }
            }
        } catch (error) {
            console.error("Failed to fetch privileges:", error)
        } finally {
            setIsLoading(false)
        }

        // Set empty state if fetch fails
        setPrivileges([])
    }

    if (!isLoading && privileges.length === 0) return null

    return (
        <section className="py-24 bg-[radial-gradient(circle_at_top_right,_rgb(240,240,240),_rgb(255,255,255))] relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    {/* Left Content */}
                    <div className="lg:w-1/2">
                        <InViewSection animation="fadeInLeft">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-egypt-gold/10 border border-egypt-gold/20 mb-6">
                                <Gift className="w-5 h-5 text-egypt-gold" />
                                <span className="text-egypt-gold font-bold text-sm tracking-widest uppercase">امتيازات الأعضاء</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-egypt-black mb-8 leading-tight">
                                عالم من <span className="text-egypt-gold">المزايا</span> والخصومات الحصرية بانتظارك
                            </h2>
                            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                                نؤمن بتقدير شبابنا، لذا قمنا بعقد شراكات مع كبرى المؤسسات لتوفير باقة متنوعة من الخدمات والخصومات التي تلبي احتياجاتكم اليومية والمهنية.
                            </p>
                            
                            <ul className="space-y-4 mb-12">
                                {[
                                    { icon: ShieldCheck, text: "تأمين صحي واجتماعي للأعضاء" },
                                    { icon: Zap, text: "خصومات تصل إلى 50% في كبرى المطاعم والكافيهات" },
                                    { icon: Globe, text: "دورات تدريبية ومنح تعليمية بالتعاون مع جهات دولية" },
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 text-egypt-black font-semibold">
                                        <div className="w-8 h-8 rounded-full bg-egypt-gold/20 flex items-center justify-center">
                                            <item.icon className="w-4 h-4 text-egypt-gold" />
                                        </div>
                                        {item.text}
                                    </li>
                                ))}
                            </ul>

                            <Link href="/privileges">
                                <Button variant="cta" size="xl" className="rounded-2xl px-12 group">
                                    اكتشف جميع الامتيازات
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                                </Button>
                            </Link>
                        </InViewSection>
                    </div>

                    {/* Right Grid */}
                    <div className="lg:w-1/2 w-full">
                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="animate-pulse bg-white border border-gray-100 rounded-3xl h-48"></div>
                                ))}
                            </div>
                        ) : (
                            <InViewStagger className="grid grid-cols-1 sm:grid-cols-2 gap-6" staggerDelay={0.15}>
                                {privileges.map((item) => (
                                    <Card 
                                        key={item._id}
                                        className="group bg-white border-white hover:border-egypt-gold/50 hover:shadow-elegant transition-all duration-500 rounded-3xl overflow-hidden cursor-pointer"
                                    >
                                        <CardContent className="p-8">
                                            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 group-hover:bg-egypt-gold/10 transition-colors">
                                                <img 
                                                    src={item.logo ? (item.logo.startsWith('http') ? item.logo : `https://tmbackend.tahyamisryu.com${item.logo.startsWith('/') ? '' : '/'}${item.logo}`) : "/placeholder.png"} 
                                                    alt={item.partnerName}
                                                    className="w-10 h-10 object-contain group-hover:scale-110 transition-transform"
                                                />
                                            </div>
                                            <h3 className="text-xl font-bold text-egypt-black mb-3">{item.partnerName}</h3>
                                            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                                                {item.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </InViewStagger>
                        )}
                    </div>
                </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-egypt-gold opacity-5 rounded-full blur-3xl"></div>
        </section>
    )
}

export default Privileges
