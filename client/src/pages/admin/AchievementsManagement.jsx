import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { achievementsAPI } from "@/api"
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical } from "lucide-react"
import { toast } from "sonner"

const AchievementsManagement = () => {
    const [achievements, setAchievements] = useState([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingAchievement, setEditingAchievement] = useState(null)
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState("")
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        highlights: "",
        color: "text-egypt-gold",
        image: "",
        icon: "Award",
        order: 0,
        isActive: true,
    })

    const iconOptions = ["Globe", "Crown", "BookOpen", "Users", "Award", "Heart", "Shield"]
    const colorOptions = ["text-egypt-gold", "text-egypt-red", "text-blue-600", "text-green-600", "text-purple-600"]

    useEffect(() => {
        fetchAchievements()
    }, [])

    const fetchAchievements = async () => {
        try {
            setLoading(true)
            const response = await achievementsAPI.getAll()
            setAchievements(response.data)
        } catch (error) {
            console.error("Error fetching achievements:", error)
            toast.error("فشل في تحميل الإنجازات")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const data = new FormData()
            data.append("title", formData.title)
            data.append("description", formData.description)
            data.append("highlights", JSON.stringify(formData.highlights.split("\n").filter((h) => h.trim())))
            data.append("color", formData.color)
            data.append("icon", formData.icon)
            data.append("order", formData.order)
            data.append("isActive", formData.isActive)

            // Add image file if selected, otherwise add URL if provided
            if (imageFile) {
                data.append("image", imageFile)
            } else if (formData.image && formData.image.trim() !== "") {
                data.append("image", formData.image.trim())
            }
            // Don't send image field if both are empty

            if (editingAchievement) {
                await achievementsAPI.update(editingAchievement._id, data)
                toast.success("تم تحديث الإنجاز بنجاح")
            } else {
                await achievementsAPI.create(data)
                toast.success("تم إضافة الإنجاز بنجاح")
            }

            setDialogOpen(false)
            resetForm()
            fetchAchievements()
        } catch (error) {
            console.error("Error saving achievement:", error)
            toast.error(editingAchievement ? "فشل في تحديث الإنجاز" : "فشل في إضافة الإنجاز")
        }
    }

    const handleEdit = (achievement) => {
        setEditingAchievement(achievement)
        setFormData({
            title: achievement.title,
            description: achievement.description,
            highlights: achievement.highlights.join("\n"),
            color: achievement.color,
            image: achievement.image || "",
            icon: achievement.icon,
            order: achievement.order,
            isActive: achievement.isActive,
        })
        setImagePreview(achievement.image || "")
        setImageFile(null)
        setDialogOpen(true)
    }

    const handleDelete = async (id) => {
        if (!confirm("هل أنت متأكد من حذف هذا الإنجاز؟")) return

        try {
            await achievementsAPI.delete(id)
            toast.success("تم حذف الإنجاز بنجاح")
            fetchAchievements()
        } catch (error) {
            console.error("Error deleting achievement:", error)
            toast.error("فشل في حذف الإنجاز")
        }
    }

    const handleToggleStatus = async (id) => {
        try {
            await achievementsAPI.toggleStatus(id)
            toast.success("تم تغيير حالة الإنجاز بنجاح")
            fetchAchievements()
        } catch (error) {
            console.error("Error toggling achievement status:", error)
            toast.error("فشل في تغيير حالة الإنجاز")
        }
    }

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            highlights: "",
            color: "text-egypt-gold",
            image: "",
            icon: "Award",
            order: 0,
            isActive: true,
        })
        setEditingAchievement(null)
        setImageFile(null)
        setImagePreview("")
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleDialogClose = () => {
        setDialogOpen(false)
        resetForm()
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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold font-arabic">إدارة الإنجازات والمشروعات</h1>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-egypt-gold hover:bg-egypt-gold/90">
                            <Plus className="w-4 h-4 mr-2" />
                            إضافة إنجاز جديد
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="font-arabic">{editingAchievement ? "تعديل الإنجاز" : "إضافة إنجاز جديد"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="title" className="font-arabic">
                                    العنوان
                                </Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    className="text-right font-arabic"
                                />
                            </div>

                            <div>
                                <Label htmlFor="description" className="font-arabic">
                                    الوصف
                                </Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    rows={4}
                                    className="text-right font-arabic"
                                />
                            </div>

                            <div>
                                <Label htmlFor="highlights" className="font-arabic">
                                    المحاور (كل محور في سطر)
                                </Label>
                                <Textarea
                                    id="highlights"
                                    value={formData.highlights}
                                    onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                                    rows={4}
                                    className="text-right font-arabic"
                                    placeholder="المحور الأول&#10;المحور الثاني&#10;المحور الثالث"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="icon" className="font-arabic">
                                        الأيقونة
                                    </Label>
                                    <select
                                        id="icon"
                                        value={formData.icon}
                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                        className="w-full border border-input bg-background px-3 py-2 rounded-md"
                                    >
                                        {iconOptions.map((icon) => (
                                            <option key={icon} value={icon}>
                                                {icon}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <Label htmlFor="color" className="font-arabic">
                                        اللون
                                    </Label>
                                    <select
                                        id="color"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="w-full border border-input bg-background px-3 py-2 rounded-md"
                                    >
                                        {colorOptions.map((color) => (
                                            <option key={color} value={color}>
                                                {color}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="imageFile" className="font-arabic">
                                    تحميل صورة
                                </Label>
                                <Input id="imageFile" type="file" accept="image/*" onChange={handleImageChange} className="cursor-pointer" />
                                {imagePreview && (
                                    <div className="mt-2">
                                        <img
                                            src={
                                                imagePreview.startsWith("/")
                                                    ? `https://form.codepeak.software${imagePreview}`
                                                    : imagePreview
                                            }
                                            alt="Preview"
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* <div>
                                <Label htmlFor="image" className="font-arabic">
                                    أو أدخل رابط الصورة
                                </Label>
                                <Input
                                    id="image"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                    disabled={!!imageFile}
                                />
                            </div> */}

                            <div>
                                <Label htmlFor="order" className="font-arabic">
                                    الترتيب
                                </Label>
                                <Input
                                    id="order"
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <Label htmlFor="isActive" className="font-arabic cursor-pointer">
                                    نشط
                                </Label>
                            </div>

                            <div className="flex gap-2 justify-end">
                                <Button type="button" variant="outline" onClick={handleDialogClose}>
                                    إلغاء
                                </Button>
                                <Button type="submit" className="bg-egypt-gold hover:bg-egypt-gold/90">
                                    {editingAchievement ? "تحديث" : "إضافة"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Alert className="mb-6">
                <AlertDescription className="font-arabic">
                    إجمالي الإنجازات: {achievements.length} | النشطة: {achievements.filter((a) => a.isActive).length}
                </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement) => (
                    <Card key={achievement._id} className={`${!achievement.isActive ? "opacity-50" : ""}`}>
                        <CardHeader>
                            <CardTitle className="font-arabic text-right flex items-start justify-between">
                                <span className="flex-1">{achievement.title}</span>
                                <div className="flex gap-1">
                                    {achievement.isActive ? <Eye className="w-5 h-5 text-green-600" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4 font-arabic text-right line-clamp-3">{achievement.description}</p>

                            <div className="mb-4">
                                <p className="text-xs text-muted-foreground mb-2 font-arabic">المحاور:</p>
                                <ul className="text-xs space-y-1">
                                    {achievement.highlights.slice(0, 2).map((highlight, idx) => (
                                        <li key={idx} className="font-arabic text-right">
                                            • {highlight}
                                        </li>
                                    ))}
                                    {achievement.highlights.length > 2 && (
                                        <li className="text-muted-foreground font-arabic">+{achievement.highlights.length - 2} المزيد</li>
                                    )}
                                </ul>
                            </div>

                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                                <span>الترتيب: {achievement.order}</span>
                                <span>{achievement.icon}</span>
                            </div>

                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleEdit(achievement)} className="flex-1">
                                    <Edit className="w-4 h-4 mr-1" />
                                    تعديل
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleToggleStatus(achievement._id)} className="flex-1">
                                    {achievement.isActive ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                                    {achievement.isActive ? "إخفاء" : "إظهار"}
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDelete(achievement._id)} className="px-3">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {achievements.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground font-arabic">لا توجد إنجازات حالياً</p>
                </div>
            )}
        </div>
    )
}

export default AchievementsManagement
