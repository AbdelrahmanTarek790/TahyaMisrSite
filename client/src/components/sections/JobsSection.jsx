"use client"
import { Card, CardContent } from "@/components/ui/card"
import { InViewSection, InViewStagger } from "@/components/ui/MotionComponents"
import { Calendar, Briefcase, ArrowRight } from "lucide-react"
import { Button } from "../ui/enhanced-button"
import { useState, useEffect } from "react"
import Link from "next/link"
import { jobsAPI } from "@/app/api/api"

const JobsSection = () => {
    const [jobs, setJobs] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchJobs()
    }, [])

    const fetchJobs = async () => {
        try {
            setIsLoading(true)
            const response = await jobsAPI.getAll({ page: 1, limit: 3 })
            setJobs(response.data?.jobs || response.data || [])
        } catch (error) {
            console.error("Failed to fetch jobs:", error)
            setJobs([])
        } finally {
            setIsLoading(false)
        }
    }

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

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    return (
        <section id="jobs-section" className="py-20 bg-[linear-gradient(180deg,_rgb(255,255,255),_rgb(249,250,251))]">
            <div className="container mx-auto px-6">
                <InViewSection animation="fadeInUp" className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                        <Briefcase className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                        الوظائف <span className="text-primary animate-gradient">والتدريبات</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        استكشف أحدث الفرص والمنح الدراسية والمعسكرات المتاحة لتطوير مهاراتك وبناء مستقبلك
                    </p>
                </InViewSection>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse">
                                <Card className="bg-card border-border overflow-hidden h-full">
                                    <div className="w-full h-48 bg-gray-200"></div>
                                    <CardContent className="p-6">
                                        <div className="h-6 bg-gray-200 rounded mb-4"></div>
                                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded mb-6 w-2/3"></div>
                                        <div className="h-10 bg-gray-200 rounded"></div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                ) : jobs.length > 0 ? (
                    <InViewStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12" staggerDelay={0.15}>
                        {jobs.map((job, index) => (
                            <Card
                                key={job._id}
                                className="group bg-card border-border hover:shadow-elegant transition-all duration-500 hover:-translate-y-2 overflow-hidden h-full flex flex-col"
                            >
                                <Link href={`/jobs-and-internships/${job.slug || job._id}`} className="flex flex-col h-full">
                                    <div className="relative overflow-hidden h-56">
                                        <img
                                            src={job.imageUrl.startsWith('http') ? job.imageUrl : `https://tmbackend.tahyamisryu.com${job.imageUrl}`}
                                            alt={job.title}
                                            crossOrigin="anonymous"
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            onError={(e) => {
                                                e.target.src = "/placeholder.png"
                                            }}
                                        />
                                        <div className="absolute top-4 right-4">
                                            <span className="bg-white/90 backdrop-blur-sm text-primary px-3 py-1.5 rounded-full text-sm font-bold shadow-sm">
                                                {getCategoryLabel(job.category)}
                                            </span>
                                        </div>
                                    </div>
                                    <CardContent className="p-6 flex flex-col flex-1">
                                        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                                            {job.title}
                                        </h3>
                                        <p className="text-muted-foreground mb-6 line-clamp-2 leading-relaxed flex-1">
                                            {job.description}
                                        </p>
                                        <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(job.createdAt)}
                                            </div>
                                            <div className="flex items-center text-primary font-bold group-hover:translate-x-[-4px] transition-transform">
                                                التفاصيل
                                                <ArrowRight className="w-4 h-4 ml-1" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Link>
                            </Card>
                        ))}
                    </InViewStagger>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">لا توجد فرص متاحة في الوقت الحالي.</p>
                    </div>
                )}

                <div className="text-center animate-bounce-in">
                    <Link href="/jobs-and-internships">
                        <Button variant="cta" size="lg" className="hover:shadow-glow hover:scale-105 transition-all duration-300">
                            <ArrowRight className="w-5 h-5 ml-2" />
                            عرض جميع الفرص والتدريبات
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default JobsSection
