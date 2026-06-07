"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { InViewSection } from "@/components/ui/MotionComponents"
import { Trophy, Star, ArrowRight, Award, User, GraduationCap, MapPin } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export default function HonorMemberSinglePage() {
    const { id } = useParams()
    const router = useRouter()
    const [member, setMember] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchMember = async () => {
            try {
                setIsLoading(true)
                const response = await fetch(`https://tmbackend.tahyamisryu.com/api/v1/honor-roll/${id}`)
                if (response.ok) {
                    const data = await response.json()
                    if (data.data) {
                        setMember(data.data)
                        setIsLoading(false)
                        return
                    }
                }
                // Handle not found
                router.push('/honor-roll')
            } catch (error) {
                console.error(error)
                router.push('/honor-roll')
            }
        }
        if (id) {
            fetchMember()
        }
    }, [id, router])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-egypt-black py-20" dir="rtl">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto h-[600px] bg-white/5 rounded-3xl animate-pulse"></div>
                </div>
            </div>
        )
    }

    if (!member) return null

    const profileImage = member.user?.profileImage 
        ? (member.user.profileImage.startsWith('http') 
            ? member.user.profileImage 
            : `https://tmbackend.tahyamisryu.com/uploads/${member.user.profileImage.startsWith('/') ? member.user.profileImage.substring(1) : member.user.profileImage}`) 
        : "/placeholder-user.png"

    return (
        <div className="min-h-screen bg-egypt-black py-20" dir="rtl">
            <div className="container mx-auto px-6">
                <InViewSection animation="fadeInDown" className="max-w-5xl mx-auto mb-10">
                    <Link href="/honor-roll" className="inline-flex items-center text-egypt-white/60 hover:text-egypt-gold transition-colors group mb-8">
                        <ArrowRight className="w-5 h-5 ml-2 transform group-hover:-translate-x-1 transition-transform" />
                        العودة إلى لوحة الشرف
                    </Link>
                </InViewSection>

                <InViewSection animation="fadeInUp" className="max-w-5xl mx-auto">
                    <Card className="bg-white/5 border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
                            <div className="relative aspect-[4/5] md:aspect-auto lg:col-span-2 overflow-hidden bg-egypt-black/50">
                                <img 
                                    src={profileImage} 
                                    alt={member.user?.name}
                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-egypt-black via-egypt-black/20 to-transparent md:hidden"></div>
                                <div className="absolute top-6 left-6 md:top-8 md:left-8">
                                    <div className="bg-egypt-gold/20 backdrop-blur-md p-3 rounded-full border border-egypt-gold/30">
                                        <Award className="w-8 h-8 text-egypt-gold" />
                                    </div>
                                </div>
                            </div>
                            
                            <CardContent className="p-8 md:p-12 lg:col-span-3 flex flex-col justify-center">
                                <div className="mb-8">
                                    <h1 className="text-4xl md:text-5xl font-black text-egypt-white mb-4 leading-tight">
                                        {member.user?.name}
                                    </h1>
                                    <div className="inline-flex items-center bg-egypt-gold/10 px-4 py-2 rounded-full border border-egypt-gold/20">
                                        <Trophy className="w-5 h-5 text-egypt-gold ml-2" />
                                        <span className="text-egypt-gold font-bold text-lg">{member.title}</span>
                                    </div>
                                </div>

                                <div className="space-y-6 mb-8">
                                    <p className="text-egypt-white/80 text-xl leading-relaxed italic border-r-4 border-egypt-gold pr-6 py-2 bg-white/5 rounded-l-xl">
                                        "{member.description}"
                                    </p>
                                </div>

                                {member.user?.university && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto border-t border-white/10 pt-8">
                                        <div className="flex items-center text-egypt-white/70 bg-white/5 p-4 rounded-2xl">
                                            <div className="bg-egypt-gold/10 p-3 rounded-xl ml-4">
                                                <GraduationCap className="w-6 h-6 text-egypt-gold" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-egypt-white/40 mb-1">الجامعة</p>
                                                <p className="font-semibold text-egypt-white">{member.user.university}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </div>
                    </Card>
                </InViewSection>
            </div>
        </div>
    )
}
