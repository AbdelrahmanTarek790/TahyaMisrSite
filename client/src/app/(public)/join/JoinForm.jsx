"use client"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle, Users, FileText, Phone, Mail, MapPin, User, Crown } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { joinRequestAPI, positionsAPI, siteSettingsAPI } from "@/app/api/api"
import { EGYPT_GOVERNORATES } from "@/constants/governorates"
import { useRouter } from "next/navigation"

export default function JoinForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [positions, setPositions] = useState([])
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")
    const [joinRequestsEnabled, setJoinRequestsEnabled] = useState(true)
    const [joinRequestMessage, setJoinRequestMessage] = useState("")
    
    // OTP states
    const [otpPhase, setOtpPhase] = useState(false)
    const [otpCode, setOtpCode] = useState("")
    const [timeLeft, setTimeLeft] = useState(60)
    const [verifying, setVerifying] = useState(false)
    const timerRef = useRef(null)

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        nationalID: "",
        governorate: "",
        position: "",
        membershipNumber: "",
        role: "member",
        notes: "",
    })

    const [errors, setErrors] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            try {
                const settingsResponse = await siteSettingsAPI.getSettings()
                const settings = settingsResponse.data || settingsResponse
                setJoinRequestsEnabled(settings.joinRequestsEnabled)
                setJoinRequestMessage(settings.joinRequestMessage || "عذراً، التسجيل غير متاح حالياً")

                const positionsResponse = await positionsAPI.getAll()
                setPositions(positionsResponse.data.positions || [])
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (otpPhase && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            clearInterval(timerRef.current)
        }
        return () => clearInterval(timerRef.current)
    }, [otpPhase, timeLeft])

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) newErrors.name = "الاسم مطلوب"
        if (!formData.email.trim()) newErrors.email = "البريد الإلكتروني مطلوب"
        if (!formData.phone.trim()) newErrors.phone = "رقم الهاتف مطلوب"
        if (!formData.nationalID.trim()) newErrors.nationalID = "الرقم القومي مطلوب"
        if (!formData.governorate) newErrors.governorate = "المحافظة مطلوبة"
        if (!formData.role) newErrors.role = "نوع العضوية مطلوب"

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = "صيغة البريد الإلكتروني غير صحيحة"
        }

        const phoneRegex = /^(010|011|012|015)\d{8}$/
        if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s+/g, ""))) {
            newErrors.phone = "رقم الهاتف يجب أن يكون مصري صحيح (010, 011, 012, 015)"
        }

        const nationalIDRegex = /^\d{14}$/
        if (formData.nationalID && !nationalIDRegex.test(formData.nationalID)) {
            newErrors.nationalID = "الرقم القومي يجب أن يكون 14 رقم"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))

        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setLoading(true)
        setError("")

        try {
            const requestData = {
                ...formData,
                position: formData.position || undefined,
                membershipNumber: formData.membershipNumber || undefined,
                notes: formData.notes || undefined,
            }

            await joinRequestAPI.create(requestData)
            setOtpPhase(true)
            setTimeLeft(60)
        } catch (error) {
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault()
        if (otpCode.length !== 6) {
            setError("يرجى إدخال كود التحقق المكون من 6 أرقام")
            return
        }

        setVerifying(true)
        setError("")

        try {
            await joinRequestAPI.verifyOtp({ email: formData.email, otpCode })
            setOtpPhase(false)
            setSuccess(true)
            setFormData({
                name: "",
                email: "",
                phone: "",
                nationalID: "",
                governorate: "",
                position: "",
                membershipNumber: "",
                role: "member",
                notes: "",
            })
            setOtpCode("")
        } catch (error) {
            setError(error.error || "كود التحقق غير صحيح أو منتهي الصلاحية")
        } finally {
            setVerifying(false)
        }
    }

    const handleResendOtp = async () => {
        if (timeLeft > 0) return
        setError("")
        
        try {
            await joinRequestAPI.resendOtp({ email: formData.email })
            setTimeLeft(60)
            setOtpCode("")
        } catch (error) {
            setError(error.error || "حدث خطأ أثناء إعادة إرسال الكود")
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6" dir="rtl">
                <Card className="max-w-2xl w-full text-center">
                    <CardContent className="pt-12 pb-12">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-foreground mb-4 font-arabic">تم إرسال طلبك بنجاح!</h2>
                        <p className="text-lg text-muted-foreground mb-8 font-arabic">
                            شكراً لاهتمامك بالانضمام إلى اتحاد شباب تحيا مصر. سيتم مراجعة طلبك والتواصل معك خلال 3-5 أيام عمل.
                        </p>
                        <Button onClick={() => router.push("/")} size="lg" className="font-arabic">
                            العودة إلى الصفحة الرئيسية
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (otpPhase) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6" dir="rtl">
                <Card className="max-w-md w-full text-center">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold font-arabic">التحقق من البريد الإلكتروني</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="font-arabic">{error}</AlertDescription>
                            </Alert>
                        )}
                        <p className="text-muted-foreground font-arabic">
                            تم إرسال كود التحقق إلى بريدك الإلكتروني <strong>{formData.email}</strong>
                        </p>
                        
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div className="space-y-2">
                                <Input
                                    id="otpCode"
                                    type="text"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                                    placeholder="أدخل الكود المكون من 6 أرقام"
                                    className="text-center text-2xl tracking-[0.5em] font-mono h-14"
                                    maxLength="6"
                                    dir="ltr"
                                />
                            </div>
                            
                            <p className="text-sm font-semibold text-red-600 bg-red-50 p-3 rounded-md font-arabic text-right">
                                ⚠️ تنبيه: قد يستغرق وصول البريد دقيقة واحدة. إذا لم تجد الرسالة في صندوق الوارد (Inbox)، يرجى فحص مجلد الرسائل غير المرغوب فيها (Spam / Junk Mail) فوراً.
                            </p>

                            <Button
                                type="submit"
                                size="lg"
                                disabled={verifying || otpCode.length !== 6}
                                className="w-full bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] font-arabic"
                            >
                                {verifying ? "جاري التحقق..." : "تأكيد الحساب"}
                            </Button>
                        </form>

                        <div className="pt-4 border-t text-sm font-arabic">
                            {timeLeft > 0 ? (
                                <p className="text-muted-foreground">
                                    يمكنك إعادة إرسال الكود بعد <span className="font-bold text-foreground">{timeLeft}</span> ثانية
                                </p>
                            ) : (
                                <Button
                                    type="button"
                                    variant="link"
                                    onClick={handleResendOtp}
                                    className="text-primary hover:underline font-arabic p-0 h-auto"
                                >
                                    لم تستلم الكود؟ إعادة إرسال
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!joinRequestsEnabled) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6" dir="rtl">
                <Card className="max-w-2xl w-full text-center">
                    <CardContent className="pt-12 pb-12">
                        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-10 h-10 text-yellow-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-foreground mb-4 font-arabic">التسجيل غير متاح حالياً</h2>
                        <p className="text-lg text-muted-foreground mb-8 font-arabic">{joinRequestMessage}</p>
                        <Button onClick={() => router.push("/")} variant="outline" size="lg" className="font-arabic">
                            العودة إلى الصفحة الرئيسية
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="font-arabic">{error}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-6">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2 font-arabic">
                    <User className="w-5 h-5" />
                    البيانات الشخصية
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="font-arabic">
                            الاسم الكامل *
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            placeholder="أدخل اسمك الكامل"
                            className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && <p className="text-sm text-red-500 font-arabic">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="font-arabic">
                            البريد الإلكتروني *
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="example@email.com"
                            className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && <p className="text-sm text-red-500 font-arabic">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone" className="font-arabic">
                            رقم الهاتف *
                        </Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            placeholder="01012345678"
                            className={errors.phone ? "border-red-500" : ""}
                        />
                        {errors.phone && <p className="text-sm text-red-500 font-arabic">{errors.phone}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nationalID" className="font-arabic">
                            الرقم القومي *
                        </Label>
                        <Input
                            id="nationalID"
                            type="text"
                            value={formData.nationalID}
                            onChange={(e) => handleInputChange("nationalID", e.target.value)}
                            placeholder="12345678901234"
                            maxLength="14"
                            className={errors.nationalID ? "border-red-500" : ""}
                        />
                        {errors.nationalID && <p className="text-sm text-red-500 font-arabic">{errors.nationalID}</p>}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="governorate" className="font-arabic">
                            المحافظة *
                        </Label>
                        <Select value={formData.governorate} onValueChange={(value) => handleInputChange("governorate", value)}>
                            <SelectTrigger className={errors.governorate ? "border-red-500 w-full" : "w-full"}>
                                <SelectValue placeholder="اختر المحافظة" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>اختر المحافظة</SelectLabel>

                                    {EGYPT_GOVERNORATES.map((gov) => (
                                        <SelectItem key={gov} value={gov}>
                                            {gov}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.governorate && <p className="text-sm text-red-500 font-arabic">{errors.governorate}</p>}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <Label htmlFor="notes" className="font-arabic">
                    ملاحظات إضافية (اختياري)
                </Label>
                <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="أخبرنا عن اهتماماتك أو خبراتك..."
                    rows={4}
                />
            </div>

            <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] hover:opacity-90 font-arabic"
            >
                {loading ? "جاري الإرسال..." : "إرسال الطلب"}
            </Button>
        </form>
    )
}
