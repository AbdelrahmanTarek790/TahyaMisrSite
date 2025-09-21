import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { eventsAPI } from "../../api"
import { useError } from "../../context/ErrorContext"
import { exportEventUsersToExcel } from "../../utils/excelExport"
import { Download, Users, Calendar, MapPin, Loader2 } from "lucide-react"

const EventDetailsDialog = ({ event, isOpen, onClose }) => {
    const [registeredUsers, setRegisteredUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const { addError } = useError()

    useEffect(() => {
        if (isOpen && event?._id) {
            fetchRegisteredUsers()
        }
    }, [isOpen, event?._id, fetchRegisteredUsers])

    const fetchRegisteredUsers = useCallback(async () => {
        if (!event?._id) return
        
        try {
            setIsLoading(true)
            const response = await eventsAPI.getRegisteredUsers(event._id)
            setRegisteredUsers(response.data?.registeredUsers || [])
        } catch (error) {
            console.error('Failed to fetch registered users:', error)
            addError("Failed to fetch registered users")
            setRegisteredUsers([])
        } finally {
            setIsLoading(false)
        }
    }, [event?._id, addError])

    const handleExport = async () => {
        if (!registeredUsers.length) {
            addError("No registered users to export")
            return
        }

        try {
            setIsExporting(true)
            const success = exportEventUsersToExcel(
                registeredUsers,
                event.title
            )
            
            if (success) {
                addError("Users exported successfully!", "success")
            } else {
                addError("Failed to export users")
            }
        } catch (error) {
            console.error('Failed to export users:', error)
            addError("Failed to export users")
        } finally {
            setIsExporting(false)
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    if (!event) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">{event.title}</DialogTitle>
                    <DialogDescription>
                        <div className="flex flex-col space-y-2 mt-2">
                            <div className="flex items-center space-x-4">
                                <span className="flex items-center">
                                    <Calendar className="mr-1 h-4 w-4" />
                                    {formatDate(event.date)}
                                </span>
                                <span className="flex items-center">
                                    <MapPin className="mr-1 h-4 w-4" />
                                    {event.location}
                                </span>
                                <span className="flex items-center">
                                    <Users className="mr-1 h-4 w-4" />
                                    {registeredUsers.length} مسجل
                                </span>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Event Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle>وصف الفعالية</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700">{event.description}</p>
                        </CardContent>
                    </Card>

                    {/* Event Image */}
                    {event.image && (
                        <Card>
                            <CardContent className="p-4">
                                <img
                                    src={`https://form.codepeak.software/uploads/${event.image}`}
                                    alt={event.title}
                                    className="w-full max-h-64 object-cover rounded-lg"
                                    crossOrigin="anonymous"
                                    onError={(e) => {
                                        e.target.src = "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=400&fit=crop"
                                    }}
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* Registered Users */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>المستخدمين المسجلين ({registeredUsers.length})</CardTitle>
                                <CardDescription>قائمة بالمستخدمين المسجلين في هذه الفعالية</CardDescription>
                            </div>
                            <Button 
                                onClick={handleExport}
                                disabled={isExporting || !registeredUsers.length}
                                variant="outline"
                            >
                                {isExporting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Download className="mr-2 h-4 w-4" />
                                )}
                                تصدير Excel
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                </div>
                            ) : registeredUsers.length === 0 ? (
                                <div className="text-center py-8">
                                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-lg font-medium text-gray-900">لا يوجد مستخدمين مسجلين</h3>
                                    <p className="text-gray-500">لم يقم أي مستخدم بالتسجيل في هذه الفعالية بعد</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left pb-3 font-medium">المستخدم</th>
                                                <th className="text-left pb-3 font-medium">الجامعة</th>
                                                <th className="text-left pb-3 font-medium">المحافظة</th>
                                                <th className="text-left pb-3 font-medium">الوظيفة</th>
                                                <th className="text-left pb-3 font-medium">تاريخ التسجيل</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {registeredUsers.map((user) => (
                                                <tr key={user._id} className="border-b">
                                                    <td className="py-4">
                                                        <div>
                                                            <div className="font-medium">{user.name}</div>
                                                            <div className="text-sm text-gray-500">{user.email}</div>
                                                            <div className="text-xs text-gray-400">{user.phone}</div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 text-sm">{user.university}</td>
                                                    <td className="py-4 text-sm">{user.governorate}</td>
                                                    <td className="py-4 text-sm">{user.position?.name || "N/A"}</td>
                                                    <td className="py-4 text-sm">
                                                        {new Date(user.createdAt).toLocaleDateString("ar-EG")}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default EventDetailsDialog