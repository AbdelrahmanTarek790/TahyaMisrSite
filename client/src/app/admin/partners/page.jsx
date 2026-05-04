"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { partnersAPI } from "@/app/api/api"
import { Plus, Edit, Trash2, Eye, EyeOff, ExternalLink, Filter } from "lucide-react"
import { toast } from "sonner"

const BASE_URL = "https://tmbackend.tahyamisryu.com"

const CATEGORY_LABELS = {
    strategic: "شريك استراتيجي",
    sponsor: "راعي",
}

const PartnersManagement = () => {
    const [partners, setPartners] = useState([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingPartner, setEditingPartner] = useState(null)
    const [filterCategory, setFilterCategory] = useState("all")

    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState("")

    const [formData, setFormData] = useState({
        name: "",
        category: "sponsor",
        websiteUrl: "",
        isActive: true,
    })

    useEffect(() => {
        fetchPartners()
    }, [])

    const fetchPartners = async () => {
        try {
            setLoading(true)
            const response = await partnersAPI.getAll()
            setPartners(response.data)
        } catch (error) {
            console.error("Error fetching partners:", error)
            toast.error("فشل في تحميل الشركاء")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!imageFile && !editingPartner) {
            toast.error("يرجى رفع شعار الشريك")
            return
        }

        try {
            const data = new FormData()
            data.append("name", formData.name)
            data.append("category", formData.category)
            data.append("websiteUrl", formData.websiteUrl)
            data.append("isActive", formData.isActive)
            if (imageFile) data.append("logo", imageFile)

            if (editingPartner) {
                await partnersAPI.update(editingPartner._id, data)
                toast.success("تم تحديث الشريك بنجاح")
            } else {
                await partnersAPI.create(data)
                toast.success("تم إضافة الشريك بنجاح")
            }

            setDialogOpen(false)
            resetForm()
            fetchPartners()
        } catch (error) {
            console.error("Error saving partner:", error)
            toast.error(editingPartner ? "فشل في تحديث الشريك" : "فشل في إضافة الشريك")
        }
    }

    const handleEdit = (partner) => {
        setEditingPartner(partner)
        setFormData({
            name: partner.name,
            category: partner.category,
            websiteUrl: partner.websiteUrl || "",
            isActive: partner.isActive,
        })
        setImagePreview(partner.logo ? (partner.logo.startsWith("/") ? `${BASE_URL}${partner.logo}` : partner.logo) : "")
        setImageFile(null)
        setDialogOpen(true)
    }

    const handleDelete = async (id) => {
        if (!confirm("هل أنت متأكد من حذف هذا الشريك؟")) return
        try {
            await partnersAPI.delete(id)
            toast.success("تم حذف الشريك بنجاح")
            fetchPartners()
        } catch (error) {
            console.error("Error deleting partner:", error)
            toast.error("فشل في حذف الشريك")
        }
    }

    const handleToggleStatus = async (partner) => {
        try {
            const data = new FormData()
            data.append("isActive", !partner.isActive)
            await partnersAPI.update(partner._id, data)
            toast.success("تم تغيير حالة الشريك بنجاح")
            fetchPartners()
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
        setFormData({ name: "", category: "sponsor", websiteUrl: "", isActive: true })
        setEditingPartner(null)
        setImageFile(null)
        setImagePreview("")
    }

    const handleDialogClose = () => {
        setDialogOpen(false)
        resetForm()
    }

    const filteredPartners = filterCategory === "all"
        ? partners
        : partners.filter((p) => p.category === filterCategory)

    const getLogoSrc = (logo) => {
        if (!logo) return null
        return logo.startsWith("/") ? `${BASE_URL}${logo}` : logo
    }

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
                <h1 className="text-3xl font-bold font-arabic">إدارة الشركاء</h1>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-egypt-gold hover:bg-egypt-gold/90" onClick={resetForm}>
                            <Plus className="w-4 h-4 mr-2" />
                            إضافة شريك جديد
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="font-arabic">
                                {editingPartner ? "تعديل الشريك" : "إضافة شريك جديد"}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name" className="font-arabic">اسم الشريك</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="text-right font-arabic"
                                />
                            </div>

                            <div>
                                <Label htmlFor="category" className="font-arabic">الفئة</Label>
                                <select
                                    id="category"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full border border-input bg-background px-3 py-2 rounded-md text-right font-arabic"
                                >
                                    <option value="sponsor">راعي</option>
                                    <option value="strategic">شريك استراتيجي</option>
                                </select>
                            </div>

                            <div>
                                <Label htmlFor="websiteUrl" className="font-arabic">رابط الموقع (اختياري)</Label>
                                <Input
                                    id="websiteUrl"
                                    value={formData.websiteUrl}
                                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                                    placeholder="https://example.com"
                                    className="text-left"
                                    dir="ltr"
                                />
                            </div>

                            <div>
                                <Label htmlFor="logoFile" className="font-arabic">شعار الشريك {!editingPartner && <span className="text-egypt-red">*</span>}</Label>
                                <Input
                                    id="logoFile"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="cursor-pointer"
                                />
                                {imagePreview && (
                                    <div className="mt-2 flex justify-center p-3 bg-muted rounded-lg">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-20 object-contain"
                                        />
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
                                    {editingPartner ? "تحديث" : "إضافة"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats + Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Alert className="flex-1">
                    <AlertDescription className="font-arabic">
                        الإجمالي: {partners.length} | النشطون: {partners.filter((p) => p.isActive).length} |
                        استراتيجيون: {partners.filter((p) => p.category === "strategic").length} |
                        رعاة: {partners.filter((p) => p.category === "sponsor").length}
                    </AlertDescription>
                </Alert>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="border border-input bg-background px-3 py-2 rounded-md text-sm font-arabic"
                    >
                        <option value="all">الكل</option>
                        <option value="strategic">شركاء استراتيجيون</option>
                        <option value="sponsor">رعاة</option>
                    </select>
                </div>
            </div>

            {/* Partners Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPartners.map((partner) => (
                    <Card key={partner._id} className={`${!partner.isActive ? "opacity-50" : ""}`}>
                        <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                                <Badge variant={partner.category === "strategic" ? "default" : "secondary"} className="text-xs font-arabic">
                                    {CATEGORY_LABELS[partner.category]}
                                </Badge>
                                {partner.isActive ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Logo */}
                            <div className="flex justify-center items-center h-24 bg-muted rounded-lg mb-3 p-2">
                                {partner.logo ? (
                                    <img
                                        src={getLogoSrc(partner.logo)}
                                        alt={partner.name}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                ) : (
                                    <span className="text-muted-foreground text-sm font-arabic">لا يوجد شعار</span>
                                )}
                            </div>

                            <CardTitle className="font-arabic text-center text-base mb-1">{partner.name}</CardTitle>

                            {partner.websiteUrl && (
                                <a
                                    href={partner.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-primary mb-3 transition-colors"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                    <span dir="ltr" className="truncate max-w-32">{partner.websiteUrl.replace(/^https?:\/\//, "")}</span>
                                </a>
                            )}

                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleEdit(partner)} className="flex-1">
                                    <Edit className="w-4 h-4 mr-1" />
                                    تعديل
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleToggleStatus(partner)} className="flex-1">
                                    {partner.isActive ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                                    {partner.isActive ? "إخفاء" : "إظهار"}
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDelete(partner._id)} className="px-3">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredPartners.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground font-arabic">
                        {filterCategory === "all" ? "لا يوجد شركاء حالياً" : `لا يوجد ${CATEGORY_LABELS[filterCategory]} حالياً`}
                    </p>
                </div>
            )}
        </div>
    )
}

export default PartnersManagement
