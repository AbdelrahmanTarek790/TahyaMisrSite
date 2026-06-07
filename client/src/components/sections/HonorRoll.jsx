"use client"
import { Card, CardContent } from "@/components/ui/card"
import { InViewSection, InViewStagger } from "@/components/ui/MotionComponents"
import { Trophy, Star, ArrowRight } from "lucide-react"
import { Button } from "../ui/enhanced-button"
import { useState, useEffect } from "react"
import Link from "next/link"

const HonorRoll = () => {
    const [members, setMembers] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchHonorRoll()
    }, [])

    const fetchHonorRoll = async () => {
        try {
            setIsLoading(true)
            const response = await fetch("https://tmbackend.tahyamisryu.com/api/v1/honor-roll?limit=3")
            if (response.ok) {
                const data = await response.json()
                if (data.data && data.data.length > 0) {
                    setMembers(data.data)
                    return
                }
            }
        } catch (error) {
            console.error("Failed to fetch honor roll:", error)
        } finally {
            setIsLoading(false)
        }

        // Set empty state if fetch fails
        setMembers([])
    }

    if (!isLoading && members.length === 0) return null

    return (
        <section className="py-24 bg-egypt-black text-egypt-white relative overflow-hidden">
            {/* Background patterns */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-egypt-gold rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-egypt-red rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <InViewSection animation="fadeInUp" className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-egypt-gold/10 border border-egypt-gold/20 mb-6 animate-pulse">
                        <Trophy className="w-5 h-5 text-egypt-gold" />
                        <span className="text-egypt-gold font-semibold tracking-wider text-sm uppercase">لوحة الشرف</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">
                        فرسان <span className="text-egypt-gold italic">التميز</span>
                    </h2>
                    <p className="text-egypt-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
                        نحتفي بنخبة من المبدعين والمتميزين الذين تركوا بصمة واضحة في مسيرة الاتحاد وساهموا في بناء مستقبل أفضل للشباب المصري.
                    </p>
                </InViewSection>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse bg-white/5 rounded-3xl h-96"></div>
                        ))}
                    </div>
                ) : (
                    <InViewStagger className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12" staggerDelay={0.2}>
                        {members.map((member, index) => (
                            <Link href={`/honor-roll/${member._id}`} key={member._id} className="block group focus:outline-none h-full">
                                <Card className="h-full relative bg-white/5 border-white/10 group-hover:border-egypt-gold/30 transition-all duration-700 group-hover:-translate-y-4 overflow-hidden rounded-3xl backdrop-blur-sm">
                                    <div className="relative aspect-square">
                                        <img 
                                            src={member.user?.profileImage ? (member.user.profileImage.startsWith('http') ? member.user.profileImage : `https://tmbackend.tahyamisryu.com/uploads/${member.user.profileImage.startsWith('/') ? member.user.profileImage.substring(1) : member.user.profileImage}`) : "/placeholder-user.png"} 
                                            alt={member.user?.name}
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-egypt-black via-transparent to-transparent"></div>
                                        <div className="absolute bottom-6 right-6">
                                            <div className="bg-egypt-gold p-3 rounded-2xl shadow-glow">
                                                <Star className="w-6 h-6 text-egypt-black fill-egypt-black" />
                                            </div>
                                        </div>
                                    </div>
                                    <CardContent className="p-8">
                                        <h2 className="text-2xl font-bold text-egypt-white mb-2 group-hover:text-egypt-gold transition-colors">
                                            {member.user?.name}
                                        </h2>
                                        <p className="text-egypt-gold text-sm font-bold uppercase tracking-wider mb-4">
                                            {member.title}
                                        </p>
                                        <p className="text-egypt-white/60 leading-relaxed italic line-clamp-3">
                                            "{member.description}"
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </InViewStagger>
                )}

                <div className="mt-16 text-center">
                    <Link href="/honor-roll">
                        <Button variant="cta" size="xl" className="group px-10">
                            استكشف لوحة الشرف كاملة
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default HonorRoll
