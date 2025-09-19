import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Textarea } from "../../components/ui/textarea"
import { AlertCircle, CheckCircle, X, Eye, Users, Clock, UserCheck, UserX } from "lucide-react"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { joinRequestAPI } from "../../api"

const JoinRequestManagement = () => {
    const [joinRequests, setJoinRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [selectedRequest, setSelectedRequest] = useState(null)
    const [processingId, setProcessingId] = useState(null)
    const [actionNotes, setActionNotes] = useState("")

    const [filters, setFilters] = useState({
        status: "all",
        search: "",
        page: 1,
    })

    const [pagination, setPagination] = useState({
        current: 1,
        total: 1,
        count: 0,
        totalCount: 0,
    })

    // Fetch join requests
    const fetchJoinRequests = async () => {
        try {
            setLoading(true)
            const params = {
                page: filters.page,
                limit: 10,
            }

            if (filters.status !== "all") {
                params.status = filters.status
            }

            const response = await joinRequestAPI.getAll(params)
            setJoinRequests(response.data.joinRequests || [])
            setPagination(response.data.pagination || {})
        } catch (error) {
            setError(error.error || "حدث خطأ أثناء جلب الطلبات")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchJoinRequests()
    }, [filters.status, filters.page])

    // Handle approve request
    const handleApprove = async (requestId) => {
        if (!actionNotes.trim()) {
            setError("يرجى إضافة ملاحظات للموافقة")
            return
        }

        try {
            setProcessingId(requestId)
            await joinRequestAPI.approve(requestId, {
                notes: actionNotes,
                university: "غير محدد", // Could be added to form
                membershipExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
            })

            setActionNotes("")
            setSelectedRequest(null)
            fetchJoinRequests()
        } catch (error) {
            setError(error.error || "حدث خطأ أثناء الموافقة على الطلب")
        } finally {
            setProcessingId(null)
        }
    }

    // Handle deny request
    const handleDeny = async (requestId) => {
        if (!actionNotes.trim()) {
            setError("يرجى إضافة ملاحظات للرفض")
            return
        }

        try {
            setProcessingId(requestId)
            await joinRequestAPI.deny(requestId, {
                notes: actionNotes,
            })

            setActionNotes("")
            setSelectedRequest(null)
            fetchJoinRequests()
        } catch (error) {
            setError(error.error || "حدث خطأ أثناء رفض الطلب")
        } finally {
            setProcessingId(null)
        }
    }

    // Handle delete request
    const handleDelete = async (requestId) => {
        if (!confirm("هل أنت متأكد من حذف هذا الطلب؟")) {
            return
        }

        try {
            setProcessingId(requestId)
            await joinRequestAPI.delete(requestId)
            fetchJoinRequests()
        } catch (error) {
            setError(error.error || "حدث خطأ أثناء حذف الطلب")
        } finally {
            setProcessingId(null)
        }
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { label: "في الانتظار", variant: "default", color: "bg-yellow-100 text-yellow-800" },
            approved: { label: "مقبول", variant: "success", color: "bg-green-100 text-green-800" },
            denied: { label: "مرفوض", variant: "destructive", color: "bg-red-100 text-red-800" },
        }

        const config = statusConfig[status] || statusConfig.pending
        return <Badge className={config.color}>{config.label}</Badge>
    }

    const filteredRequests = joinRequests.filter((request) => {
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase()
            return (
                request.name.toLowerCase().includes(searchTerm) ||
                request.email.toLowerCase().includes(searchTerm) ||
                request.phone.includes(searchTerm) ||
                request.nationalID.includes(searchTerm)
            )
        }
        return true
    })

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <Clock className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p>جاري تحميل الطلبات...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6" dir="rtl">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">إدارة طلبات الانضمام</h1>
                    <p className="text-muted-foreground">مراجعة والموافقة على طلبات انضمام الأعضاء الجدد</p>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-lg px-4 py-2">
                        إجمالي الطلبات: {pagination.totalCount}
                    </Badge>
                </div>
            </div>

            {error && (
                <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-600">{error}</AlertDescription>
                </Alert>
            )}

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>فلترة الطلبات</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="البحث بالاسم، البريد الإلكتروني، الهاتف، أو الرقم القومي..."
                                value={filters.search}
                                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                            />
                        </div>
                        <Select value={filters.status} onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value, page: 1 }))}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="فلترة بالحالة" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">جميع الطلبات</SelectItem>
                                <SelectItem value="pending">في الانتظار</SelectItem>
                                <SelectItem value="approved">مقبولة</SelectItem>
                                <SelectItem value="denied">مرفوضة</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Join Requests List */}
            <div className="grid gap-6">
                {filteredRequests.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-16">
                            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-xl font-bold mb-2">لا توجد طلبات</h3>
                            <p className="text-muted-foreground">
                                {filters.search ? "لم يتم العثور على طلبات تطابق البحث" : "لا توجد طلبات انضمام حاليًا"}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredRequests.map((request) => (
                        <Card key={request._id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl">{request.name}</CardTitle>
                                        <p className="text-muted-foreground">{request.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getStatusBadge(request.status)}
                                        <Badge variant="outline">{request.role === "member" ? "عضو" : "متطوع"}</Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                    <div>
                                        <p className="text-sm text-muted-foreground">الهاتف</p>
                                        <p className="font-medium">{request.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">المحافظة</p>
                                        <p className="font-medium">{request.governorate}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">الرقم القومي</p>
                                        <p className="font-medium">{request.nationalID}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">تاريخ الطلب</p>
                                        <p className="font-medium">{new Date(request.createdAt).toLocaleDateString("ar-EG")}</p>
                                    </div>
                                </div>

                                {request.position && (
                                    <div className="mb-4">
                                        <p className="text-sm text-muted-foreground">المنصب المطلوب</p>
                                        <p className="font-medium">{request.position.title}</p>
                                    </div>
                                )}

                                {request.membershipNumber && (
                                    <div className="mb-4">
                                        <p className="text-sm text-muted-foreground">رقم العضوية السابق</p>
                                        <p className="font-medium">{request.membershipNumber}</p>
                                    </div>
                                )}

                                {request.notes && (
                                    <div className="mb-4">
                                        <p className="text-sm text-muted-foreground">ملاحظات المتقدم</p>
                                        <p className="bg-muted p-3 rounded-lg">{request.notes}</p>
                                    </div>
                                )}

                                {request.status !== "pending" && (
                                    <div className="mb-4 p-4 bg-muted rounded-lg">
                                        <p className="text-sm text-muted-foreground">
                                            تمت المراجعة بواسطة: {request.reviewedBy?.name}
                                            في {new Date(request.reviewedAt).toLocaleDateString("ar-EG")}
                                        </p>
                                        {request.approvalNotes && <p className="mt-2 font-medium">{request.approvalNotes}</p>}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                {request.status === "pending" && (
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setSelectedRequest(selectedRequest === request._id ? null : request._id)}
                                        >
                                            <Eye className="w-4 h-4 ml-2" />
                                            {selectedRequest === request._id ? "إخفاء الإجراءات" : "عرض الإجراءات"}
                                        </Button>
                                    </div>
                                )}

                                {/* Action Panel */}
                                {selectedRequest === request._id && request.status === "pending" && (
                                    <div className="mt-6 p-4 border rounded-lg bg-muted/50">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium">ملاحظات الإجراء</label>
                                                <Textarea
                                                    value={actionNotes}
                                                    onChange={(e) => setActionNotes(e.target.value)}
                                                    placeholder="أضف ملاحظات للموافقة أو الرفض..."
                                                    rows="3"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => handleApprove(request._id)}
                                                    disabled={processingId === request._id || !actionNotes.trim()}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    <UserCheck className="w-4 h-4 ml-2" />
                                                    {processingId === request._id ? "جاري الموافقة..." : "موافقة"}
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    onClick={() => handleDeny(request._id)}
                                                    disabled={processingId === request._id || !actionNotes.trim()}
                                                >
                                                    <UserX className="w-4 h-4 ml-2" />
                                                    {processingId === request._id ? "جاري الرفض..." : "رفض"}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setSelectedRequest(null)
                                                        setActionNotes("")
                                                    }}
                                                >
                                                    إلغاء
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Delete button for processed requests */}
                                {request.status !== "pending" && (
                                    <div className="mt-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(request._id)}
                                            disabled={processingId === request._id}
                                        >
                                            <X className="w-4 h-4 ml-2" />
                                            حذف
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Pagination */}
            {pagination.total > 1 && (
                <div className="flex justify-center gap-2">
                    <Button
                        variant="outline"
                        disabled={pagination.current <= 1}
                        onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
                    >
                        السابق
                    </Button>
                    <span className="flex items-center px-4">
                        صفحة {pagination.current} من {pagination.total}
                    </span>
                    <Button
                        variant="outline"
                        disabled={pagination.current >= pagination.total}
                        onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
                    >
                        التالي
                    </Button>
                </div>
            )}
        </div>
    )
}

export default JoinRequestManagement
