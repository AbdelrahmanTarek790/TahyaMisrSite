"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useError } from "@/context/ErrorContext"
import { jobsAPI } from "@/app/api/api"
import { Plus, Edit, Trash2, Eye, Search, X, Briefcase } from "lucide-react"
import CreateJobSheet from "@/components/forms/CreateJobSheet"

const JobsManagement = () => {
    const [jobs, setJobs] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [editingJob, setEditingJob] = useState(null)
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 })
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const { addError } = useError()

    useEffect(() => {
        fetchJobs()
    }, [pagination.page, searchTerm, categoryFilter])

    const fetchJobs = async () => {
        try {
            setIsLoading(true)

            const params = {
                page: pagination.page,
                limit: pagination.limit,
            }

            if (searchTerm.trim()) {
                params.search = searchTerm.trim()
            }

            if (categoryFilter !== "all") {
                params.category = categoryFilter
            }

            const response = await jobsAPI.getAll(params)
            
            setJobs(response.data?.jobs || response.data || [])
            setPagination((prev) => ({
                ...prev,
                total: response.data?.pagination?.total || response.count || 0,
            }))
        } catch (error) {
            addError("فشل في جلب البيانات")
        } finally {
            setIsLoading(false)
        }
    }

    const handleEdit = (job) => {
        setEditingJob(job)
        setIsSheetOpen(true)
    }

    const handleDelete = async (id) => {
        if (!confirm("هل أنت متأكد من حذف هذا السجل؟")) return

        try {
            await jobsAPI.delete(id)
            addError("تم الحذف بنجاح!", "success")
            fetchJobs()
        } catch (error) {
            addError("فشل في الحذف")
        }
    }

    const handleNewJob = () => {
        setEditingJob(null)
        setIsSheetOpen(true)
    }

    const handleSheetClose = () => {
        setIsSheetOpen(false)
        setEditingJob(null)
    }

    const handleSheetSuccess = () => {
        fetchJobs()
    }

    const getCategoryLabel = (cat) => {
        const labels = {
            trainings: "تدريب",
            scholarships: "منحة",
            jobs: "وظيفة",
            trips: "رحلة",
            camps: "معسكر",
            exhibitions_and_conferences: "معرض ومؤتمر"
        }
        return labels[cat] || cat
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <Briefcase className="h-8 w-8 text-primary" />
                        إدارة الوظائف والتدريبات
                    </h1>
                    <p className="text-gray-600 mt-1">إنشاء وإدارة المنح والوظائف والمعسكرات</p>
                </div>
                <Button onClick={handleNewJob}>
                    <Plus className="mr-2 h-4 w-4" />
                    إضافة جديد
                </Button>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 max-w-2xl">
                <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        type="text"
                        placeholder="ابحث بالعنوان..."
                        className="pr-10 pl-10"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setPagination((prev) => ({ ...prev, page: 1 }))
                        }}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => {
                                setSearchTerm("")
                                setPagination((prev) => ({ ...prev, page: 1 }))
                            }}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
                <div className="w-48">
                    <Select value={categoryFilter} onValueChange={(val) => {
                        setCategoryFilter(val)
                        setPagination((prev) => ({ ...prev, page: 1 }))
                    }}>
                        <SelectTrigger>
                            <SelectValue placeholder="الفلترة بالفئة" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">الكل</SelectItem>
                            <SelectItem value="trainings">تدريبات</SelectItem>
                            <SelectItem value="scholarships">منح</SelectItem>
                            <SelectItem value="jobs">وظائف</SelectItem>
                            <SelectItem value="trips">رحلات</SelectItem>
                            <SelectItem value="camps">معسكرات</SelectItem>
                            <SelectItem value="exhibitions_and_conferences">معارض ومؤتمرات</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* List */}
            <div className="grid gap-6">
                {isLoading && jobs.length === 0 ? (
                    <Card>
                        <CardContent className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </CardContent>
                    </Card>
                ) : jobs.length === 0 ? (
                    <Card>
                        <CardContent className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد سجلات</h3>
                                <p className="text-gray-600 mb-4">ابدأ بإضافة فرصة جديدة</p>
                                <Button onClick={handleNewJob}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    إضافة جديد
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    jobs.map((job) => (
                        <Card key={job._id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold">
                                                {getCategoryLabel(job.category)}
                                            </span>
                                            <CardTitle className="text-xl">{job.title}</CardTitle>
                                        </div>
                                        <CardDescription>أضيف في {new Date(job.createdAt).toLocaleDateString("ar-EG")}</CardDescription>
                                    </div>
                                    <div className="flex space-x-2 space-x-reverse">
                                        <Button variant="outline" size="sm" onClick={() => window.open(`/jobs-and-internships/${job.slug || job._id}`, "_blank")}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => handleEdit(job)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => handleDelete(job._id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex space-x-4 space-x-reverse">
                                    {job.imageUrl && (
                                        <img
                                            src={`https://tmbackend.tahyamisryu.com${job.imageUrl}`}
                                            crossOrigin="anonymous"
                                            alt={job.title}
                                            className="w-24 h-24 object-cover rounded-lg shadow-sm"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <p className="text-gray-600 line-clamp-3 leading-relaxed">{job.description}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Pagination */}
            {pagination.total > pagination.limit && (
                <div className="flex justify-center space-x-2 space-x-reverse">
                    <Button
                        variant="outline"
                        onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page === 1}
                    >
                        السابق
                    </Button>
                    <span className="flex items-center px-4 font-medium">
                        الصفحة {pagination.page} من {Math.ceil(pagination.total / pagination.limit)}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                        disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                    >
                        التالي
                    </Button>
                </div>
            )}

            <CreateJobSheet isOpen={isSheetOpen} onClose={handleSheetClose} onSuccess={handleSheetSuccess} editingJob={editingJob} />
        </div>
    )
}

export default JobsManagement
