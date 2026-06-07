import { notFound } from "next/navigation"
import { Trophy, Star, ArrowRight, GraduationCap, Calendar } from "lucide-react"
import Link from "next/link"

// Server-side data fetching
async function getHonorRollMember(id) {
    try {
        const response = await fetch("https://tmbackend.tahyamisryu.com/api/v1/honor-roll", {
            next: { revalidate: 60 },
        })

        if (!response.ok) {
            return null
        }

        const data = await response.json()
        const members = data.data || []
        const member = members.find(m => m._id === id)
        return member || null
    } catch (error) {
        console.error("Failed to fetch honor roll member:", error)
        return null
    }
}

export async function generateMetadata({ params }) {
    const params2 = await params
    const member = await getHonorRollMember(params2.id)

    if (!member) {
        return {
            title: "عضو غير موجود - لوحة الشرف",
        }
    }

    return {
        title: `${member.user?.name} - لوحة الشرف`,
        description: member.description || member.title,
    }
}

export default async function HonorRollDetailPage({ params }) {
    const params2 = await params
    const member = await getHonorRollMember(params2.id)

    if (!member) {
        notFound()
    }

    const imageUrl = member.user?.profileImage 
        ? (member.user.profileImage.startsWith('http') 
            ? member.user.profileImage 
            : `https://tmbackend.tahyamisryu.com/uploads/${member.user.profileImage.startsWith('/') ? member.user.profileImage.substring(1) : member.user.profileImage}`) 
        : "/placeholder-user.png";

    return (
        <div className="min-h-screen bg-egypt-black py-20" dir="rtl">
            <div className="container mx-auto px-6 max-w-5xl">
                <Link href="/honor-roll" className="inline-flex items-center text-egypt-white/60 hover:text-egypt-gold transition-colors mb-10">
                    <ArrowRight className="w-5 h-5 ml-2" />
                    العودة إلى لوحة الشرف
                </Link>

                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm">
                    <div className="md:flex">
                        {/* Image Section */}
                        <div className="md:w-2/5 relative">
                            <div className="aspect-[4/5] md:aspect-auto md:h-full relative">
                                <img 
                                    src={imageUrl} 
                                    alt={member.user?.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-egypt-black via-egypt-black/60 to-transparent"></div>
                                
                                {/* Gold Star Badge */}
                                <div className="absolute top-6 right-6">
                                    <div className="bg-egypt-gold p-3 rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                                        <Star className="w-8 h-8 text-egypt-black fill-egypt-black" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
                            <div className="mb-2 flex items-center gap-3">
                                <Trophy className="w-6 h-6 text-egypt-gold" />
                                <span className="text-egypt-gold font-bold tracking-wider uppercase text-sm">
                                    لوحة الشرف
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black text-egypt-white mb-4 leading-tight">
                                {member.user?.name}
                            </h1>

                            <h2 className="text-2xl text-egypt-white/80 font-bold mb-8">
                                {member.title}
                            </h2>

                            <div className="w-20 h-1 bg-egypt-gold rounded-full mb-8"></div>

                            {member.description && (
                                <div className="mb-8">
                                    <h3 className="text-egypt-white/40 text-sm mb-2 uppercase tracking-wider font-bold">نبذة</h3>
                                    <p className="text-egypt-white/90 text-xl leading-relaxed italic">
                                        "{member.description}"
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-auto pt-8 border-t border-white/10">
                                {member.user?.university && (
                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/10 p-3 rounded-xl text-egypt-gold">
                                            <GraduationCap className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-egypt-white/40 text-sm mb-1">الجامعة / المؤسسة</p>
                                            <p className="text-egypt-white font-medium">{member.user.university}</p>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="flex items-start gap-4">
                                    <div className="bg-white/10 p-3 rounded-xl text-egypt-gold">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-egypt-white/40 text-sm mb-1">تاريخ الانضمام</p>
                                        <p className="text-egypt-white font-medium">
                                            {new Date(member.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
