"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { privilegesAPI } from "@/app/api/api"
import { Plus, Edit, Trash2, Eye, EyeOff, Phone, MapPin, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

const BASE_URL = "https://tmbackend.tahyamisryu.com"

const TYPE_LABELS = {
    partner: "شريك",
    union: "اتحاد",
}

const TYPE_COLORS = {
    partner: "default",
    union: "secondary",
}

const PrivilegesManagement = () => {
    const [privileges, setPrivileges] = useState([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingPrivilege, setEditingPrivilege] = useState(null)
    const [activeTab, setActiveTab] = useState("all")

    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState("")

    const [formData, setFormData] = useState({
        partnerName: "",
        description: "",
        privilegesList: "",   // newline-separated for textarea
        contactInfo: "",
        address: "",
        type: "partner",
        isActive: true,
    })

    useEffect(() => {
        fetchPrivileges()
    }, [])

    const fetchPrivileges = async () => {
        try {
            setLoading(true)
            const response = await privilegesAPI.getAll()
            setPrivileges(response.data)
        } catch (error) {
            console.error("Error fetching privileges:", error)
            toast.error("فشل في تحميل الامتيازات")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const data = new FormData()
            data.append("partnerName", formData.partnerName)
            data.append("description", formData.description)
            data.append("privileges", JSON.stringify(
                formData.privilegesList.split("\n").map((p) => p.trim()).filter(Boolean)
            ))
            data.append("contactInfo", formData.contactInfo)
            data.append("address", formData.address)
            data.append("type", formData.type)
            data.append("isActive", formData.isActive)
            if (imageFile) data.append("logo", imageFile)

            if (editingPrivilege) {
                await privilegesAPI.update(editingPrivilege._id, data)
                toast.success("تم تحديث الامتياز بنجاح")
            } else {
                await privilegesAPI.create(data)
                toast.success("تم إضافة الامتياز بنجاح")
            }

            setDialogOpen(false)
            resetForm()
            fetchPrivileges()
        } catch (error) {
            console.error("Error saving privilege:", error)
            toast.error(editingPrivilege ? "فشل في تحديث الامتياز" : "فشل في إضافة الامتياز")
        }
    }

    const handleEdit = (privilege) => {
        setEditingPrivilege(privilege)
        setFormData({
            partnerName: privilege.partnerName,
            description: privilege.description || "",
            privilegesList: (privilege.privileges || []).join("\n"),
            contactInfo: privilege.contactInfo || "",
            address: privilege.address || "",
            type: privilege.type,
            isActive: privilege.isActive,
        })
        setImagePreview(privilege.logo ? (privilege.logo.startsWith("/") ? `${BASE_URL}${privilege.logo}` : privilege.logo) : "")
        setImageFile(null)
        setDialogOpen(true)
    }

    const handleDelete = async (id) => {
        if (!confirm("هل أنت متأكد من حذف هذا الامتياز؟")) return
        try {
            await privilegesAPI.delete(id)
            toast.success("تم حذف الامتياز بنجاح")
            fetchPrivileges()
        } catch (error) {
            console.error("Error deleting privilege:", error)
            toast.error("فشل في حذف الامتياز")
        }
    }

    const handleToggleStatus = async (privilege) => {
        try {
            const data = new FormData()
            data.append("isActive", !privilege.isActive)
            await privilegesAPI.update(privilege._id, data)
            toast.success("تم تغيير حالة الامتياز بنجاح")
            fetchPrivileges()
        } catch (error) {
            toast.error("فشل في تغيير الحالة")
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => setImagePreview(reader.result)
            reader.readAsDataURL(file)
        }
    }

    const resetForm = () => {
        setFormData({
            partnerName: "",
            description: "",
            privilegesList: "",
            contactInfo: "",
            address: "",
            type: "partner",
            isActive: true,
        })
        setEditingPrivilege(null)
        setImageFile(null)
        setImagePreview("")
    }

    const handleDialogClose = () => {
        setDialogOpen(false)
        resetForm()
    }

    const filteredPrivileges = activeTab === "all"
        ? privileges
        : privileges.filter((p) => p.type === activeTab)

    const getLogoSrc = (logo) => {
        if (!logo) return null
        return logo.startsWith("/") ? `${BASE_URL}${logo}` : logo
    }

    const tabs = [
        { key: "all", label: "الكل", count: privileges.length },
        { key: "partner", label: "شركاء", count: privileges.filter((p) => p.type === "partner").length },
        { key: "union", label: "اتحادات", count: privileges.filter((p) => p.type === "union").length },
    ]

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-egypt-gold mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">جاري التحميل...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold font-arabic">إدارة الامتيازات</h1>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-egypt-gold hover:bg-egypt-gold/90" onClick={resetForm}>
                            <Plus className="w-4 h-4 mr-2" />
                            إضافة امتياز جديد
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="font-arabic">
                                {editingPrivilege ? "تعديل الامتياز" : "إضافة امتياز جديد"}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="partnerName" className="font-arabic">اسم الجهة</Label>
                                    <Input
                                        id="partnerName"
                                        value={formData.partnerName}
                                        onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                                        required
                                        className="text-right font-arabic"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="type" className="font-arabic">النوع</Label>
                                    <select
                                        id="type"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full border border-input bg-background px-3 py-2 rounded-md text-right font-arabic"
                                    >
                                        <option value="partner">شريك</option>
                                        <option value="union">اتحاد</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description" className="font-arabic">الوصف</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={2}
                                    className="text-right font-arabic"
                                />
                            </div>

                            <div>
                                <Label htmlFor="privilegesList" className="font-arabic">
                                    الامتيازات المقدمة (كل امتياز في سطر)
                                </Label>
                                <Textarea
                                    id="privilegesList"
                                    value={formData.privilegesList}
                                    onChange={(e) => setFormData({ ...formData, privilegesList: e.target.value })}
                                    rows={4}
                                    className="text-right font-arabic"
                                    placeholder={"خصم 20% على المشتريات\nدخول مجاني للفعاليات\nعضوية مجانية"}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="contactInfo" className="font-arabic">معلومات التواصل</Label>
                                    <Input
                                        id="contactInfo"
                                        value={formData.contactInfo}
                                        onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                                        placeholder="رقم الهاتف / الإيميل"
                                        className="text-right font-arabic"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="address" className="font-arabic">العنوان</Label>
                                    <Input
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="text-right font-arabic"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="logoFile" className="font-arabic">الشعار (اختياري)</Label>
                                <Input
                                    id="logoFile"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="cursor-pointer"
                                />
                                {imagePreview && (
                                    <div className="mt-2 flex justify-center p-3 bg-muted rounded-lg">
                                        <img src={imagePreview} alt="Preview" className="h-16 object-contain" />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <Label htmlFor="isActive" className="font-arabic cursor-pointer">نشط</Label>
                            </div>

                            <div className="flex gap-2 justify-end">
                                <Button type="button" variant="outline" onClick={handleDialogClose}>إلغاء</Button>
                                <Button type="submit" className="bg-egypt-gold hover:bg-egypt-gold/90">
                                    {editingPrivilege ? "تحديث" : "إضافة"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <Alert className="mb-4">
                <AlertDescription className="font-arabic">
                    الإجمالي: {privileges.length} | النشطة: {privileges.filter((p) => p.isActive).length} |
                    شركاء: {privileges.filter((p) => p.type === "partner").length} |
                    اتحادات: {privileges.filter((p) => p.type === "union").length}
                </AlertDescription>
            </Alert>

            {/* Tabs Filter */}
            <div className="flex gap-2 mb-6 border-b">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 text-sm font-arabic font-medium transition-colors border-b-2 -mb-px ${
                            activeTab === tab.key
                                ? "border-egypt-gold text-egypt-gold"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        {tab.label}
                        <Badge variant="outline" className="mr-2 text-xs">{tab.count}</Badge>
                    </button>
                ))}
            </div>

            {/* Privileges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrivileges.map((privilege) => (
                    <Card key={privilege._id} className={`${!privilege.isActive ? "opacity-50" : ""}`}>
                        <CardHeader className="pb-2">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    {privilege.logo && (
                                        <img
                                            src={getLogoSrc(privilege.logo)}
                                            alt={privilege.partnerName}
                                            className="h-8 w-8 object-contain rounded"
                                        />
                                    )}
                                    <div>
                                        <CardTitle className="font-arabic text-base">{privilege.partnerName}</CardTitle>
                                        <Badge variant={TYPE_COLORS[privilege.type]} className="text-xs font-arabic mt-1">
                                            {TYPE_LABELS[privilege.type]}
                                        </Badge>
                                    </div>
                                </div>
                                {privilege.isActive ? <Eye className="w-4 h-4 text-green-600 shrink-0" /> : <EyeOff className="w-4 h-4 text-gray-400 shrink-0" />}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {privilege.description && (
                                <p className="text-sm text-muted-foreground mb-3 font-arabic text-right line-clamp-2">
                                    {privilege.description}
                                </p>
                            )}

                            {/* Privileges List */}
                            {privilege.privileges?.length > 0 && (
                                <div className="mb-3">
                                    <p className="text-xs font-medium text-muted-foreground font-arabic mb-1">الامتيازات:</p>
                                    <ul className="space-y-1">
                                        {privilege.privileges.slice(0, 3).map((p, i) => (
                                            <li key={i} className="flex items-center gap-2 text-xs font-arabic">
                                                <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />
                                                {p}
                                            </li>
                                        ))}
                                        {privilege.privileges.length > 3 && (
                                            <li className="text-xs text-muted-foreground font-arabic">
                                                +{privilege.privileges.length - 3} امتيازات أخرى
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )}

                            {/* Contact & Address */}
                            <div className="space-y-1 mb-4">
                                {privilege.contactInfo && (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Phone className="w-3 h-3 shrink-0" />
                                        <span className="font-arabic">{privilege.contactInfo}</span>
                                    </div>
                                )}
                                {privilege.address && (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <MapPin className="w-3 h-3 shrink-0" />
                                        <span className="font-arabic">{privilege.address}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleEdit(privilege)} className="flex-1">
                                    <Edit className="w-4 h-4 mr-1" />
                                    تعديل
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleToggleStatus(privilege)} className="flex-1">
                                    {privilege.isActive ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                                    {privilege.isActive ? "إخفاء" : "إظهار"}
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDelete(privilege._id)} className="px-3">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredPrivileges.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground font-arabic">لا توجد امتيازات حالياً</p>
                </div>
            )}
        </div>
    )
}

export default PrivilegesManagement
