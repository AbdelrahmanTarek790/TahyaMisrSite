import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { useError } from "../context/ErrorContext"
import { useAuth } from "../context/AuthContext"
import { eventsAPI } from "../api"
import { Search, Calendar, MapPin, Users, Plus } from "lucide-react"
import CreateEventSheet from "../components/forms/CreateEventSheet"

const Events = () => {
    const [events, setEvents] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [pagination, setPagination] = useState({ page: 1, limit: 6, total: 0 })
    const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false)
    const { addError } = useError()
    const { user } = useAuth()

    useEffect(() => {
        fetchEvents()
    }, [pagination.page])

    const fetchEvents = async () => {
        try {
            setIsLoading(true)
            const response = await eventsAPI.getAll({
                page: pagination.page,
                limit: pagination.limit,
            })
            setEvents(response.data?.events || [])
            console.log("Fetched events:", response.data?.events)

            setPagination((prev) => ({
                ...prev,
                total: response.data?.total || 0,
            }))
        } catch (error) {
            addError("Failed to fetch events")
        } finally {
            setIsLoading(false)
        }
    }

    const handleRegister = async (eventId) => {
        try {
            await eventsAPI.register(eventId)
            addError("Successfully registered for event!", "success")
            fetchEvents() // Refresh to show updated registration count
        } catch (error) {
            addError(error?.error || "Failed to register for event")
        }
    }

    const filteredEvents = events.filter(
        (event) =>
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const isEventPast = (dateString) => {
        return new Date(dateString) < new Date()
    }

    const isEventToday = (dateString) => {
        const eventDate = new Date(dateString)
        const today = new Date()
        return eventDate.toDateString() === today.toDateString()
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">الأحداث</h1>
                    <p className="text-gray-600">اكتشف وسجل في الأحداث القادمة</p>
                </div>
                {user?.role === "admin" && (
                    <Button onClick={() => setIsCreateSheetOpen(true)}>
                        إنشاء حدث
                        <Plus className="h-4 w-4 mr-2" />
                    </Button>
                )}
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                    type="text"
                    placeholder="ابحث في الأحداث..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Events Grid */}
            {isLoading && events.length === 0 ? (
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
            ) : filteredEvents.length === 0 ? (
                <Card>
                    <CardContent className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">{searchTerm ? "لا توجد أحداث" : "لا توجد أحداث متاحة"}</h3>
                            <p className="text-gray-600">
                                {searchTerm ? "حاول تعديل مصطلحات البحث الخاصة بك" : "تحقق مرة أخرى لاحقًا للحصول على تحديثات"}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                        <Card key={event._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            {event.image && (
                                <div className="aspect-video overflow-hidden relative">
                                    <img
                                        crossOrigin="anonymous"
                                        src={`https://form.codepeak.software/uploads/${event.image}`}
                                        alt={event.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=400&fit=crop"
                                        }}
                                    />
                                    {isEventToday(event.date) && (
                                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                            اليوم
                                        </div>
                                    )}
                                    {isEventPast(event.date) && (
                                        <div className="absolute top-2 right-2 bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                            ماضٍ
                                        </div>
                                    )}
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                                <CardDescription className="space-y-1">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Calendar className="mr-1 h-3 w-3" />
                                        {formatDate(event.date)}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <MapPin className="mr-1 h-3 w-3" />
                                        {event.location}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Users className="mr-1 h-3 w-3" />
                                        {event.registeredUsers?.length || 0} مسجلين
                                    </div>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 line-clamp-3 mb-4">{event.description}</p>
                                <div className="flex space-x-2">
                                    {/* <Button variant="outline" size="sm">
                                        View Details
                                    </Button> */}
                                    {/* check if user in registeredUsers and registeredUsers is array of object */}
                                    {!isEventPast(event.date) &&
                                        (!event.registeredUsers?.some((user) => user._id === user?._id) ? (
                                            <Button size="sm" onClick={() => handleRegister(event._id)}>
                                                Register
                                            </Button>
                                        ) : (
                                            <Button variant="outline" size="sm" disabled>
                                                Registered
                                            </Button>
                                        ))}
                                </div>
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

            {/* Create Event Sheet */}
            <CreateEventSheet
                isOpen={isCreateSheetOpen}
                onClose={() => setIsCreateSheetOpen(false)}
                onSuccess={() => {
                    fetchEvents()
                    setPagination((prev) => ({ ...prev, page: 1 }))
                }}
            />
        </div>
    )
}

export default Events
