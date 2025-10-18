import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { heroImagesAPI } from "@/api"
import api from "@/api"
import { Trash2, Upload, ArrowUp, ArrowDown, RefreshCw } from "lucide-react"

const uploadsBase = (api.defaults.baseURL || "").replace(/\/api\/v1$/, "") + "/uploads/"

export default function HeroImagesManagement() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState(null)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [order, setOrder] = useState(0)
    const [isActive, setIsActive] = useState(true)

    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    }, [items])

    const load = async () => {
        setLoading(true)
        try {
            const res = await heroImagesAPI.getAllAdmin()
            setItems(res.data || [])
        } catch (e) {
            // noop
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [])

    const handleUpload = async (e) => {
        e.preventDefault()
        if (!file) return
        try {
            setLoading(true)
            const form = new FormData()
            form.append("file", file)
            if (title) form.append("title", title)
            if (description) form.append("description", description)
            form.append("order", String(order))
            form.append("isActive", String(isActive))

            // direct axios call to preserve multipart headers
            const res = await api.post("/hero-images", form, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            if (res?.data) {
                setTitle("")
                setDescription("")
                setOrder(0)
                setIsActive(true)
                setFile(null)
                await load()
            }
        } catch (err) {
            // handle
        } finally {
            setLoading(false)
        }
    }

    const toggleActive = async (it, checked) => {

        try {
            setLoading(true)
            await api.put(`/hero-images/${it._id}`, { isActive: `${checked}` })
            await load()
        } finally {
            setLoading(false)
        }
    }
    const updateOrder = async (it, delta) => {
        try {
            setLoading(true)
            const newOrder = (it.order ?? 0) + delta
            await api.put(`/hero-images/${it._id}`, { order: newOrder })
            await load()
        } finally {
            setLoading(false)
        }
    }

    const remove = async (it) => {
        if (!confirm("Delete this hero image?")) return
        try {
            setLoading(true)
            await api.delete(`/hero-images/${it._id}`)
            await load()
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">إدارة صور الهيرو</h1>
                    <p className="text-gray-600">رفع وترتيب وتفعيل/تعطيل صور الخلفية للقسم الرئيسي</p>
                </div>
                <Button variant="outline" onClick={load} disabled={loading}>
                    <RefreshCw className="h-4 w-4 mr-2" /> تحديث
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>رفع صورة جديدة</CardTitle>
                    <CardDescription>سيتم تحسين الصورة تلقائيًا ورفع نسخة WebP</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="grid gap-4 md:grid-cols-2" onSubmit={handleUpload}>
                        <div className="space-y-2">
                            <Label htmlFor="file">الملف</Label>
                            <Input id="file" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="title">العنوان (اختياري)</Label>
                            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="description">الوصف (اختياري)</Label>
                            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="order">الترتيب</Label>
                            <Input id="order" type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value || "0", 10))} />
                        </div>
                        <div className="flex items-center space-x-2" dir="ltr">
                            <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
                            <Label htmlFor="isActive">مفعل</Label>
                        </div>
                        <div className="md:col-span-2">
                            <Button type="submit" disabled={loading || !file}>
                                <Upload className="h-4 w-4 mr-2" /> رفع
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-4">
                {loading && items.length === 0 ? (
                    <Card>
                        <CardContent className="py-8 text-center">جارِ التحميل...</CardContent>
                    </Card>
                ) : sortedItems.length === 0 ? (
                    <Card>
                        <CardContent className="py-8 text-center">لا توجد صور</CardContent>
                    </Card>
                ) : (
                    sortedItems.map((it) => (
                        <Card key={it._id}>
                            <CardContent className="py-4">
                                <div className="flex items-center gap-4">
                                    <img
                                        crossOrigin="anonymous"
                                        src={uploadsBase + it.imagePath}
                                        alt={it.title || "Hero"}
                                        className="w-32 h-20 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <div className="font-semibold">{it.title || "بدون عنوان"}</div>
                                        <div className="text-sm text-gray-600">الترتيب: {it.order ?? 0}</div>
                                        <div className="text-sm text-gray-600">{it.description}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="icon" onClick={() => updateOrder(it, -1)}>
                                            <ArrowUp className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="icon" onClick={() => updateOrder(it, +1)}>
                                            <ArrowDown className="h-4 w-4" />
                                        </Button>
                                        <div className="flex items-center gap-2" dir="ltr">
                                            <Switch checked={!!it.isActive} onCheckedChange={(checked) => toggleActive(it, checked)} />
                                            <span className="text-sm">{it.isActive ? "مفعل" : "معطل"}</span>
                                        </div>
                                        <Button variant="destructive" size="icon" onClick={() => remove(it)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
