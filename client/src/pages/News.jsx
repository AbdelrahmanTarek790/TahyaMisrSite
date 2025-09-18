import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { useError } from "../context/ErrorContext"
import { useAuth } from "../context/AuthContext"
import { newsAPI } from "../api"
import { Search, Calendar, Plus } from "lucide-react"
import CreateNewsSheet from "../components/forms/CreateNewsSheet"
import { Link } from "react-router-dom"

const News = () => {
    const [news, setNews] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [pagination, setPagination] = useState({ page: 1, limit: 6, total: 0 })
    const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false)
    const { addError } = useError()
    const { user } = useAuth()

    useEffect(() => {
        fetchNews()
    }, [pagination.page])

    const fetchNews = async () => {
        try {
            setIsLoading(true)
            const response = await newsAPI.getAll({
                page: pagination.page,
                limit: pagination.limit,
            })
            setNews(response.data?.news || [])
            setPagination((prev) => ({
                ...prev,
                total: response.data?.total || 0,
            }))
        } catch (error) {
            addError("Failed to fetch news")
        } finally {
            setIsLoading(false)
        }
    }

    const filteredNews = news.filter(
        (newsItem) =>
            newsItem.title.toLowerCase().includes(searchTerm.toLowerCase()) || newsItem.content.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">الأخبار</h1>
                    <p className="text-gray-600">تابع آخر الأخبار والإعلانات</p>
                </div>
                {user?.role === "admin" && (
                    <Button onClick={() => setIsCreateSheetOpen(true)}>
                        إنشاء خبر
                        <Plus className="h-4 w-4 mr-2" />
                    </Button>
                )}
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                    type="text"
                    placeholder="ابحث في الأخبار..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* News Grid */}
            {isLoading && news.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                            <CardHeader>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="h-3 bg-gray-200 rounded"></div>
                                    <div className="h-3 bg-gray-200 rounded"></div>
                                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : filteredNews.length === 0 ? (
                <Card>
                    <CardContent className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">{searchTerm ? "لا توجد أخبار" : "لا توجد أخبار متاحة"}</h3>
                            <p className="text-gray-600">{searchTerm ? "حاول تعديل مصطلحات البحث الخاصة بك" : "تحقق مرة أخرى لاحقًا للحصول على تحديثات"}</p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNews.map((newsItem) => (
                        <Card key={newsItem._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            {newsItem.image && (
                                <div className=" overflow-hidden">
                                    <img
                                        crossOrigin="anonymous"
                                        src={`https://form.codepeak.software/uploads/${newsItem.image}`}
                                        alt={newsItem.title}
                                        className="w-full object-cover hover:scale-105 transition-transform"
                                    />
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="text-lg line-clamp-2">{newsItem.title}</CardTitle>
                                <CardDescription className="flex items-center text-sm text-gray-500">
                                    <Calendar className="mr-1 h-3 w-3" />
                                    {formatDate(newsItem.createdAt)}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 line-clamp-3 mb-4">{newsItem.content}</p>
                                <Button variant="outline" size="sm">
                                    <Link to={`/news/${newsItem._id}`} className="text-blue-600 hover:underline">
                                        قراءة المزيد
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination.total > pagination.limit && !searchTerm && (
                <div className="flex justify-center space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page === 1 || isLoading}
                    >
                        Previous
                    </Button>
                    <span className="flex items-center px-4">
                        Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                        disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit) || isLoading}
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* Create News Sheet */}
            <CreateNewsSheet
                isOpen={isCreateSheetOpen}
                onClose={() => setIsCreateSheetOpen(false)}
                onSuccess={() => {
                    fetchNews()
                    setPagination((prev) => ({ ...prev, page: 1 }))
                }}
            />
        </div>
    )
}

export default News
