import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../../components/ui/sheet"
import { useError } from "../../context/ErrorContext"
import { positionsAPI } from "../../api"
import { Plus, Edit, Trash2, Users, MapPin, Building, Search } from "lucide-react"
import { EGYPT_GOVERNORATES } from "../../constants/governorates"

const positionSchema = z.object({
    name: z.string().min(3, "Position name must be at least 3 characters"),
    description: z.string().optional(),
    isActive: z.boolean().default(true),
    isGlobal: z.boolean().default(false),
    governorate: z.string().optional(),
})

const PositionsManagement = () => {
    const [positions, setPositions] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [editingPosition, setEditingPosition] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterActive, setFilterActive] = useState("all")
    const [filterGlobal, setFilterGlobal] = useState("all")
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 })
    const { addError } = useError()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(positionSchema),
    })

    useEffect(() => {
        fetchPositions()
    }, [pagination.page])

    const fetchPositions = async () => {
        try {
            setIsLoading(true)
            const response = await positionsAPI.getAll({
                page: pagination.page,
                limit: pagination.limit,
            })
            setPositions(response.data || [])
            setPagination((prev) => ({
                ...prev,
                total: response.data?.length || 0,
            }))
        } catch (error) {
            addError("Failed to fetch positions")
        } finally {
            setIsLoading(false)
        }
    }

    const onSubmit = async (data) => {
        try {
            setIsLoading(true)
            if (editingPosition) {
                await positionsAPI.update(editingPosition._id, data)
                addError("Position updated successfully!", "success")
            } else {
                await positionsAPI.create(data)
                addError("Position created successfully!", "success")
            }
            setIsSheetOpen(false)
            setEditingPosition(null)
            reset()
            fetchPositions()
        } catch (error) {
            addError(error.message || "Failed to save position")
        } finally {
            setIsLoading(false)
        }
    }

    const handleEdit = (position) => {
        setEditingPosition(position)
        reset({
            name: position.name,
            description: position.description || "",
            isActive: position.isActive,
            isGlobal: position.isGlobal,
            governorate: position.governorate || "",
        })
        setIsSheetOpen(true)
    }

    const handleDelete = async (positionId) => {
        if (!confirm("Are you sure you want to delete this position?")) return

        try {
            await positionsAPI.delete(positionId)
            addError("Position deleted successfully!", "success")
            fetchPositions()
        } catch (error) {
            addError("Failed to delete position")
        }
    }

    const handleCloseSheet = () => {
        setIsSheetOpen(false)
        setEditingPosition(null)
        reset()
    }

    const filteredPositions = positions.filter((position) => {
        const matchesSearch =
            position.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (position.description && position.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (position.governorate && position.governorate.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesActive =
            filterActive === "all" || (filterActive === "active" && position.isActive) || (filterActive === "inactive" && !position.isActive)

        const matchesGlobal =
            filterGlobal === "all" || (filterGlobal === "global" && position.isGlobal) || (filterGlobal === "local" && !position.isGlobal)

        return matchesSearch && matchesActive && matchesGlobal
    })

    const getActiveColor = (isActive) => {
        return isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
    }

    const getScopeColor = (isGlobal) => {
        return isGlobal ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">إدارة المناصب</h1>
                    <p className="text-gray-600">إدارة المناصب والأدوار المتاحة</p>
                </div>
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            إضافة منصب جديد
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[600px] sm:max-w-[600px]">
                        <SheetHeader>
                            <SheetTitle>{editingPosition ? "تعديل المنصب" : "إنشاء منصب جديد"}</SheetTitle>
                        </SheetHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6 px-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنصب</label>
                                <Input {...register("name")} placeholder="أدخل اسم المنصب" />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                                <textarea
                                    {...register("description")}
                                    className="w-full min-h-[100px] p-2 border border-gray-300 rounded-md"
                                    placeholder="أدخل وصف المنصب (اختياري)"
                                />
                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="flex items-center space-x-2">
                                        <input type="checkbox" {...register("isActive")} className="rounded border-gray-300" />
                                        <span className="text-sm font-medium text-gray-700">منصب نشط</span>
                                    </label>
                                </div>

                                <div>
                                    <label className="flex items-center space-x-2">
                                        <input type="checkbox" {...register("isGlobal")} className="rounded border-gray-300" />
                                        <span className="text-sm font-medium text-gray-700">منصب رئيسي</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">المحافظة</label>
                                <select
                                    {...register("governorate")}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    <option value="">اختر المحافظة (اتركه فارغًا للمناصب الرئيسية)</option>
                                    {EGYPT_GOVERNORATES.map((governorate) => (
                                        <option key={governorate} value={governorate}>
                                            {governorate}
                                        </option>
                                    ))}
                                </select>
                                {errors.governorate && <p className="text-red-500 text-sm mt-1">{errors.governorate.message}</p>}
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={handleCloseSheet}>
                                    إلغاء
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "جاري الحفظ..." : editingPosition ? "تحديث" : "إنشاء"}
                                </Button>
                            </div>
                        </form>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="ابحث في المناصب..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={filterActive}
                                onChange={(e) => setFilterActive(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="all">جميع الحالات</option>
                                <option value="active">النشطة</option>
                                <option value="inactive">غير النشطة</option>
                            </select>
                            <select
                                value={filterGlobal}
                                onChange={(e) => setFilterGlobal(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="all">جميع النطاقات</option>
                                <option value="global">رئيسي</option>
                                <option value="local">محلي</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Positions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full text-center py-8">
                        <p className="text-gray-500">جاري تحميل المناصب...</p>
                    </div>
                ) : filteredPositions.length === 0 ? (
                    <div className="col-span-full text-center py-8">
                        <p className="text-gray-500">لا توجد مناصب.</p>
                    </div>
                ) : (
                    filteredPositions.map((position) => (
                        <Card key={position._id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">{position.name}</CardTitle>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="sm" onClick={() => handleEdit(position)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(position._id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <span className={`px-2 py-1 rounded-full text-xs ${getActiveColor(position.isActive)}`}>
                                        {position.isActive ? "Active" : "Inactive"}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${getScopeColor(position.isGlobal)}`}>
                                        {position.isGlobal ? "Global" : "Local"}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {position.description && <p className="text-gray-600 text-sm mb-4 line-clamp-3">{position.description}</p>}
                                <div className="space-y-2 text-sm text-gray-500">
                                    {position.governorate && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            <span>{position.governorate}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        <span>Created {new Date(position.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    {position.createdBy && (
                                        <div className="flex items-center gap-2">
                                            <Building className="h-4 w-4" />
                                            <span>By {position.createdBy.name}</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Pagination */}
            {filteredPositions.length > 10 && (
                <div className="flex justify-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page === 1}
                    >
                        Previous
                    </Button>
                    <span className="px-4 py-2 text-sm">Showing {filteredPositions.length} positions</span>
                    <Button
                        variant="outline"
                        onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                        disabled={filteredPositions.length < pagination.limit}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    )
}

export default PositionsManagement
