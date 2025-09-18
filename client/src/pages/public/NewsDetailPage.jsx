import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Twitter, Linkedin } from "lucide-react"
import { newsAPI } from "../../api"

const NewsDetailPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [newsItem, setNewsItem] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [relatedNews, setRelatedNews] = useState([])

    useEffect(() => {
        fetchNews()
        fetchRelatedNews()
    }, [id])

    const fetchNews = async () => {
        try {
            setIsLoading(true)
            // For public access, make direct fetch request
            const response = await fetch(`https://form.codepeak.software/api/v1/news/${id}`)
            if (response.ok) {
                const data = await response.json()
                setNewsItem(data.news || data.data)
            } else {
                setError("News article not found")
            }
        } catch (error) {
            console.error("Failed to fetch news:", error)
            setError("Failed to load news article")
        } finally {
            setIsLoading(false)
        }
    }

    const fetchRelatedNews = async () => {
        try {
            const response = await fetch(`https://form.codepeak.software/api/v1/news?limit=3`)
            if (response.ok) {
                const data = await response.json()
                setRelatedNews((data.news || data.data || []).filter((item) => item._id !== id).slice(0, 3))
            }
        } catch (error) {
            console.error("Failed to fetch related news:", error)
        }
    }

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
            })
        } catch (error) {
            return dateString
        }
    }

    const getReadingTime = (content) => {
        const wordsPerMinute = 200
        const wordCount = content.split(" ").length
        const readingTime = Math.ceil(wordCount / wordsPerMinute)
        return readingTime + " دقائق قراءة"
    }

    const shareOnSocial = (platform) => {
        const url = window.location.href
        const title = newsItem?.title

        let shareUrl = ""
        switch (platform) {
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
                break
            case "twitter":
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
                break
            case "linkedin":
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
                break
        }

        if (shareUrl) {
            window.open(shareUrl, "_blank", "width=600,height=400")
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href)
        // You could add a toast notification here
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-egypt-red mx-auto mb-4"></div>
                    <p className="text-gray-600 font-arabic">جاري تحميل المقال...</p>
                </div>
            </div>
        )
    }

    if (error || !newsItem) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4 font-arabic">لم يتم العثور على المقال</h1>
                    <p className="text-gray-600 mb-6 font-arabic">{error || "لا يمكن العثور على المقال المطلوب."}</p>
                    <Link to="/public/news">
                        <Button className="font-arabic">
                            <ArrowLeft className="ml-2 h-4 w-4" />
                            العودة للأخبار
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50">
            {/* Header Navigation */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 font-arabic">
                        <ArrowLeft className="ml-2 h-4 w-4" />
                        العودة
                    </Button>
                </div>
            </div>

            {/* Article Content */}
            <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Image */}
                {newsItem.image && (
                    <div className="mb-8 rounded-xl overflow-hidden shadow-elegant">
                        <img
                            src={`https://form.codepeak.software/uploads/${newsItem.image}`}
                            crossOrigin="anonymous"
                            alt={newsItem.title}
                            className=" w-1/2 mx-auto object-cover"
                        />
                    </div>
                )}

                {/* Article Header */}
                <div className="bg-white rounded-xl shadow-elegant p-8 mb-8">
                    <header className="mb-6">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight font-arabic text-right">{newsItem.title}</h1>

                        <div className="flex flex-wrap items-center justify-end gap-4 text-sm text-gray-600 mb-6">
                            <div className="flex items-center font-arabic">
                                <span>{formatDate(newsItem.createdAt)}</span>
                                <Calendar className="ml-2 h-4 w-4" />
                            </div>

                            <div className="flex items-center font-arabic">
                                <span>بواسطة {newsItem.author?.name || "الإدارة"}</span>
                                <User className="ml-2 h-4 w-4" />
                            </div>

                            <div className="flex items-center font-arabic">
                                <span>{getReadingTime(newsItem.content)}</span>
                                <Clock className="ml-2 h-4 w-4" />
                            </div>
                        </div>

                        {/* Share Buttons */}
                        <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                            <span className="text-sm text-gray-600 ml-2 font-arabic">شارك:</span>
                            <Button variant="outline" size="sm" onClick={() => shareOnSocial("facebook")} className="text-blue-600 hover:bg-blue-50">
                                <Facebook className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => shareOnSocial("twitter")} className="text-blue-400 hover:bg-blue-50">
                                <Twitter className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => shareOnSocial("linkedin")} className="text-blue-700 hover:bg-blue-50">
                                <Linkedin className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={copyToClipboard} className="text-gray-600 hover:bg-gray-50">
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </header>

                    {/* Article Content */}
                    <div className="prose prose-lg max-w-none">
                        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed font-arabic text-right">{newsItem.content}</div>
                    </div>
                </div>

                {/* Related Articles */}
                {relatedNews.length > 0 && (
                    <section className="bg-white rounded-xl shadow-elegant p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-arabic text-right">مقالات ذات صلة</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedNews.map((article) => (
                                <Card key={article._id} className="hover:shadow-elegant transition-shadow cursor-pointer bg-white border-gray-200">
                                    <Link to={`/news/${article._id}`}>
                                        {article.image && (
                                            <div className="aspect-video overflow-hidden rounded-t-lg">
                                                <img
                                                    crossOrigin="anonymous"
                                                    src={`https://form.codepeak.software/uploads/${article.image}`}
                                                    alt={article.title}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                                                />
                                            </div>
                                        )}
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg line-clamp-2 font-arabic text-right">{article.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-gray-600 line-clamp-3 mb-2 font-arabic text-right">{article.content}</p>
                                            <div className="flex items-center justify-end text-xs text-gray-500 font-arabic">
                                                <span>{formatDate(article.createdAt)}</span>
                                                <Calendar className="ml-1 h-3 w-3" />
                                            </div>
                                        </CardContent>
                                    </Link>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}
            </article>

            {/* Call to Action */}
            <section className="py-16 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] text-white mt-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-6 font-arabic">هل تريد البقاء على اطلاع؟</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto font-arabic text-right leading-relaxed">
                        انضم إلى مجتمعنا للحصول على آخر الأخبار والتحديثات مباشرة في لوحة التحكم الخاصة بك
                    </p>
                    <Link to="/register">
                        <Button size="lg" className="bg-white text-egypt-red hover:bg-gray-100 hover:text-egypt-red px-8 py-3 font-arabic">
                            انضم إلى مجتمعنا
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}

export default NewsDetailPage
