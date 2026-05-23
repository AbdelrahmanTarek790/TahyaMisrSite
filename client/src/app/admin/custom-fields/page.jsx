'use client'
import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useError } from "@/context/ErrorContext"
import { customFieldsAPI } from "@/app/api/api"
import {
    FormInput,
    Plus,
    Edit,
    Trash2,
    Loader2,
    Type,
    AlignLeft,
    Hash,
    Mail,
    Phone,
    Eye,
    EyeOff,
    GripVertical,
    CircleDot,
    CheckSquare,
} from "lucide-react"

const fieldTypeLabels = {
    text: "نص قصير",
    textarea: "نص طويل",
    number: "رقم",
    email: "بريد إلكتروني",
    phone: "رقم هاتف",
    radio: "تحديد مفرد (Radio)",
    checkbox_list: "تحديد متعدد (Checkbox List)",
}

const fieldTypeIcons = {
    text: Type,
    textarea: AlignLeft,
    number: Hash,
    email: Mail,
    phone: Phone,
    radio: CircleDot,
    checkbox_list: CheckSquare,
}

const customFieldSchema = z.object({
    label: z.string().min(2, "اسم الحقل يجب أن يكون حرفين على الأقل").max(100),
    type: z.enum(["text", "textarea", "number", "email", "phone", "radio", "checkbox_list"]),
    isPublic: z.boolean().optional().default(false),
    status: z.enum(["active", "inactive"]).optional().default("active"),
    order: z.preprocess((val) => Number(val) || 0, z.number().min(0)).optional(),
    options: z.array(z.string()).optional(),
}).refine((data) => {
    if ((data.type === "radio" || data.type === "checkbox_list") && (!data.options || data.options.length === 0)) {
        return false
    }
    return true
}, {
    message: "يجب إضافة خيار واحد على الأقل لهذا النوع من الحقول",
    path: ["options"],
})

