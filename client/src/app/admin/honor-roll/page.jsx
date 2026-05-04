"use client"
import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { honorRollAPI, usersAPI } from "@/app/api/api"
import { Plus, Edit, Trash2, Eye, EyeOff, Search, User } from "lucide-react"
import { toast } from "sonner"
import { getInitials } from "@/lib/utils"

const BASE_URL = "https://tmbackend.tahyamisryu.com"

const HonorRollManagement = () => {
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingMember, setEditingMember] = useState(null)

    // User search state
    const [userSearch, setUserSearch] = useState("")
    const [userResults, setUserResults] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [userSearchOpen, setUserSearchOpen] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        order: 0,
        isActive: true,
    })

    useEffect(() => {
        fetchMembers()
    }, [])

    const fetchMembers = async () => {
        try {
            setLoading(true)
            const response = await honorRollAPI.getAll()
            setMembers(response.data)
        } catch (error) {
            console.error("Error fetching honor members:", error)
            toast.error("فشل في تحميل أعضاء لجنة الشرف")
        } finally {
            setLoading(false)
        }
    }

    const searchUsers = useCallback(async (query) => {
        if (!query || query.length < 2) {
            setUserResults([])
            return
        }
        try {
            setSearchLoading(true)
            const response = await usersAPI.getAll({ search: query, limit: 10 })
            setUserResults(response.data.users || [])
        } catch (error) {
            console.error("Error searching users:", error)
            setUserResults([])
        } finally {
            setSearchLoading(false)
        }
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            searchUsers(userSearch)
        }, 400)
        return () => clearTimeout(timer)
    }, [userSearch, searchUsers])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!selectedUser && !editingMember) {
            toast.error("يرجى اختيار عضو أولاً")
            return
        }

        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                order: formData.order,
                isActive: formData.isActive,
            }
            if (selectedUser) payload.userId = selectedUser._id

            if (editingMember) {
                await honorRollAPI.update(editingMember._id, payload)
                toast.success("تم تحديث العضو بنجاح")
            } else {
                await honorRollAPI.create(payload)
                toast.success("تم إضافة العضو بنجاح")
            }

            setDialogOpen(false)
            resetForm()
            fetchMembers()
        } catch (error) {
            console.error("Error saving honor member:", error)
            toast.error(editingMember ? "فشل في تحديث العضو" : "فشل في إضافة العضو")
        }
    }

    const handleEdit = (member) => {
        setEditingMember(member)
        setSelectedUser(member.user || null)
        setUserSearch(member.user?.name || "")
        setFormData({
            title: member.title,
            description: member.description || "",
            order: member.order,
            isActive: member.isActive,
        })
        setDialogOpen(true)
    }

    const handleDelete = async (id) => {
        if (!confirm("هل أنت متأكد من حذف هذا العضو؟")) return
        try {
            await honorRollAPI.delete(id)
            toast.success("تم حذف العضو بنجاح")
            fetchMembers()
        } catch (error) {
            console.error("Error deleting honor member:", error)
            toast.error("فشل في حذف العضو")
        }
    }

    const handleToggleStatus = async (member) => {
        try {
            await honorRollAPI.update(member._id, { isActive: !member.isActive })
            toast.success("تم تغيير حالة العضو بنجاح")
            fetchMembers()
        } catch (error) {
            toast.error("فشل في تغيير حالة العضو")
        }
    }

    const resetForm = () => {
        setFormData({ title: "", description: "", order: 0, isActive: true })
        setEditingMember(null)
        setSelectedUser(null)
        setUserSearch("")
        setUserResults([])
        setUserSearchOpen(false)
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
                <h1 className="text-3xl font-bold font-arabic">إدارة لجنة الشرف</h1>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-egypt-gold hover:bg-egypt-gold/90" onClick={resetForm}>
                            <Plus className="w-4 h-4 mr-2" />
                            إضافة عضو جديد
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="font-arabic">
                                {editingMember ? "تعديل العضو" : "إضافة عضو جديد"}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Searchable User Select */}
                            <div>
                                <Label className="font-arabic">العضو</Label>
                                <div className="relative">
                                    <div className="relative">
                                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            value={userSearch}
                                            onChange={(e) => {
                                                setUserSearch(e.target.value)
                                                setUserSearchOpen(true)
                                                if (!e.target.value) setSelectedUser(null)
                                            }}
                                            onFocus={() => setUserSearchOpen(true)}
                                            placeholder="ابحث باسم العضو..."
                                            className="text-right font-arabic pr-10"
                                        />
                                    </div>

                                    {/* Dropdown Results */}
                                    {userSearchOpen && (userResults.length > 0 || searchLoading) && (
                                        <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-48 overflow-y-auto">
                                            {searchLoading ? (
                                                <div className="p-3 text-center text-sm text-muted-foreground font-arabic">جاري البحث...</div>
                                            ) : (
                                                userResults.map((u) => (
                                                    <button
                                                        key={u._id}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedUser(u)
                                                            setUserSearch(u.name)
                                                            setUserSearchOpen(false)
                                                        }}
                                                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted text-right transition-colors"
                                                    >
                                                        <Avatar className="w-8 h-8 shrink-0">
                                                            <AvatarImage
                                                                src={u.profileImage ? (u.profileImage.startsWith('http') ? u.profileImage : `${BASE_URL}${u.profileImage.startsWith('/uploads/') ? '' : '/uploads/'}${u.profileImage.startsWith('/') ? u.profileImage.substring(1) : u.profileImage}`) : undefined}
                                                                alt={u.name}
                                                            />
                                                            <AvatarFallback className="text-xs">{getInitials(u.name)}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 text-right">
                                                            <p className="text-sm font-medium font-arabic">{u.name}</p>
                                                            <p className="text-xs text-muted-foreground">{u.university || u.role}</p>
                                                        </div>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Selected user preview */}
                                {selectedUser && (
                                    <div className="mt-2 flex items-center gap-2 p-2 bg-muted rounded-md">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage
                                                src={selectedUser.profileImage ? (selectedUser.profileImage.startsWith('http') ? selectedUser.profileImage : `${BASE_URL}${selectedUser.profileImage.startsWith('/uploads/') ? '' : '/uploads/'}${selectedUser.profileImage.startsWith('/') ? selectedUser.profileImage.substring(1) : selectedUser.profileImage}`) : undefined}
                                            />
                                            <AvatarFallback className="text-xs">{getInitials(selectedUser.name)}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm font-arabic">{selectedUser.name}</span>
                                        <Badge variant="outline" className="mr-auto text-xs">{selectedUser.role}</Badge>
                                    </div>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="title" className="font-arabic">اللقب / المهمة</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    placeholder="مثال: رئيس مجلس الاتحاد"
                                    className="text-right font-arabic"
                                />
                            </div>

                            <div>
                                <Label htmlFor="description" className="font-arabic">الوصف (اختياري)</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="text-right font-arabic"
                                />
                            </div>

                            <div>
                                <Label htmlFor="order" className="font-arabic">الترتيب</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
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
                                <Label htmlFor="isActive" className="font-arabic cursor-pointer">نشط</Label>
                            </div>

                            <div className="flex gap-2 justify-end">
                                <Button type="button" variant="outline" onClick={handleDialogClose}>إلغاء</Button>
                                <Button type="submit" className="bg-egypt-gold hover:bg-egypt-gold/90">
                                    {editingMember ? "تحديث" : "إضافة"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Alert className="mb-6">
                <AlertDescription className="font-arabic">
                    إجمالي الأعضاء: {members.length} | النشطون: {members.filter((m) => m.isActive).length}
                </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member) => (
                    <Card key={member._id} className={`${!member.isActive ? "opacity-50" : ""}`}>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage
                                        src={member.user?.profileImage ? (member.user.profileImage.startsWith('http') ? member.user.profileImage : `${BASE_URL}${member.user.profileImage.startsWith('/uploads/') ? '' : '/uploads/'}${member.user.profileImage.startsWith('/') ? member.user.profileImage.substring(1) : member.user.profileImage}`) : undefined}
                                        alt={member.user?.name}
                                    />
                                    <AvatarFallback>{member.user?.name ? getInitials(member.user.name) : <User className="w-5 h-5" />}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 text-right">
                                    <CardTitle className="font-arabic text-base">{member.user?.name || "—"}</CardTitle>
                                    <p className="text-xs text-muted-foreground font-arabic">{member.user?.university || ""}</p>
                                </div>
                                {member.isActive ? <Eye className="w-4 h-4 text-green-600 shrink-0" /> : <EyeOff className="w-4 h-4 text-gray-400 shrink-0" />}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Badge className="mb-2 font-arabic">{member.title}</Badge>
                            {member.description && (
                                <p className="text-sm text-muted-foreground mb-4 font-arabic text-right line-clamp-2">
                                    {member.description}
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground mb-4 font-arabic">الترتيب: {member.order}</p>

                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleEdit(member)} className="flex-1">
                                    <Edit className="w-4 h-4 mr-1" />
                                    تعديل
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleToggleStatus(member)} className="flex-1">
                                    {member.isActive ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                                    {member.isActive ? "إخفاء" : "إظهار"}
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDelete(member._id)} className="px-3">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {members.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground font-arabic">لا يوجد أعضاء في لجنة الشرف حالياً</p>
                </div>
            )}
        </div>
    )
}

export default HonorRollManagement
