"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, Calendar, ChevronLeft, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const categories = [
    { id: "all", label: "الكل" },
    { id: "trainings", label: "تدريبات" },
    { id: "scholarships", label: "منح" },
    { id: "jobs", label: "وظائف" },
    { id: "trips", label: "رحلات" },
    { id: "camps", label: "معسكرات" },
]

export default function JobsClient({ initialJobs, initialTotal }) {
    const [jobs, setJobs] = useState(initialJobs)
    const [activeCategory, setActiveCategory] = useState("all")
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(initialTotal > initialJobs.length)

    useEffect(() => {
        if (activeCategory === "all" && page === 1) {
            setJobs(initialJobs)
            setHasMore(initialTotal > initialJobs.length)
            return
        }

        const fetchFilteredJobs = async () => {
            setIsLoading(true)
            try {
                let url = `https://tmbackend.tahyamisryu.com/api/v1/jobs-and-internships?page=${page}&limit=9`
                if (activeCategory !== "all") {
                    url += `&category=${activeCategory}`
                }

                const res = await fetch(url)
                const data = await res.json()

                if (page === 1) {
                    setJobs(data.data?.jobs || data.data || [])
                } else {
                    setJobs((prev) => [...prev, ...(data.data?.jobs || data.data || [])])
                }

                setHasMore((data.data?.pagination?.total || data.count) > jobs.length + (data.data?.jobs?.length || data.data?.length || 0))
            } catch (error) {
                console.error("Failed to fetch jobs:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchFilteredJobs()
    }, [activeCategory, page])

    const getCategoryLabel = (cat) => categories.find(c => c.id === cat)?.label || cat

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4"
                    >
                        <Briefcase className="w-8 h-8 text-primary" />
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-gray-900"
                    >
                        الفرص والتدريبات
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600 max-w-2xl mx-auto"
                    >
                        اكتشف أحدث الوظائف، المنح الدراسية، والمعسكرات المتاحة للشباب.
                    </motion.p>
                </div>

                {/* Filter Categories */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-2 md:gap-4"
                >
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                setActiveCategory(cat.id)
                                setPage(1)
                            }}
                            className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                                activeCategory === cat.id
                                    ? "bg-primary text-white shadow-lg scale-105"
                                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {jobs.map((job, index) => (
                            <motion.div
                                key={job._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <Link href={`/jobs-and-internships/${job.slug || job._id}`}>
                                    <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 group border-none bg-white rounded-2xl">
                                        <div className="relative h-56 overflow-hidden">
                                            <img
                                                src={`https://tmbackend.tahyamisryu.com${job.imageUrl}`}
                                                alt={job.title}
                                                crossOrigin="anonymous"
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute top-4 right-4">
                                                <span className="bg-white/90 backdrop-blur-sm text-primary px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                                                    {getCategoryLabel(job.category)}
                                                </span>
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                        <CardContent className="p-6">
                                            <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                                {job.title}
                                            </h3>
                                            <p className="text-gray-600 line-clamp-2 mb-4">
                                                {job.description}
                                            </p>
                                            <div className="flex items-center justify-between text-sm text-gray-500 mt-auto pt-4 border-t border-gray-100">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(job.createdAt).toLocaleDateString('ar-EG')}
                                                </div>
                                                <div className="flex items-center text-primary font-medium group-hover:translate-x-[-4px] transition-transform">
                                                    التفاصيل
                                                    <ChevronLeft className="w-4 h-4 ml-1" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {isLoading && (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                )}

                {!isLoading && jobs.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">لا توجد فرص متاحة حالياً</h3>
                        <p className="text-gray-500 mt-2">يرجى التحقق لاحقاً أو تغيير فئة البحث.</p>
                    </div>
                )}

                {hasMore && !isLoading && (
                    <div className="text-center pt-8">
                        <button
                            onClick={() => setPage(p => p + 1)}
                            className="bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-full font-bold transition-colors duration-300 shadow-sm"
                        >
                            تحميل المزيد
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
