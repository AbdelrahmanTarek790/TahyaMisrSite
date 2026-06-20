import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useError } from "../../context/ErrorContext"
import { jobsAPI } from "@/app/api/api"

const jobSchema = z.object({
    title: z.string().min(3, "العنوان يجب أن يكون 3 أحرف على الأقل"),
    description: z.string().min(10, "الوصف يجب أن يكون 10 أحرف على الأقل"),
    category: z.enum(["trainings", "scholarships", "jobs", "trips", "camps", "exhibitions_and_conferences"], {
        required_error: "يرجى اختيار الفئة",
    }),
    imageUrl: z.any().optional(),
    sendNotification: z.boolean().optional()
})

const CreateJobSheet = ({ isOpen, onClose, onSuccess, editingJob = null }) => {
    const [isLoading, setIsLoading] = useState(false)
    const { addError } = useError()

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            title: "",
            description: "",
            category: "jobs",
            sendNotification: false
        }
    })

    // Reset form when editingJob changes
    useEffect(() => {
        if (editingJob) {
            reset({
                title: editingJob.title,
                description: editingJob.description,
                category: editingJob.category,
                sendNotification: false
            })
        } else {
            reset({ 
                title: "", 
                description: "", 
                category: "jobs", 
                sendNotification: false 
            })
        }
    }, [editingJob, reset])

    const onSubmit = async (data) => {
        try {
            if (!editingJob && (!data.imageUrl || data.imageUrl.length === 0)) {
                addError("يرجى إرفاق صورة للوظيفة/التدريب (مطلوب)", "error")
                return
            }
           
            setIsLoading(true)
            const formData = new FormData()
            formData.append("title", data.title)
            formData.append("description", data.description)
            formData.append("category", data.category)
            
            if (!editingJob && data.sendNotification) {
                formData.append("sendNotification", "true")
            }

            if (data.imageUrl && data.imageUrl[0]) {
                formData.append("imageUrl", data.imageUrl[0])
            }

            if (editingJob) {
                await jobsAPI.update(editingJob._id, formData)
                addError("تم التحديث بنجاح!", "success")
            } else {
                await jobsAPI.create(formData)
                addError("تم الإنشاء بنجاح!", "success")
            }

            reset()
            onClose()
            if (onSuccess) onSuccess()
        } catch (error) {
            addError(error?.error || `فشل في ${editingJob ? "تحديث" : "إنشاء"} السجل`)
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    return (
        <Sheet open={isOpen} onOpenChange={handleClose}>
            <SheetContent className="w-[95%] sm:max-w-[600px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{editingJob ? "تعديل وظيفة / تدريب" : "إضافة وظيفة / تدريب"}</SheetTitle>
                </SheetHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6 px-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                        <Input {...register("title")} placeholder="أدخل العنوان" />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الفئة</label>
                        <Controller
                            control={control}
                            name="category"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="اختر الفئة" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="trainings">تدريبات</SelectItem>
                                        <SelectItem value="scholarships">منح</SelectItem>
                                        <SelectItem value="jobs">وظائف</SelectItem>
                                        <SelectItem value="trips">رحلات</SelectItem>
                                        <SelectItem value="camps">معسكرات</SelectItem>
                                        <SelectItem value="exhibitions_and_conferences">معارض ومؤتمرات</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                        <textarea
                            {...register("description")}
                            className="w-full min-h-[150px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="أدخل الوصف التفصيلي"
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الصورة {editingJob ? "(اختياري)" : "(مطلوب)"}</label>
                        <Input {...register("imageUrl")} type="file" accept="image/*" />
                        {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>}
                    </div>

                    {!editingJob && (
                        <div className="flex items-center gap-2 mt-4">
                            <input
                                type="checkbox"
                                id="sendNotification"
                                {...register("sendNotification")}
                                className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                            />
                            <label htmlFor="sendNotification" className="text-sm text-gray-700 cursor-pointer">
                                إرسال إشعار للمستخدمين (Push Notification)
                            </label>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            إلغاء
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? `${editingJob ? "تحديث..." : "إنشاء..."}` : `${editingJob ? "تحديث السجل" : "إنشاء السجل"}`}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    )
}

export default CreateJobSheet
