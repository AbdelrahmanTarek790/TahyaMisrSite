"use client"
import { motion } from "framer-motion"
import { Calendar, Briefcase, Share2, ArrowRight, ChevronLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { jobsAPI } from "@/app/api/api"

const getCategoryLabel = (cat) => {
    const labels = {
        trainings: "تدريب",
        scholarships: "منحة",
        jobs: "وظيفة",
        trips: "رحلة",
        camps: "معسكر",
    }
    return labels[cat] || cat
}

export default function JobDetailClient({ job }) {
    const [relatedJobs, setRelatedJobs] = useState([])
    const [isLoadingRelated, setIsLoadingRelated] = useState(true)

    useEffect(() => {
        if (!job) return

        const fetchRelated = async () => {
            try {
                // Fetch 4 jobs from the same category to allow filtering out the current one
                const res = await jobsAPI.getAll({ category: job.category, limit: 4 })
                // Filter out the current job and take top 3
                const filtered = (res.data.jobs || []).filter(j => j._id !== job._id).slice(0, 3)
                setRelatedJobs(filtered)
            } catch (error) {
                console.error("Failed to fetch related jobs:", error)
            } finally {
                setIsLoadingRelated(false)
            }
        }

        fetchRelated()
    }, [job])

    if (!job) return null

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: job.title,
                    text: job.description,
                    url: window.location.href,
                })
            } catch (err) {
                console.error("Error sharing:", err)
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(window.location.href)
            alert("تم نسخ الرابط!")
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Link 
                    href="/jobs-and-internships"
                    className="inline-flex items-center text-primary hover:text-primary/80 font-medium mb-8 transition-colors"
                >
                    <ArrowRight className="w-5 h-5 ml-2" />
                    العودة إلى الفرص والتدريبات
                </Link>

                <motion.article 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl overflow-hidden shadow-xl"
                >
                    <div className="relative h-64 md:h-96 w-full">
                        <img
                            src={job.imageUrl.startsWith('http') ? job.imageUrl : `https://tmbackend.tahyamisryu.com${job.imageUrl}`}
                            alt={job.title}
                            crossOrigin="anonymous"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                            <span className="inline-block bg-primary text-white px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                                {getCategoryLabel(job.category)}
                            </span>
                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                                {job.title}
                            </h1>
                            <div className="flex items-center text-white/80 gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    {new Date(job.createdAt).toLocaleDateString("ar-EG", {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 md:p-12">
                        <div className="prose prose-lg prose-red max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {job.description}
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors"
                            >
                                <Share2 className="w-5 h-5" />
                                <span className="font-medium">مشاركة الفرصة</span>
                            </button>
                            
                            {/* Example Call to Action */}
                            {/* <button className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl">
                                التقديم الآن
                            </button> */}
                        </div>
                    </div>
                </motion.article>

                {/* Related Opportunities Section */}
                <div className="mt-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Briefcase className="w-8 h-8 text-primary" />
                            فرص ذات صلة
                        </h2>
                        <Link 
                            href="/jobs-and-internships" 
                            className="hidden md:flex items-center text-primary font-bold hover:text-primary/80 transition-colors"
                        >
                            عرض الكل
                            <ChevronLeft className="w-5 h-5 ml-1" />
                        </Link>
                    </div>

                    {isLoadingRelated ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="animate-pulse bg-white rounded-2xl h-72 shadow-sm border border-gray-100">
                                    <div className="w-full h-40 bg-gray-200 rounded-t-2xl"></div>
                                    <div className="p-4 space-y-3">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : relatedJobs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedJobs.map((relatedJob) => (
                                <Link key={relatedJob._id} href={`/jobs-and-internships/${relatedJob.slug || relatedJob._id}`}>
                                    <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 group border-none bg-white rounded-2xl">
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={relatedJob.imageUrl.startsWith('http') ? relatedJob.imageUrl : `https://tmbackend.tahyamisryu.com${relatedJob.imageUrl}`}
                                                alt={relatedJob.title}
                                                crossOrigin="anonymous"
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute top-3 right-3">
                                                <span className="bg-white/90 backdrop-blur-sm text-primary px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                                    {getCategoryLabel(relatedJob.category)}
                                                </span>
                                            </div>
                                        </div>
                                        <CardContent className="p-5">
                                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                                {relatedJob.title}
                                            </h3>
                                            <div className="flex items-center text-xs text-gray-500 mt-auto pt-3 border-t border-gray-100">
                                                <Calendar className="w-3.5 h-3.5 mr-1" />
                                                {new Date(relatedJob.createdAt).toLocaleDateString('ar-EG')}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <p className="text-gray-500">لا توجد فرص مشابهة حالياً.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
