'use client'
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Newspaper, Calendar, Image, Award, Handshake, Star } from "lucide-react"
import { newsAPI, eventsAPI, usersAPI, mediaAPI, honorRollAPI, partnersAPI, privilegesAPI } from "@/app/api/api"
import { useError } from "@/context/ErrorContext"
import { useLocalization } from "@/hooks/useLocalization.jsx"

const Dashboard = () => {
    const { user } = useAuth()
    const { addError } = useError()
    const { t, isRTL } = useLocalization()
    const [dashboardData, setDashboardData] = useState({
        newsCount: 0,
        eventsCount: 0,
        usersCount: 0,
        mediaCount: 0,
        honorRollCount: 0,
        partnersCount: 0,
        privilegesCount: 0,
        recentNews: [],
        upcomingEvents: [],
        recentPartners: [],
    })
    const [isLoading, setIsLoading] = useState(true)

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true)

                // Fetch all data in parallel
                const [newsResponse, eventsResponse, usersResponse, mediaResponse, honorResponse, partnersResponse, privilegesResponse] = await Promise.allSettled([
                    newsAPI.getAll({ page: 1, limit: 3 }).catch(() => ({ data: { news: [], total: 0 } })),
                    eventsAPI.getAll({ page: 1, limit: 3 }).catch(() => ({ data: { events: [], total: 0 } })),
                    user?.role === "admin"
                        ? usersAPI.getAll({ page: 1, limit: 1 }).catch(() => ({ data: { total: 0 } }))
                        : Promise.resolve({ data: { total: 0 } }),
                    mediaAPI.getAll({ page: 1, limit: 1 }).catch(() => ({ data: { total: 0 } })),
                    honorRollAPI.getAll({ page: 1, limit: 1 }).catch(() => ({ data: { total: 0 } })),
                    partnersAPI.getAll({ page: 1, limit: 3 }).catch(() => ({ data: { partners: [], total: 0 } })),
                    privilegesAPI.getAll({ page: 1, limit: 1 }).catch(() => ({ data: { total: 0 } })),
                ])
                
                const newsData = newsResponse.status === "fulfilled" ? newsResponse.value.data : { news: [], pagination: { total: 0 } }
                const eventsData = eventsResponse.status === "fulfilled" ? eventsResponse.value.data : { events: [], pagination: { total: 0 } }
                const usersData = usersResponse.status === "fulfilled" ? usersResponse.value.data : { pagination: { total: 0 } }
                const mediaData = mediaResponse.status === "fulfilled" ? mediaResponse.value.data : { pagination: { total: 0 } }
                const honorData = honorResponse.status === "fulfilled" ? honorResponse.value.data : { pagination: { total: 0 } }
                const partnersData = partnersResponse.status === "fulfilled" ? partnersResponse.value.data : { partners: [], pagination: { total: 0 } }
                const privilegesData = privilegesResponse.status === "fulfilled" ? privilegesResponse.value.data : { pagination: { total: 0 } }

                setDashboardData({
                    newsCount: newsData.pagination?.total || 0,
                    eventsCount: eventsData.pagination?.total || 0,
                    usersCount: usersData.pagination?.total || 0,
                    mediaCount: mediaData.pagination?.total || 0,
                    honorRollCount: honorData.pagination?.total || 0,
                    partnersCount: partnersData.pagination?.total || 0,
                    privilegesCount: privilegesData.pagination?.total || 0,
                    recentNews: newsData.news || [],
                    upcomingEvents: eventsData.events || [],
                    recentPartners: partnersData.partners || [],
                })
            } catch (error) {
                console.error("Error fetching dashboard data:", error)
                addError(t("dashboard.errors.failedToLoadData"))
            } finally {
                setIsLoading(false)
            }
        }

        fetchDashboardData()
    }, [user?.role, addError])

    const stats = [
        {
            title: t("dashboard.stats.newsArticles"),
            value: isLoading ? t("dashboard.sections.loading") : dashboardData.newsCount.toString(),
            icon: Newspaper,
            description: t("dashboard.stats.publishedArticles"),
        },
        {
            title: t("dashboard.stats.upcomingEvents"),
            value: isLoading ? t("dashboard.sections.loading") : dashboardData.eventsCount.toString(),
            icon: Calendar,
            description: t("dashboard.stats.totalEvents"),
        },
        {
            title: t("dashboard.stats.mediaItems"),
            value: isLoading ? t("dashboard.sections.loading") : dashboardData.mediaCount.toString(),
            icon: Image,
            description: t("dashboard.stats.photosAndVideos"),
        },
        {
            title: t("dashboard.stats.activeMembers"),
            value: isLoading ? t("dashboard.sections.loading") : dashboardData.usersCount.toString(),
            icon: Users,
            description: t("dashboard.stats.registeredUsers"),
        },
        {
            title: "أعضاء لجنة الشرف",
            value: isLoading ? t("dashboard.sections.loading") : dashboardData.honorRollCount.toString(),
            icon: Award,
            description: "إجمالي المكرمين في لوحة الشرف",
        },
        {
            title: "شركاء النجاح",
            value: isLoading ? t("dashboard.sections.loading") : dashboardData.partnersCount.toString(),
            icon: Handshake,
            description: "إجمالي الرعاة والشركاء",
        },
        {
            title: "الامتيازات المتاحة",
            value: isLoading ? t("dashboard.sections.loading") : dashboardData.privilegesCount.toString(),
            icon: Star,
            description: "إجمالي المزايا والخصومات",
        },
    ]

    const welcomeMessage = () => {
        const hour = new Date().getHours()
        if (hour < 12) return t("dashboard.welcome.morning")
        if (hour < 18) return t("dashboard.welcome.afternoon")
        return t("dashboard.welcome.evening")
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString(isRTL ? "ar-EG" : "en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <div className={`space-y-6 ${isRTL ? "text-right" : "text-left"}`}>
            {/* Welcome Section */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    {welcomeMessage()}، {user?.name}!
                </h1>
                <p className="mt-2 text-gray-600">{t("dashboard.welcomeMessage", { role: t(`dashboard.roles.${user?.role}`) || user?.role })}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.title} className="hover:shadow-md transition-shadow">
                            <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Icon className={`h-4 w-4 text-primary ${isRTL ? "ml-0 mr-2" : ""}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{t("dashboard.sections.recentNews")}</CardTitle>
                        <CardDescription>{t("dashboard.sections.latestPublishedArticles")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                </div>
                            ) : dashboardData.recentNews.length > 0 ? (
                                dashboardData.recentNews.map((article) => (
                                    <div key={article._id} className={`flex items-center`}>
                                        <div className={`w-2 h-2 bg-primary rounded-full ${isRTL ? "ml-3" : "mr-3"}`}></div>
                                        <div>
                                            <p className="font-medium">{article.title}</p>
                                            <p className="text-sm text-gray-500">{formatDate(article.createdAt)}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-sm text-gray-500">{t("dashboard.sections.noNewsAvailable")}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t("dashboard.sections.upcomingEvents")}</CardTitle>
                        <CardDescription>{t("dashboard.sections.scheduledEvents")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                </div>
                            ) : dashboardData.upcomingEvents.length > 0 ? (
                                dashboardData.upcomingEvents.map((event) => (
                                    <div key={event._id} className={`flex items-center`}>
                                        <div className={`w-2 h-2 bg-green-500 rounded-full ${isRTL ? "ml-3" : "mr-3"}`}></div>
                                        <div>
                                            <p className="font-medium">{event.title}</p>
                                            <p className="text-sm text-gray-500">{formatDate(event.date)}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-sm text-gray-500">{t("dashboard.sections.noEventsAvailable")}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>شركاء النجاح الجدد</CardTitle>
                        <CardDescription>أحدث الشركاء الذين انضموا إلينا مؤخراً</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {isLoading ? (
                                <div className="col-span-full flex items-center justify-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                </div>
                            ) : dashboardData.recentPartners.length > 0 ? (
                                dashboardData.recentPartners.map((partner) => (
                                    <div key={partner._id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                            <img src={`https://tmbackend.tahyamisryu.com/uploads/${partner.logo}`} alt={partner.name} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">{partner.name}</p>
                                            <p className="text-xs text-gray-500 capitalize">{partner.category}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-4">
                                    <p className="text-sm text-gray-500">لا يوجد شركاء حالياً</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Dashboard
