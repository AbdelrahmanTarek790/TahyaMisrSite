'use client'
import { useState, useEffect, useCallback } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { mandatoryUpdatesAPI } from "@/app/api/api"
import { useAuth } from "@/context/AuthContext"
import { useError } from "@/context/ErrorContext"
import {
    ShieldAlert,
    Loader2,
    CheckCircle2,
    AlertTriangle,
} from "lucide-react"

const MandatoryUpdateModal = () => {
    const { user, updateUser } = useAuth()
    const { addError } = useError()
    const [pendingUpdates, setPendingUpdates] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [fieldValues, setFieldValues] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [fieldErrors, setFieldErrors] = useState({})

    const [initialValues, setInitialValues] = useState({})

    const fetchPendingUpdates = useCallback(async () => {
        try {
            setIsLoading(true)
            const response = await mandatoryUpdatesAPI.getMyPending()
            const data = response.data
            // Support both old flat array and new nested object
            const allUpdates = Array.isArray(data) ? data : (data.pendingUpdates || [])
            const updates = allUpdates
            
            setPendingUpdates(updates)
            setCurrentIndex(0)
            if (updates.length > 0) {
                initFieldValues(updates[0])
            }
        } catch (error) {
            console.error("Failed to fetch pending mandatory updates:", error)
        } finally {
            setIsLoading(false)
        }
    }, [user]) // depend on user so we can prefill

    useEffect(() => {
        if (user) {
            fetchPendingUpdates()
        }
    }, [user, fetchPendingUpdates])

    const initFieldValues = (update) => {
        const initial = {}
        if (update?.fields) {
            update.fields.forEach((field) => {
                let existingValue = "";
                
                if (field._id === "core_nationalId") existingValue = user?.nationalId || "";
                else if (field._id === "core_name") existingValue = user?.name || "";
                else if (field._id === "core_phone") existingValue = user?.phone || "";
                else if (field._id === "core_university") existingValue = user?.university || "";
                else if (field._id === "core_governorate") existingValue = user?.governorate || "";
                else if (field._id === "core_email") existingValue = user?.email || "";
                else {
                    // It's a CustomField, check customFieldValues
                    const existingCfv = user?.customFieldValues?.find((cfv) => {
                        const cfvFieldId = typeof cfv.fieldId === "object" && cfv.fieldId
                            ? cfv.fieldId._id
                            : cfv.fieldId
                        return cfvFieldId === field._id
                    })
                    
                    if (existingCfv && existingCfv.value !== undefined && existingCfv.value !== null && existingCfv.value !== "") {
                        existingValue = existingCfv.value;
                    }
                }

                if (field.type === "checkbox_list") {
                    initial[field._id] = Array.isArray(existingValue) ? existingValue : (existingValue ? [existingValue] : [])
                } else {
                    initial[field._id] = existingValue
                }
            })
        }
        setFieldValues(initial)
        setInitialValues(initial)
        setFieldErrors({})
    }

    const currentUpdate = pendingUpdates[currentIndex]
    const isOpen = !isLoading && pendingUpdates.length > 0 && !!currentUpdate

    const getSubmitButtonText = () => {
        if (!currentUpdate?.fields) return "إرسال البيانات"

        let hasPreFilled = false
        let hasChanges = false

        currentUpdate.fields.forEach((field) => {
            const initialVal = initialValues[field._id]
            const currentVal = fieldValues[field._id]

            const isInitialEmpty = field.type === "checkbox_list" 
                ? (!initialVal || initialVal.length === 0) 
                : (!initialVal || String(initialVal).trim() === "")

            if (!isInitialEmpty) {
                hasPreFilled = true
            }

            // Check if changed
            if (field.type === "checkbox_list") {
                const initArr = Array.isArray(initialVal) ? initialVal : []
                const currArr = Array.isArray(currentVal) ? currentVal : []
                if (initArr.length !== currArr.length || !initArr.every(v => currArr.includes(v))) {
                    hasChanges = true
                }
            } else {
                if (String(initialVal || "") !== String(currentVal || "")) {
                    hasChanges = true
                }
            }
        })

        if (hasChanges && hasPreFilled) return "تعديل وتأكيد"
        if (hasPreFilled && !hasChanges) return "تأكيد صحة البيانات"
        return "إرسال البيانات" // Default when empty
    }

    const handleFieldChange = (fieldId, value) => {
        setFieldValues((prev) => ({
            ...prev,
            [fieldId]: value,
        }))
        // Clear error on change
        if (fieldErrors[fieldId]) {
            setFieldErrors((prev) => {
                const next = { ...prev }
                delete next[fieldId]
                return next
            })
        }
    }

    const handleCheckboxChange = (fieldId, option, checked) => {
        setFieldValues((prev) => {
            const current = Array.isArray(prev[fieldId]) ? prev[fieldId] : []
            if (checked) {
                return { ...prev, [fieldId]: [...current, option] }
            } else {
                return { ...prev, [fieldId]: current.filter((o) => o !== option) }
            }
        })
        if (fieldErrors[fieldId]) {
            setFieldErrors((prev) => {
                const next = { ...prev }
                delete next[fieldId]
                return next
            })
        }
    }

    const validateFields = () => {
        const errors = {}
        if (!currentUpdate?.fields) return true

        currentUpdate.fields.forEach((field) => {
            const value = fieldValues[field._id]
            if (field.type === "checkbox_list") {
                if (!Array.isArray(value) || value.length === 0) {
                    errors[field._id] = "هذا الحقل مطلوب"
                }
            } else {
                if (!value || (typeof value === "string" && value.trim() === "")) {
                    errors[field._id] = "هذا الحقل مطلوب"
                }
            }

            // Type-specific validation
            if (value && typeof value === "string" && value.trim() !== "") {
                if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    errors[field._id] = "البريد الإلكتروني غير صالح"
                }
                if (field.type === "number" && isNaN(Number(value))) {
                    errors[field._id] = "يجب أن تكون القيمة رقماً"
                }
            }
        })

        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async () => {
        if (!validateFields()) return

        try {
            setIsSubmitting(true)

            const customFieldValues = Object.entries(fieldValues).map(([fieldId, value]) => ({
                fieldId,
                value,
            }))

            const response = await mandatoryUpdatesAPI.complete(currentUpdate._id, {
                customFieldValues,
            })

            // Update user data in context if returned
            if (response.data?.user) {
                updateUser(response.data.user)
            }

            addError("تم إكمال التحديث الإلزامي بنجاح!", "success")

            // Move to next pending update or close
            const remaining = pendingUpdates.filter((_, i) => i !== currentIndex)
            setPendingUpdates(remaining)

            if (remaining.length > 0) {
                setCurrentIndex(0)
                initFieldValues(remaining[0])
            }
        } catch (error) {
            addError(error.message || "فشل في إرسال البيانات. حاول مرة أخرى.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const renderField = (field) => {
        const value = fieldValues[field._id]
        const error = fieldErrors[field._id]

        switch (field.type) {
            case "text":
            case "email":
            case "phone":
            case "number":
                return (
                    <div key={field._id} className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">
                            {field.label} <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type={
                                field.type === "email"
                                    ? "email"
                                    : field.type === "phone"
                                    ? "tel"
                                    : field.type === "number"
                                    ? "number"
                                    : "text"
                            }
                            value={value || ""}
                            onChange={(e) => handleFieldChange(field._id, e.target.value)}
                            placeholder={`أدخل ${field.label}`}
                            className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {error && <p className="text-red-500 text-xs">{error}</p>}
                    </div>
                )

            case "textarea":
                return (
                    <div key={field._id} className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">
                            {field.label} <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            value={value || ""}
                            onChange={(e) => handleFieldChange(field._id, e.target.value)}
                            placeholder={`أدخل ${field.label}`}
                            rows={3}
                            className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {error && <p className="text-red-500 text-xs">{error}</p>}
                    </div>
                )

            case "radio":
                return (
                    <div key={field._id} className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">
                            {field.label} <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2">
                            {(field.options || []).map((option) => (
                                <label
                                    key={option}
                                    className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                                        value === option
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name={`field-${field._id}`}
                                        value={option}
                                        checked={value === option}
                                        onChange={() => handleFieldChange(field._id, option)}
                                        className="h-4 w-4 text-blue-600"
                                    />
                                    <span className="text-sm">{option}</span>
                                </label>
                            ))}
                        </div>
                        {error && <p className="text-red-500 text-xs">{error}</p>}
                    </div>
                )

            case "checkbox_list":
                return (
                    <div key={field._id} className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">
                            {field.label} <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2">
                            {(field.options || []).map((option) => {
                                const checked = Array.isArray(value) && value.includes(option)
                                return (
                                    <label
                                        key={option}
                                        className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                                            checked
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={(e) =>
                                                handleCheckboxChange(field._id, option, e.target.checked)
                                            }
                                            className="h-4 w-4 text-blue-600 rounded"
                                        />
                                        <span className="text-sm">{option}</span>
                                    </label>
                                )
                            })}
                        </div>
                        {error && <p className="text-red-500 text-xs">{error}</p>}
                    </div>
                )

            default:
                return (
                    <div key={field._id} className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">
                            {field.label} <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={value || ""}
                            onChange={(e) => handleFieldChange(field._id, e.target.value)}
                            placeholder={`أدخل ${field.label}`}
                            className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
                        />
                        {error && <p className="text-red-500 text-xs">{error}</p>}
                    </div>
                )
        }
    }

    if (!isOpen) return null

    return (
        <Dialog open={true} onOpenChange={() => {}}>
            <DialogContent
                className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto [&>button]:hidden"
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
            >
                {/* Header with icon */}
                <DialogHeader className="text-center space-y-3 pb-2">
                    <div className="mx-auto w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
                        <AlertTriangle className="h-7 w-7 text-amber-600" />
                    </div>
                    <DialogTitle className="text-xl font-bold text-gray-900">
                        تحديث إلزامي مطلوب
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                        {pendingUpdates.length > 1 && (
                            <Badge variant="outline" className="mb-2">
                                {currentIndex + 1} من {pendingUpdates.length}
                            </Badge>
                        )}
                    </DialogDescription>
                </DialogHeader>

                {/* Admin Message */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-right">
                    <div className="flex items-start gap-3">
                        <ShieldAlert className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-800 leading-relaxed">
                            {currentUpdate.adminMessage}
                        </p>
                    </div>
                </div>

                {/* Dynamic Fields */}
                <div className="space-y-4 py-2">
                    {currentUpdate.fields?.map((field) => renderField(field))}
                </div>

                {/* Footer */}
                <DialogFooter className="flex-col gap-2 sm:flex-col">
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        size="lg"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                جاري الإرسال...
                            </>
                        ) : (
                            getSubmitButtonText()
                        )}
                    </Button>
                    <p className="text-xs text-gray-400 text-center">
                        يجب إكمال هذا التحديث للمتابعة في استخدام النظام
                    </p>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default MandatoryUpdateModal
