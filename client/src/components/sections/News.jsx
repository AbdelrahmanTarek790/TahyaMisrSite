import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InViewSection, InViewStagger } from "@/components/ui/MotionComponents"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { Button } from "../ui/enhanced-button"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const News = () => {
    const [newsItems, setNewsItems] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchNews()
    }, [])

    const fetchNews = async () => {
        try {
            setIsLoading(true)
            const response = await fetch("https://form.codepeak.software/api/v1/news?page=1&limit=4")
            if (response.ok) {
                const data = await response.json()
                const news = data.data?.news || []
                // Transform backend data to match component format
                const transformedNews = news.map((item, index) => ({
                    id: item._id,
                    title: item.title,
                    excerpt: item.content.length > 150 ? item.content.substring(0, 150) + "..." : item.content,
                    date: formatDate(item.createdAt),
                    category: "News",
                    image: item.image
                        ? `https://form.codepeak.software/uploads/${item.image}`
                        : "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop",
                    featured: index === 0, // Mark first item as featured
                }))
                setNewsItems(transformedNews)
            }
        } catch (error) {
            console.error("Failed to fetch news:", error)
            // Fallback to placeholder data if API fails
            setNewsItems([])
        } finally {
            setIsLoading(false)
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    return (
        <section className="py-20 bg-[linear-gradient(180deg,_rgb(245,245,245),_rgb(255,255,255))]">
            <div className="container mx-auto px-6">
                <InViewSection animation="fadeInUp" className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                        آخر <span className="text-egypt-red animate-gradient">الأخبار</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        تابع أحدث الأخبار والفعاليات والمبادرات التي ينظمها اتحاد شباب تحيا مصر
                    </p>
                </InViewSection>

                {isLoading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        {/* Loading skeleton */}
                        <div className="lg:col-span-1 animate-pulse">
                            <Card className="bg-card border-border overflow-hidden">
                                <div className="w-full h-64 bg-gray-300"></div>
                                <CardContent className="p-6">
                                    <div className="h-4 bg-gray-300 rounded mb-3"></div>
                                    <div className="h-6 bg-gray-300 rounded mb-3"></div>
                                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                                    <div className="h-10 bg-gray-300 rounded"></div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="space-y-6">
                            {[1, 2, 3].map((i) => (
                                <Card key={i} className="bg-card border-border animate-pulse">
                                    <CardContent className="p-6">
                                        <div className="flex space-x-4">
                                            <div className="w-24 h-24 bg-gray-300 rounded-lg"></div>
                                            <div className="flex-1">
                                                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                                                <div className="h-5 bg-gray-300 rounded mb-2"></div>
                                                <div className="h-3 bg-gray-300 rounded"></div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : newsItems.length > 0 ? (
                    <InViewStagger className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12" staggerDelay={0.2}>
                        {/* Featured News */}
                        <div className="lg:col-span-1">
                            <Card className="group bg-card border-border hover:shadow-elegant transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                                <div className="relative overflow-hidden">
                                    <img
                                        src={`${newsItems[0].image}`}
                                        alt={newsItems[0].title}
                                        crossOrigin="anonymous"
                                        className="w-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop"
                                        }}
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] text-egypt-white px-3 py-1 rounded-full text-sm font-semibold animate-bounce-in">
                                            مميز
                                        </span>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-egypt-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-4 mb-3">
                                        <span className="text-egypt-gold text-sm font-medium">{newsItems[0].category}</span>
                                        <div className="flex items-center text-muted-foreground text-sm">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            {newsItems[0].date}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-egypt-red transition-colors duration-300">
                                        {newsItems[0].title}
                                    </h3>
                                    <p className="text-muted-foreground mb-4 leading-relaxed">{newsItems[0].excerpt}</p>
                                    <Link to={`/news/${newsItems[0].id}`}>
                                        <Button
                                            variant="outline"
                                            className="group-hover:bg-egypt-red group-hover:text-egypt-white group-hover:border-egypt-red transition-all duration-300"
                                        >
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                            <span className="text-sm font-semibold">اقرأ المزيد</span>
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>

                        {/* News List */}
                        <div className="space-y-6">
                            {newsItems.slice(1).map((item, index) => (
                                <Card
                                    key={item.id}
                                    className="group bg-card border-border hover:shadow-card transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                                    style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                                >
                                    <CardContent className="p-6">
                                        <Link to={`/news/${item.id}`} className="flex space-x-4">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                crossOrigin="anonymous"
                                                className="w-24 h-24 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    e.target.src = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop"
                                                }}
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <span className="text-egypt-gold text-sm font-medium">{item.category}</span>
                                                    <div className="flex items-center text-muted-foreground text-sm">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {item.date}
                                                    </div>
                                                </div>
                                                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-egypt-red transition-colors duration-300">
                                                    {item.title}
                                                </h3>
                                                <p className="text-muted-foreground text-sm leading-relaxed">
                                                    {item.excerpt.length > 120 ? item.excerpt.substring(0, 120) + "..." : item.excerpt}
                                                </p>
                                            </div>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </InViewStagger>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">لا توجد أخبار متاحة في الوقت الحالي.</p>
                    </div>
                )}

                <div className="text-center animate-bounce-in">
                    <Link to="/news">
                        <Button variant="cta" size="lg" className="hover:shadow-glow hover:scale-105 transition-all duration-300">
                            <ArrowRight className="w-5 h-5 ml-2" />
                            عرض جميع الأخبار
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default News
