"use client"
import { InViewSection, InViewStagger } from "@/components/ui/MotionComponents"
import { Trophy, Star, Shield } from "lucide-react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

export default function HonorRollPage() {
    const [members, setMembers] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                setIsLoading(true)
                const response = await fetch("https://tmbackend.tahyamisryu.com/api/v1/honor-roll")
                if (response.ok) {
                    const data = await response.json()
                    if (data.data && data.data.length > 0) {
                        setMembers(data.data)
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
            setMembers([])
        }
        fetchMembers()
    }, [])

    return (
        <div className="min-h-screen bg-egypt-black py-20" dir="rtl">
                <div className="container mx-auto px-6">
                    <InViewSection animation="fadeInDown" className="text-center mb-20">
                        <Trophy className="w-16 h-16 text-egypt-gold mx-auto mb-6" />
                        <h1 className="text-5xl md:text-7xl font-black text-egypt-white mb-6">
                            لوحة <span className="text-egypt-gold">الشرف</span>
                        </h1>
                        <p className="text-egypt-white/60 text-xl max-w-3xl mx-auto">
                            قائمة الشرف تضم الشخصيات والمؤسسات التي قدمت إسهامات استثنائية لدعم مسيرة الاتحاد وتمكين الشباب.
                        </p>
                    </InViewSection>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-96 bg-white/5 rounded-3xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <InViewStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" staggerDelay={0.1}>
                            {members.map((member) => (
                                <Card key={member._id} className="bg-white/5 border-white/10 hover:border-egypt-gold/30 transition-all duration-500 rounded-3xl overflow-hidden group">
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
                                        <p className="text-egypt-white/60 leading-relaxed italic">
                                            "{member.description}"
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </InViewStagger>
                    )}
                </div>
            </div>
    )
}