const CustomFieldsManagement = () => {
    const [fields, setFields] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [editingField, setEditingField] = useState(null)
    const [options, setOptions] = useState([])
    const [newOption, setNewOption] = useState("")
    const { addError } = useError()

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(customFieldSchema),
        defaultValues: {
            label: "",
            type: "text",
            isPublic: false,
            status: "active",
            order: 0,
            options: [],
        },
    })

    const isPublicValue = watch("isPublic")
    const selectedType = watch("type")

    const addOption = () => {
        const trimmed = newOption.trim()
        if (trimmed && !options.includes(trimmed)) {
            const updated = [...options, trimmed]
            setOptions(updated)
            setValue("options", updated)
            setNewOption("")
        }
    }

    const removeOption = (indexToRemove) => {
        const updated = options.filter((_, idx) => idx !== indexToRemove)
        setOptions(updated)
        setValue("options", updated)
    }

    const fetchFields = useCallback(async () => {
        try {
            setIsLoading(true)
            const response = await customFieldsAPI.getAll()
            setFields(response.data || [])
        } catch (error) {
            console.error("Failed to fetch custom fields:", error)
            addError("فشل في جلب الحقول")
        } finally {
            setIsLoading(false)
        }
    }, [addError])

    useEffect(() => {
        fetchFields()
    }, [fetchFields])

    const handleEdit = (field) => {
        setOptions(field.options || [])
        setEditingField(field)
        reset({
            label: field.label,
            type: field.type,
            isPublic: field.isPublic || false,
            status: field.status || "active",
            order: field.order || 0,
            options: field.options || [],
        })
        setIsSheetOpen(true)
    }

    const handleCreate = () => {
        setOptions([])
        setEditingField(null)
        reset({
            label: "",
            type: "text",
            isPublic: false,
            status: "active",
            order: 0,
            options: [],
        })
        setIsSheetOpen(true)
    }

    const onSubmit = async (data) => {
        try {
            setIsLoading(true)

            if (editingField) {
                await customFieldsAPI.update(editingField._id, data)
                addError("تم تحديث الحقل بنجاح!", "success")
            } else {
                await customFieldsAPI.create(data)
                addError("تم إنشاء الحقل بنجاح!", "success")
            }

            setIsSheetOpen(false)
            setEditingField(null)
            reset()
            fetchFields()
        } catch (error) {
            addError(error.message || "فشل في حفظ الحقل")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (fieldId) => {
        if (!confirm("هل أنت متأكد من حذف هذا الحقل؟")) return

        try {
            await customFieldsAPI.delete(fieldId)
            addError("تم حذف الحقل بنجاح!", "success")
            fetchFields()
        } catch (error) {
            console.error("Failed to delete field:", error)
            addError("فشل في حذف الحقل")
        }
    }

    const handleCloseSheet = () => {
        setIsSheetOpen(false)
        setEditingField(null)
        reset()
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center flex-wrap gap-3">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">الحقول الديناميكية</h1>
                    <p className="text-gray-600">إدارة حقول الملف الشخصي المخصصة</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة حقل جديد
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600">{fields.length}</p>
                        <p className="text-sm text-gray-500">إجمالي الحقول</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-green-600">
                            {fields.filter((f) => f.status === "active").length}
                        </p>
                        <p className="text-sm text-gray-500">حقول نشطة</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-purple-600">
                            {fields.filter((f) => f.isPublic).length}
                        </p>
                        <p className="text-sm text-gray-500">حقول عامة</p>
                    </CardContent>
                </Card>
            </div>

            {/* Fields Table */}
            {isLoading && fields.length === 0 ? (
                <Card>
                    <CardContent className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </CardContent>
                </Card>
            ) : fields.length === 0 ? (
                <Card>
                    <CardContent className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <FormInput className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد حقول مخصصة</h3>
                            <p className="text-gray-600">ابدأ بإضافة حقول جديدة للملف الشخصي</p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>الحقول المخصصة ({fields.length})</CardTitle>
                        <CardDescription>حقول الملف الشخصي الديناميكية</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="pb-3 font-medium text-right px-4">الترتيب</th>
                                        <th className="pb-3 font-medium text-right px-4">اسم الحقل</th>
                                        <th className="pb-3 font-medium text-right px-4">النوع</th>
                                        <th className="pb-3 font-medium text-right px-4">عام</th>
                                        <th className="pb-3 font-medium text-right px-4">الحالة</th>
                                        <th className="pb-3 font-medium text-right px-4">الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fields.map((field) => {
                                        const TypeIcon = fieldTypeIcons[field.type] || Type
                                        return (
                                            <tr key={field._id} className="border-b">
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <GripVertical className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm font-mono">{field.order}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="font-medium">{field.label}</div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <TypeIcon className="h-4 w-4 text-blue-500" />
                                                        <Badge variant="outline">{fieldTypeLabels[field.type]}</Badge>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    {field.isPublic ? (
                                                        <div className="flex items-center gap-1 text-green-600">
                                                            <Eye className="h-4 w-4" />
                                                            <span className="text-sm">عام</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1 text-gray-400">
                                                            <EyeOff className="h-4 w-4" />
                                                            <span className="text-sm">خاص</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <Badge
                                                        className={
                                                            field.status === "active"
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-gray-100 text-gray-800"
                                                        }
                                                    >
                                                        {field.status === "active" ? "نشط" : "غير نشط"}
                                                    </Badge>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEdit(field)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDelete(field._id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Create/Edit Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="w-[500px] sm:max-w-[500px]">
                    <SheetHeader>
                        <SheetTitle>{editingField ? "تعديل الحقل" : "إضافة حقل جديد"}</SheetTitle>
                    </SheetHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6 px-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                اسم الحقل *
                            </label>
                            <Input {...register("label")} placeholder="مثال: السيرة الذاتية، رابط LinkedIn" />
                            {errors.label && (
                                <p className="text-red-500 text-sm mt-1">{errors.label.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                نوع الحقل *
                            </label>
                             <select
                                {...register("type")}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="text">نص قصير (Text)</option>
                                <option value="textarea">نص طويل (Description)</option>
                                <option value="number">رقم (Number)</option>
                                <option value="email">بريد إلكتروني (Email)</option>
                                <option value="phone">رقم هاتف (Phone)</option>
                                <option value="radio">تحديد مفرد (Radio)</option>
                                <option value="checkbox_list">تحديد متعدد (Checkbox List)</option>
                            </select>
                            {errors.type && (
                                <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
                            )}
                        </div>

                        {(selectedType === "radio" || selectedType === "checkbox_list") && (
                            <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
                                <label className="block text-sm font-medium text-gray-700">
                                    خيارات الحقل *
                                </label>
                                <div className="flex gap-2">
                                    <Input
                                        value={newOption}
                                        onChange={(e) => setNewOption(e.target.value)}
                                        placeholder="أدخل خياراً جديداً"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault()
                                                addOption()
                                            }
                                        }}
                                    />
                                    <Button type="button" onClick={addOption}>
                                        إضافة
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {options.map((opt, idx) => (
                                        <Badge key={idx} variant="secondary" className="flex items-center gap-1 py-1 px-2">
                                            {opt}
                                            <button
                                                type="button"
                                                onClick={() => removeOption(idx)}
                                                className="text-gray-500 hover:text-red-500 font-bold"
                                            >
                                                ×
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                                {errors.options && (
                                    <p className="text-red-500 text-sm mt-1">{errors.options.message}</p>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                الترتيب
                            </label>
                            <Input
                                {...register("order")}
                                type="number"
                                min="0"
                                placeholder="0"
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                            <div>
                                <p className="text-sm font-medium text-gray-700">عرض في الملف العام</p>
                                <p className="text-xs text-gray-500">
                                    إظهار هذا الحقل في لوحة الشرف والملف الشخصي العام
                                </p>
                            </div>
                            <Switch
                                checked={isPublicValue}
                                onCheckedChange={(checked) => setValue("isPublic", checked)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                الحالة
                            </label>
                            <select
                                {...register("status")}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="active">نشط</option>
                                <option value="inactive">غير نشط</option>
                            </select>
                        </div>

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
                                ) : editingField ? (
                                    "تحديث الحقل"
                                ) : (
                                    "إنشاء الحقل"
                                )}
                            </Button>
                        </div>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default CustomFieldsManagement
