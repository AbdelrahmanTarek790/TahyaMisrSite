import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Users, Newspaper, Calendar, Image } from "lucide-react"
import { newsAPI, eventsAPI, usersAPI, mediaAPI } from "../../api"
import { useError } from "../../context/ErrorContext"
import { useLocalization } from "../../hooks/useLocalization.jsx"

const Dashboard = () => {
    const { user } = useAuth()
    const { addError } = useError()
    const { t, isRTL } = useLocalization()
    const [dashboardData, setDashboardData] = useState({
        newsCount: 0,
        eventsCount: 0,
        usersCount: 0,
        mediaCount: 0,
        recentNews: [],
        upcomingEvents: [],
    })
    const [isLoading, setIsLoading] = useState(true)

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true)

                // Fetch all data in parallel
                const [newsResponse, eventsResponse, usersResponse, mediaResponse] = await Promise.allSettled([
                    newsAPI.getAll({ page: 1, limit: 3 }).catch(() => ({ data: { news: [], total: 0 } })),
                    eventsAPI.getAll({ page: 1, limit: 3 }).catch(() => ({ data: { events: [], total: 0 } })),
                    user?.role === "admin"
                        ? usersAPI.getAll({ page: 1, limit: 1 }).catch(() => ({ data: { total: 0 } }))
                        : Promise.resolve({ data: { total: 0 } }),
                    mediaAPI.getAll({ page: 1, limit: 1 }).catch(() => ({ data: { total: 0 } })),
                ])

                const newsData = newsResponse.status === "fulfilled" ? newsResponse.value.data : { news: [], total: 0 }
                const eventsData = eventsResponse.status === "fulfilled" ? eventsResponse.value.data : { events: [], total: 0 }
                const usersData = usersResponse.status === "fulfilled" ? usersResponse.value.data : { total: 0 }
                const mediaData = mediaResponse.status === "fulfilled" ? mediaResponse.value.data : { total: 0 }

                setDashboardData({
                    newsCount: newsData.total || 0,
                    eventsCount: eventsData.total || 0,
                    usersCount: usersData.total || 0,
                    mediaCount: mediaData.total || 0,
                    recentNews: newsData.news || [],
                    upcomingEvents: eventsData.events || [],
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.title}>
                            <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <Icon className={`h-4 w-4 text-muted-foreground ${isRTL ? "ml-0 mr-2" : ""}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">{stat.description}</p>
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
            </div>
        </div>
    )
}

export default Dashboard
