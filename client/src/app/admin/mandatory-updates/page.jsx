'use client'
import { useState, useEffect, useCallback } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useError } from "@/context/ErrorContext"
import { mandatoryUpdatesAPI, customFieldsAPI, usersAPI } from "@/app/api/api"
import {
    ShieldAlert,
    Plus,
    Edit,
    Trash2,
    Loader2,
    Globe,
    Users,
    Mail,
    Check,
    Search,
} from "lucide-react"

const mandatoryUpdateSchema = z.object({
    fields: z.array(z.string()).min(1, "يجب اختيار حقل واحد على الأقل"),
    targetType: z.enum(["global", "targeted"]),
    targetUserIds: z.array(z.string()).optional(),
    adminMessage: z.string().min(5, "الرسالة يجب أن تكون 5 أحرف على الأقل").max(500),
    notifyByEmail: z.boolean().optional().default(false),
})

const MandatoryUpdatesManagement = () => {
    const [updates, setUpdates] = useState([])
    const [customFields, setCustomFields] = useState([])
    const [allUsers, setAllUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [editingUpdate, setEditingUpdate] = useState(null)
    const [userSearchTerm, setUserSearchTerm] = useState("")
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 })
    const { addError } = useError()

    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(mandatoryUpdateSchema),
        defaultValues: {
            fields: [],
            targetType: "global",
            targetUserIds: [],
            adminMessage: "",
            notifyByEmail: false,
        },
    })

    const targetType = watch("targetType")
    const selectedFields = watch("fields")
    const selectedUserIds = watch("targetUserIds")
    const notifyByEmail = watch("notifyByEmail")

    const fetchUpdates = useCallback(async () => {
        try {
            setIsLoading(true)
            const response = await mandatoryUpdatesAPI.getAll({
                page: pagination.page,
                limit: pagination.limit,
            })
            // Handle both response formats:
            // Backend may return data as flat array or as { updates, pagination }
            const resData = response.data
            if (Array.isArray(resData)) {
                setUpdates(resData)
                setPagination((prev) => ({
                    ...prev,
                    total: resData.length,
                }))
            } else {
                setUpdates(resData?.updates || [])
                setPagination((prev) => ({
                    ...prev,
                    total: resData?.pagination?.total || 0,
                }))
            }
        } catch (error) {
            console.error("Failed to fetch mandatory updates:", error)
            addError("فشل في جلب التحديثات الإلزامية")
        } finally {
            setIsLoading(false)
        }
    }, [pagination.page, pagination.limit, addError])

    const fetchCustomFields = useCallback(async () => {
        try {
            const response = await customFieldsAPI.getAll({ status: "active" })
            setCustomFields(response.data || [])
        } catch (error) {
            console.warn("Failed to fetch custom fields:", error)
        }
    }, [])

    const fetchUsers = useCallback(async () => {
        try {
            const response = await usersAPI.getAll({ limit: 1000 })
            setAllUsers(response.data?.users || [])
        } catch (error) {
            console.warn("Failed to fetch users:", error)
        }
    }, [])

    useEffect(() => {
        fetchUpdates()
        fetchCustomFields()
        fetchUsers()
    }, [fetchUpdates, fetchCustomFields, fetchUsers])

    const handleCreate = () => {
        setEditingUpdate(null)
        reset({
            fields: [],
            targetType: "global",
            targetUserIds: [],
            adminMessage: "",
            notifyByEmail: false,
        })
        setIsSheetOpen(true)
    }

    const handleEdit = (update) => {
        setEditingUpdate(update)
        reset({
            fields: update.fields?.map((f) => f._id || f) || [],
            targetType: update.targetType || "global",
            targetUserIds: update.targetUserIds?.map((u) => u._id || u) || [],
            adminMessage: update.adminMessage || "",
            notifyByEmail: false,
        })
        setIsSheetOpen(true)
    }

    const onSubmit = async (data) => {
        try {
            setIsLoading(true)

            // Clean up: remove targetUserIds if global
            const submitData = { ...data }
            if (submitData.targetType === "global") {
                delete submitData.targetUserIds
            }

            if (editingUpdate) {
                await mandatoryUpdatesAPI.update(editingUpdate._id, submitData)
                addError("تم تحديث التحديث الإلزامي بنجاح!", "success")
            } else {
                await mandatoryUpdatesAPI.create(submitData)
                addError(
                    data.notifyByEmail
                        ? "تم إنشاء التحديث الإلزامي وإرسال الإشعارات بنجاح!"
                        : "تم إنشاء التحديث الإلزامي بنجاح!",
                    "success"
                )
            }

            setIsSheetOpen(false)
            setEditingUpdate(null)
            reset()
            fetchUpdates()
        } catch (error) {
            addError(error.message || "فشل في حفظ التحديث الإلزامي")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (updateId) => {
        if (!confirm("هل أنت متأكد من حذف هذا التحديث الإلزامي؟")) return

        try {
            await mandatoryUpdatesAPI.delete(updateId)
            addError("تم حذف التحديث الإلزامي بنجاح!", "success")
            fetchUpdates()
        } catch (error) {
            console.error("Failed to delete mandatory update:", error)
            addError("فشل في حذف التحديث الإلزامي")
        }
    }

    const handleToggleActive = async (update) => {
        try {
            await mandatoryUpdatesAPI.update(update._id, { isActive: !update.isActive })
            addError(
                update.isActive ? "تم إيقاف التحديث الإلزامي" : "تم تفعيل التحديث الإلزامي",
                "success"
            )
            fetchUpdates()
        } catch (error) {
            addError("فشل في تحديث الحالة")
        }
    }

    const handleCloseSheet = () => {
        setIsSheetOpen(false)
        setEditingUpdate(null)
        reset()
    }

    const toggleFieldSelection = (fieldId) => {
        const current = selectedFields || []
        if (current.includes(fieldId)) {
            setValue(
                "fields",
                current.filter((id) => id !== fieldId),
                { shouldValidate: true }
            )
        } else {
            setValue("fields", [...current, fieldId], { shouldValidate: true })
        }
    }

    const toggleUserSelection = (userId) => {
        const current = selectedUserIds || []
        if (current.includes(userId)) {
            setValue(
                "targetUserIds",
                current.filter((id) => id !== userId),
                { shouldValidate: true }
            )
        } else {
            setValue("targetUserIds", [...current, userId], { shouldValidate: true })
        }
    }

    const filteredUsers = allUsers.filter(
        (user) =>
            user.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(userSearchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center flex-wrap gap-3">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">التحديثات الإلزامية</h1>
                    <p className="text-gray-600">إدارة قواعد تحديث الملف الشخصي الإلزامية</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    إنشاء تحديث جديد
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600">{updates.length}</p>
                        <p className="text-sm text-gray-500">إجمالي التحديثات</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-green-600">
                            {updates.filter((u) => u.isActive).length}
                        </p>
                        <p className="text-sm text-gray-500">تحديثات نشطة</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-purple-600">
                            {updates.filter((u) => u.targetType === "global").length}
                        </p>
                        <p className="text-sm text-gray-500">تحديثات شاملة</p>
                    </CardContent>
                </Card>
            </div>

            {/* Updates Table */}
            {isLoading && updates.length === 0 ? (
                <Card>
                    <CardContent className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </CardContent>
                </Card>
            ) : updates.length === 0 ? (
                <Card>
                    <CardContent className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <ShieldAlert className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                لا توجد تحديثات إلزامية
                            </h3>
                            <p className="text-gray-600">
                                ابدأ بإنشاء تحديث إلزامي لإجبار المستخدمين على إكمال ملفاتهم الشخصية
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>التحديثات الإلزامية ({pagination.total})</CardTitle>
                        <CardDescription>قواعد إكمال الملف الشخصي</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="pb-3 font-medium text-right px-4">الحقول</th>
                                        <th className="pb-3 font-medium text-right px-4">الهدف</th>
                                        <th className="pb-3 font-medium text-right px-4">الرسالة</th>
                                        <th className="pb-3 font-medium text-right px-4">الإكمال</th>
                                        <th className="pb-3 font-medium text-right px-4">الحالة</th>
                                        <th className="pb-3 font-medium text-right px-4">الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {updates.map((update) => (
                                        <tr key={update._id} className="border-b">
                                            <td className="py-4 px-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {update.fields?.map((field) => (
                                                        <Badge
                                                            key={field._id || field}
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {field.label || field}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    {update.targetType === "global" ? (
                                                        <>
                                                            <Globe className="h-4 w-4 text-blue-500" />
                                                            <span className="text-sm">الكل</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Users className="h-4 w-4 text-orange-500" />
                                                            <span className="text-sm">
                                                                {update.targetUserIds?.length || 0} مستخدم
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <p className="text-sm text-gray-700 max-w-[200px] truncate">
                                                    {update.adminMessage}
                                                </p>
                                            </td>
                                            <td className="py-4 px-4">
                                                <Badge className="bg-blue-100 text-blue-800">
                                                    <Check className="h-3 w-3 mr-1" />
                                                    {update.completedBy?.length || 0} أكملوا
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-4">
                                                <Switch
                                                    checked={update.isActive}
                                                    onCheckedChange={() => handleToggleActive(update)}
                                                />
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEdit(update)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDelete(update._id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Pagination */}
            {pagination.total > pagination.limit && (
                <div className="flex justify-center space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page === 1 || isLoading}
                    >
                        السابق
                    </Button>
                    <span className="flex items-center px-4">
                        صفحة {pagination.page} من {Math.ceil(pagination.total / pagination.limit)}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                        disabled={
                            pagination.page >= Math.ceil(pagination.total / pagination.limit) || isLoading
                        }
                    >
                        التالي
                    </Button>
                </div>
            )}

            {/* Create/Edit Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={(open) => { if (!open) handleCloseSheet(); else setIsSheetOpen(true); }}>
                <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>
                            {editingUpdate ? "تعديل التحديث الإلزامي" : "إنشاء تحديث إلزامي جديد"}
                        </SheetTitle>
                    </SheetHeader>
                    <form onSubmit={handleSubmit(onSubmit, (validationErrors) => { console.error('Form validation errors:', validationErrors); })} className="space-y-6 mt-6 px-4">
                        {/* Field Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                الحقول المطلوبة *
                            </label>
                            <div className="space-y-2 border rounded-lg p-3 max-h-[200px] overflow-y-auto">
                                {customFields.length === 0 ? (
                                    <p className="text-sm text-gray-500 text-center py-4">
                                        لا توجد حقول نشطة. أنشئ حقولاً أولاً.
                                    </p>
                                ) : (
                                    customFields.map((field) => (
                                        <label
                                            key={field._id}
                                            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                                                selectedFields?.includes(field._id)
                                                    ? "bg-blue-50 border border-blue-200"
                                                    : "hover:bg-gray-50 border border-transparent"
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedFields?.includes(field._id) || false}
                                                onChange={() => toggleFieldSelection(field._id)}
                                                className="h-4 w-4 text-blue-600 rounded"
                                            />
                                            <div className="flex-1">
                                                <span className="text-sm font-medium">{field.label}</span>
                                                <Badge variant="outline" className="ml-2 text-xs">
                                                    {field.type}
                                                </Badge>
                                            </div>
                                        </label>
                                    ))
                                )}
                            </div>
                            {errors.fields && (
                                <p className="text-red-500 text-sm mt-1">{errors.fields.message}</p>
                            )}
                        </div>

                        {/* Target Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                الهدف *
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <label
                                    className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                                        targetType === "global"
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        {...register("targetType")}
                                        value="global"
                                        className="h-4 w-4"
                                    />
                                    <Globe className="h-5 w-5 text-blue-500" />
                                    <span className="text-sm font-medium">كل المستخدمين</span>
                                </label>
                                <label
                                    className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                                        targetType === "targeted"
                                            ? "border-orange-500 bg-orange-50"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        {...register("targetType")}
                                        value="targeted"
                                        className="h-4 w-4"
                                    />
                                    <Users className="h-5 w-5 text-orange-500" />
                                    <span className="text-sm font-medium">مستخدمين محددين</span>
                                </label>
                            </div>
                        </div>

                        {/* User Selection (Targeted) */}
                        {targetType === "targeted" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    اختيار المستخدمين *
                                </label>
                                <div className="relative mb-2">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        type="text"
                                        placeholder="ابحث عن مستخدم..."
                                        value={userSearchTerm}
                                        onChange={(e) => setUserSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                {selectedUserIds?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-2">
                                        {selectedUserIds.map((uid) => {
                                            const user = allUsers.find((u) => u._id === uid)
                                            return (
                                                <Badge
                                                    key={uid}
                                                    variant="secondary"
                                                    className="cursor-pointer"
                                                    onClick={() => toggleUserSelection(uid)}
                                                >
                                                    {user?.name || uid} ✕
                                                </Badge>
                                            )
                                        })}
                                    </div>
                                )}
                                <div className="border rounded-lg max-h-[200px] overflow-y-auto">
                                    {filteredUsers.slice(0, 50).map((user) => (
                                        <label
                                            key={user._id}
                                            className={`flex items-center gap-3 p-2 cursor-pointer transition-colors border-b last:border-b-0 ${
                                                selectedUserIds?.includes(user._id)
                                                    ? "bg-orange-50"
                                                    : "hover:bg-gray-50"
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedUserIds?.includes(user._id) || false}
                                                onChange={() => toggleUserSelection(user._id)}
                                                className="h-4 w-4 text-orange-600 rounded"
                                            />
                                            <div>
                                                <span className="text-sm font-medium">{user.name}</span>
                                                <span className="text-xs text-gray-500 block">
                                                    {user.email}
                                                </span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {errors.targetUserIds && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.targetUserIds.message}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Admin Message */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                رسالة الإدارة *
                            </label>
                            <Textarea
                                {...register("adminMessage")}
                                placeholder="يرجى تحديث بياناتك الشخصية لإكمال ملفك..."
                                rows={4}
                            />
                            {errors.adminMessage && (
                                <p className="text-red-500 text-sm mt-1">{errors.adminMessage.message}</p>
                            )}
                        </div>

                        {/* Email Notification */}
                        {!editingUpdate && (
                            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-yellow-600" />
                                        <p className="text-sm font-medium text-yellow-800">
                                            إرسال إشعار بريد إلكتروني
                                        </p>
                                    </div>
                                    <p className="text-xs text-yellow-600 mt-1">
                                        إرسال بريد إلكتروني لجميع المستخدمين المستهدفين عند الحفظ
                                    </p>
                                </div>
                                <Switch
                                    checked={notifyByEmail}
                                    onCheckedChange={(checked) => setValue("notifyByEmail", checked, { shouldValidate: true })}
                                />
                            </div>
                        )}

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={handleCloseSheet}>
                                إلغاء
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        جاري الحفظ...
                                    </>
                                ) : editingUpdate ? (
                                    "تحديث"
                                ) : notifyByEmail ? (
                                    "حفظ وإرسال الإشعارات"
                                ) : (
                                    "حفظ التحديث الإلزامي"
                                )}
                            </Button>
                        </div>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default MandatoryUpdatesManagement
