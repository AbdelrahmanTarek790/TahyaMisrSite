import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { activitiesAPI } from "@/api"
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

const ActivitiesManagement = () => {
    const [activities, setActivities] = useState([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingActivity, setEditingActivity] = useState(null)
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState("")
    const [formData, setFormData] = useState({
        title: "",
        image: "",
        color: "bg-gradient-to-br from-egypt-red to-egypt-gold",
        order: 0,
        isActive: true,
    })

    const colorOptions = [
        "bg-gradient-to-br from-egypt-red to-egypt-gold",
        "bg-gradient-to-br from-blue-500 to-blue-600",
        "bg-gradient-to-br from-egypt-red to-red-600",
        "bg-gradient-to-br from-egypt-gold to-yellow-600",
        "bg-gradient-to-br from-purple-500 to-purple-600",
        "bg-gradient-to-br from-green-500 to-green-600",
    ]

    useEffect(() => {
        fetchActivities()
    }, [])

    const fetchActivities = async () => {
        try {
            setLoading(true)
            const response = await activitiesAPI.getAll()
            setActivities(response.data)
        } catch (error) {
            console.error("Error fetching activities:", error)
            toast.error("فشل في تحميل الأنشطة")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const data = new FormData()
            data.append("title", formData.title)
            data.append("color", formData.color)
            data.append("order", formData.order)
            data.append("isActive", formData.isActive)

            // Add image file if selected, otherwise add URL if provided
            if (imageFile) {
                data.append("image", imageFile)
            } else if (formData.image && formData.image.trim() !== "") {
                data.append("image", formData.image.trim())
            }
            // Don't send image field if both are empty

            if (editingActivity) {
                await activitiesAPI.update(editingActivity._id, data)
                toast.success("تم تحديث النشاط بنجاح")
            } else {
                await activitiesAPI.create(data)
                toast.success("تم إضافة النشاط بنجاح")
            }

            setDialogOpen(false)
            resetForm()
            fetchActivities()
        } catch (error) {
            console.error("Error saving activity:", error)
            toast.error(editingActivity ? "فشل في تحديث النشاط" : "فشل في إضافة النشاط")
        }
    }

    const handleEdit = (activity) => {
        setEditingActivity(activity)
        setFormData({
            title: activity.title,
            image: activity.image || "",
            color: activity.color,
            order: activity.order,
            isActive: activity.isActive,
        })
        setImagePreview(activity.image || "")
        setImageFile(null)
        setDialogOpen(true)
    }

    const handleDelete = async (id) => {
        if (!confirm("هل أنت متأكد من حذف هذا النشاط؟")) return

        try {
            await activitiesAPI.delete(id)
            toast.success("تم حذف النشاط بنجاح")
            fetchActivities()
        } catch (error) {
            console.error("Error deleting activity:", error)
            toast.error("فشل في حذف النشاط")
        }
    }

    const handleToggleStatus = async (id) => {
        try {
            await activitiesAPI.toggleStatus(id)
            toast.success("تم تغيير حالة النشاط بنجاح")
            fetchActivities()
        } catch (error) {
            console.error("Error toggling activity status:", error)
            toast.error("فشل في تغيير حالة النشاط")
        }
    }

    const resetForm = () => {
        setFormData({
            title: "",
            image: "",
            color: "bg-gradient-to-br from-egypt-red to-egypt-gold",
            order: 0,
            isActive: true,
        })
        setEditingActivity(null)
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
                <h1 className="text-3xl font-bold font-arabic">إدارة الأنشطة المركزية</h1>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-egypt-gold hover:bg-egypt-gold/90">
                            <Plus className="w-4 h-4 mr-2" />
                            إضافة نشاط جديد
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="font-arabic">{editingActivity ? "تعديل النشاط" : "إضافة نشاط جديد"}</DialogTitle>
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
                                <Label htmlFor="imageFile" className="font-arabic">
                                    تحميل صورة
                                </Label>
                                <Input id="imageFile" type="file" accept="image/*" onChange={handleImageChange} className="cursor-pointer" />
                                {imagePreview && (
                                    <div className="mt-2">
                                        <img
                                            src={imagePreview.startsWith("/") ? `https://form.codepeak.software${imagePreview}` : imagePreview}
                                            alt="Preview"
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                    </div>
                                )}
                            </div>
                            {/* 
                            <div>
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
                                            {color.split(" ").slice(-2).join(" ")}
                                        </option>
                                    ))}
                                </select>
                            </div>

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
                                    {editingActivity ? "تحديث" : "إضافة"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Alert className="mb-6">
                <AlertDescription className="font-arabic">
                    إجمالي الأنشطة: {activities.length} | النشطة: {activities.filter((a) => a.isActive).length}
                </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {activities.map((activity) => (
                    <Card key={activity._id} className={`${!activity.isActive ? "opacity-50" : ""}`}>
                        <CardHeader>
                            <CardTitle className="font-arabic text-right flex items-start justify-between">
                                <span className="flex-1 text-base">{activity.title}</span>
                                <div className="flex gap-1">
                                    {activity.isActive ? <Eye className="w-5 h-5 text-green-600" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {activity.image && (
                                <div className="mb-4 aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                    <img
                                        src={activity.image.startsWith("/") ? `https://form.codepeak.software${activity.image}` : activity.image}
                                        alt={activity.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                                <span>الترتيب: {activity.order}</span>
                                <span className="text-xs">{activity.color.split(" ").slice(-2).join(" ")}</span>
                            </div>

                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleEdit(activity)} className="flex-1">
                                    <Edit className="w-4 h-4 mr-1" />
                                    تعديل
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleToggleStatus(activity._id)} className="flex-1">
                                    {activity.isActive ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                                    {activity.isActive ? "إخفاء" : "إظهار"}
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDelete(activity._id)} className="px-3">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {activities.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground font-arabic">لا توجد أنشطة حالياً</p>
                </div>
            )}
        </div>
    )
}

export default ActivitiesManagement
