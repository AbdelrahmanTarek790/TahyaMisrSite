"use client"
import { useState, useEffect } from "react"
import { Search, Calendar, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NewsClient({ initialNews, initialTotal }) {
    const [news, setNews] = useState(initialNews)
    const [isLoading, setIsLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [pagination, setPagination] = useState({ page: 1, limit: 9, total: initialTotal })

    useEffect(() => {
        if (pagination.page > 1 || searchTerm) {
            fetchNews()
        }
    }, [pagination.page, searchTerm])

    const fetchNews = async () => {
        try {
            setIsLoading(true)

            let url = `https://tmbackend.tahyamisryu.com/api/v1/news?page=${pagination.page}&limit=${pagination.limit}`
            if (searchTerm.trim()) {
                url += `&title=${encodeURIComponent(searchTerm.trim())}`
            }

            const response = await fetch(url)
            if (response.ok) {
                const data = await response.json()
                setNews(data.data.news || [])
                setPagination((prev) => ({
                    ...prev,
                    total: data.data.pagination?.total || 0,
                }))
            }
        } catch (error) {
            console.error("Failed to fetch news:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })
        } catch (error) {
            return dateString
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50">
            {/* Hero Section */}
            <section className="relative py-24 lg:py-32 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] text-white overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center animate-fade-in">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-arabic">أخبارنا</h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90 font-arabic text-center leading-relaxed">
                            تابع آخر الأخبار والإعلانات والإنجازات من اتحاد شباب تحيا مصر
                        </p>
                    </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-10 right-10 w-24 h-24 bg-white/10 rounded-full animate-float"></div>
                    <div
                        className="absolute bottom-10 left-10 w-32 h-32 bg-white/20 rounded-full animate-float"
                        style={{ animationDelay: "1.5s" }}
                    ></div>
                    <div
                        className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/20 rounded-full animate-float"
                        style={{ animationDelay: "0.5s" }}
                    ></div>
                </div>
            </section>

            {/* Content */}
            <section className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Search */}
                    <div className="max-w-2xl mx-auto mb-12 animate-fade-in">
                        <div className="relative">
                            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="ابحث بكلمة أو جزء من العنوان..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value)
                                    setPagination((prev) => ({ ...prev, page: 1 }))
                                }}
                                className="w-full pr-12 pl-12 py-4 rounded-xl border border-gray-200 bg-white shadow-card focus:outline-none focus:ring-2 focus:ring-egypt-gold focus:border-transparent text-right font-arabic placeholder:text-gray-400"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => {
                                        setSearchTerm("")
                                        setPagination((prev) => ({ ...prev, page: 1 }))
                                    }}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* News Grid */}
                    {isLoading && news.length === 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(9)].map((_, i) => (
                                <Card key={i} className="animate-pulse bg-white border-gray-200 shadow-card overflow-hidden">
                                    <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                                    <CardHeader>
                                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                                        <div className="h-6 bg-gray-300 rounded"></div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="h-3 bg-gray-300 rounded"></div>
                                            <div className="h-3 bg-gray-300 rounded"></div>
                                            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : news.length === 0 ? (
                        <Card className="bg-white border-gray-200 shadow-card">
                            <CardContent className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <h3 className="text-lg font-medium text-foreground mb-2 font-arabic">
                                        {searchTerm ? "لم يتم العثور على أخبار" : "لا توجد أخبار متاحة"}
                                    </h3>
                                    <p className="text-muted-foreground font-arabic">
                                        {searchTerm ? "جرب تعديل مصطلحات البحث" : "تحقق لاحقاً للحصول على آخر الأخبار"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {news.map((newsItem, index) => (
                                <Link href={`/news/${newsItem.slug || newsItem._id}`} key={newsItem._id}>
                                    <Card
                                        className="group overflow-hidden h-full hover:shadow-elegant hover:-translate-y-2 transition-all duration-500 bg-white border-gray-200 animate-slide-up"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        {newsItem.image && (
                                            <div className="overflow-hidden relative">
                                                <img
                                                    crossOrigin="anonymous"
                                                    src={`https://tmbackend.tahyamisryu.com/uploads/${newsItem.image}`}
                                                    alt={newsItem.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    onError={(e) => {
                                                        e.target.src =
                                                            "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop"
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-egypt-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </div>
                                        )}
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-egypt-red transition-colors duration-300 font-arabic text-right">
                                                {newsItem.title}
                                            </CardTitle>
                                            <CardDescription className="flex items-center justify-end text-sm text-egypt-gold font-arabic">
                                                <span>{formatDate(newsItem.createdAt)}</span>
                                                <Calendar className="ml-2 h-4 w-4" />
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground line-clamp-3 mb-4 leading-relaxed font-arabic text-right">
                                                {newsItem.content}
                                            </p>
                                            <div className="flex justify-between items-center">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="group-hover:bg-egypt-red group-hover:text-white group-hover:border-egypt-red transition-all duration-300 font-arabic"
                                                >
                                                    اقرأ المزيد
                                                </Button>
                                                <span className="text-xs text-muted-foreground font-arabic">
                                                    بواسطة {newsItem.author?.name || "الإدارة"}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.total > pagination.limit && !searchTerm && (
                        <div className="flex justify-center gap-3 space-x-reverse mt-12 animate-fade-in">
                            <Button
                                variant="outline"
                                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                                disabled={pagination.page === 1 || isLoading}
                                className="border-egypt-gold text-egypt-red hover:bg-egypt-gold hover:text-white transition-all duration-300 font-arabic"
                            >
                                السابق
                            </Button>
                            <span className="flex items-center px-6 py-1 bg-white border border-gray-200 rounded-lg text-foreground font-medium font-arabic">
                                صفحة {pagination.page} من {Math.ceil(pagination.total / pagination.limit)}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                                disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit) || isLoading}
                                className="border-egypt-gold text-egypt-red hover:bg-egypt-gold hover:text-white transition-all duration-300 font-arabic"
                            >
                                التالي
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] text-white relative overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="animate-fade-in">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 font-arabic">هل تريد البقاء على اطلاع؟</h2>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90 font-arabic text-center leading-relaxed">
                            انضم إلى مجتمعنا للحصول على آخر الأخبار والتحديثات مباشرة في لوحة التحكم الخاصة بك
                        </p>
                        <Link href="/join">
                            <Button
                                size="lg"
                                className="bg-white text-egypt-red hover:bg-gray-100 hover:text-egypt-red px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-glow font-arabic"
                            >
                                انضم إلى مجتمعنا
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
