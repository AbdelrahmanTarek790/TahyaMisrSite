import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { QuickSEO } from "../../components/QuickSEO"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Textarea } from "../../components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { AlertCircle, CheckCircle, Users, FileText, Phone, Mail, MapPin, User, Crown } from "lucide-react"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { joinRequestAPI, positionsAPI } from "../../api"
import { EGYPT_GOVERNORATES } from "../../constants/governorates"

const JoinRequestPage = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [positions, setPositions] = useState([])
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

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

    // Fetch positions on component mount
    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const response = await positionsAPI.getAll()
                setPositions(response.data.positions || [])
            } catch (error) {
                console.error("Error fetching positions:", error)
            }
        }
        fetchPositions()
    }, [])

    const validateForm = () => {
        const newErrors = {}

        // Required fields validation
        if (!formData.name.trim()) newErrors.name = "الاسم مطلوب"
        if (!formData.email.trim()) newErrors.email = "البريد الإلكتروني مطلوب"
        if (!formData.phone.trim()) newErrors.phone = "رقم الهاتف مطلوب"
        if (!formData.nationalID.trim()) newErrors.nationalID = "الرقم القومي مطلوب"
        if (!formData.governorate) newErrors.governorate = "المحافظة مطلوبة"
        if (!formData.role) newErrors.role = "نوع العضوية مطلوب"

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = "صيغة البريد الإلكتروني غير صحيحة"
        }

        // Phone validation (Egyptian phone numbers)
        const phoneRegex = /^(010|011|012|015)\d{8}$/
        if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s+/g, ""))) {
            newErrors.phone = "رقم الهاتف يجب أن يكون مصري صحيح (010, 011, 012, 015)"
        }

        // National ID validation (14 digits)
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

        // Clear specific field error when user starts typing
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
            setSuccess(true)

            // Reset form
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
        } catch (error) {
            setError(error.error || "حدث خطأ أثناء إرسال الطلب")
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6" dir="rtl">
                <Card className="w-full max-w-2xl text-center">
                    <CardContent className="p-12">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-4">تم إرسال طلبك بنجاح!</h1>
                        <p className="text-lg text-muted-foreground mb-8">
                            شكرًا لك على اهتمامك بالانضمام إلى اتحاد شباب تحيا مصر. سيقوم فريقنا بمراجعة طلبك والرد عليك خلال 5 أيام عمل.
                        </p>
                        <div className="space-y-4 mb-8">
                            <p className="text-muted-foreground">
                                <strong>الخطوات التالية:</strong>
                            </p>
                            <ul className="text-right text-muted-foreground space-y-2">
                                <li>• ستتلقى بريد إلكتروني للتأكيد خلال 24 ساعة</li>
                                <li>• سيتم مراجعة طلبك من قبل فريق القبول</li>
                                <li>• ستحصل على رد نهائي خلال 5 أيام عمل</li>
                                <li>• في حالة الموافقة، ستحصل على بيانات الدخول للحساب</li>
                            </ul>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button onClick={() => navigate("/")} className="bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))]">
                                العودة للرئيسية
                            </Button>
                            <Button variant="outline" onClick={() => setSuccess(false)}>
                                إرسال طلب آخر
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <>
            <QuickSEO pageKey="join" locale="ar" />
            <div className="min-h-screen bg-background" dir="rtl">
                {/* Hero Section */}
                <section className="py-20 bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] text-white">
                    <div className="container mx-auto px-6 text-center">
                        <div className="max-w-4xl mx-auto">
                            <Users className="w-16 h-16 mx-auto mb-6 animate-float" />
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">انضم إلينا</h1>
                            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                                كن جزءًا من رحلة التغيير والتطوير مع اتحاد شباب تحيا مصر
                            </p>
                        </div>
                    </div>
                </section>

                {/* Form Section */}
                <section className="py-20">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">طلب الانضمام</h2>
                                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                    املأ النموذج التالي للتقدم بطلب انضمام إلى اتحاد شباب تحيا مصر
                                </p>
                            </div>

                            {error && (
                                <Alert className="mb-8 border-red-200 bg-red-50">
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                    <AlertDescription className="text-red-600">{error}</AlertDescription>
                                </Alert>
                            )}

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-right text-2xl">بيانات طلب الانضمام</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        {/* Personal Information */}
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                                                <User className="w-5 h-5" />
                                                البيانات الشخصية
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">الاسم الكامل *</Label>
                                                    <Input
                                                        id="name"
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                                        placeholder="أدخل اسمك الكامل"
                                                        className={errors.name ? "border-red-500" : ""}
                                                    />
                                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="email">البريد الإلكتروني *</Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                                        placeholder="example@email.com"
                                                        className={errors.email ? "border-red-500" : ""}
                                                    />
                                                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="phone">رقم الهاتف *</Label>
                                                    <Input
                                                        id="phone"
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={(e) => handleInputChange("phone", e.target.value)}
                                                        placeholder="01012345678"
                                                        className={errors.phone ? "border-red-500" : ""}
                                                    />
                                                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="nationalID">الرقم القومي *</Label>
                                                    <Input
                                                        id="nationalID"
                                                        type="text"
                                                        value={formData.nationalID}
                                                        onChange={(e) => handleInputChange("nationalID", e.target.value)}
                                                        placeholder="12345678901234"
                                                        maxLength="14"
                                                        className={errors.nationalID ? "border-red-500" : ""}
                                                    />
                                                    {errors.nationalID && <p className="text-sm text-red-500">{errors.nationalID}</p>}
                                                </div>

                                                <div className="space-y-2 md:col-span-2">
                                                    <Label htmlFor="governorate">المحافظة *</Label>
                                                    <Select
                                                        value={formData.governorate}
                                                        onValueChange={(value) => handleInputChange("governorate", value)}
                                                    >
                                                        <SelectTrigger className={errors.governorate ? "border-red-500" : ""}>
                                                            <SelectValue placeholder="اختر المحافظة" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {EGYPT_GOVERNORATES.map((gov) => (
                                                                <SelectItem key={gov} value={gov}>
                                                                    {gov}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.governorate && <p className="text-sm text-red-500">{errors.governorate}</p>}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Membership Information */}
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                                                <Crown className="w-5 h-5" />
                                                بيانات العضوية
                                            </h3>

                                            <div className="space-y-4">
                                                <div className="space-y-3">
                                                    <Label>نوع العضوية المطلوب *</Label>
                                                    <RadioGroup
                                                        // value={formData.role}
                                                        onValueChange={(value) => handleInputChange("role", value)}
                                                        className="flex gap-6 justify-end"
                                                    >
                                                        <div className="flex items-center gap-2 space-x-2 space-x-reverse">
                                                            <RadioGroupItem value="member" id="member" />
                                                            <Label htmlFor="member">عضو</Label>
                                                        </div>
                                                        <div className="flex items-center gap-2 space-x-2 space-x-reverse">
                                                            <RadioGroupItem value="volunteer" id="volunteer" />
                                                            <Label htmlFor="volunteer">متطوع</Label>
                                                        </div>
                                                    </RadioGroup>
                                                    {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* <div className="space-y-2">
                                                    <Label htmlFor="position">المنصب المرغوب (اختياري)</Label>
                                                    <Select value={formData.position} onValueChange={(value) => handleInputChange("position", value)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="اختر المنصب" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {positions.map((position) => (
                                                                <SelectItem key={position._id} value={position._id}>
                                                                    {position.title}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div> */}

                                                    <div className="space-y-2">
                                                        <Label htmlFor="membershipNumber">رقم العضوية السابق (اختياري)</Label>
                                                        <Input
                                                            id="membershipNumber"
                                                            type="text"
                                                            value={formData.membershipNumber}
                                                            onChange={(e) => handleInputChange("membershipNumber", e.target.value)}
                                                            placeholder="TM-2025-001"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Additional Notes */}
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                                                <FileText className="w-5 h-5" />
                                                معلومات إضافية
                                            </h3>

                                            <div className="space-y-2">
                                                <Label htmlFor="notes">ملاحظات أو رسالة شخصية (اختياري)</Label>
                                                <Textarea
                                                    id="notes"
                                                    value={formData.notes}
                                                    onChange={(e) => handleInputChange("notes", e.target.value)}
                                                    placeholder="أخبرنا عن دوافعك للانضمام، خبراتك السابقة، أو أي معلومات تراها مهمة..."
                                                    rows="4"
                                                />
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <div className="pt-6">
                                            <Button
                                                type="submit"
                                                className="w-full bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))] hover:opacity-90 text-lg py-6"
                                                disabled={loading}
                                            >
                                                {loading ? "جاري الإرسال..." : "إرسال طلب الانضمام"}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Information Cards */}
                            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                                <Card className="text-center">
                                    <CardContent className="p-8">
                                        <Mail className="w-12 h-12 mx-auto mb-4 text-egypt-red" />
                                        <h3 className="text-lg font-bold mb-2">تأكيد سريع</h3>
                                        <p className="text-muted-foreground">ستحصل على بريد تأكيد خلال 24 ساعة</p>
                                    </CardContent>
                                </Card>

                                <Card className="text-center">
                                    <CardContent className="p-8">
                                        <Users className="w-12 h-12 mx-auto mb-4 text-egypt-red" />
                                        <h3 className="text-lg font-bold mb-2">مراجعة دقيقة</h3>
                                        <p className="text-muted-foreground">فريق متخصص يراجع كل طلب بعناية</p>
                                    </CardContent>
                                </Card>

                                <Card className="text-center">
                                    <CardContent className="p-8">
                                        <CheckCircle className="w-12 h-12 mx-auto mb-4 text-egypt-red" />
                                        <h3 className="text-lg font-bold mb-2">رد سريع</h3>
                                        <p className="text-muted-foreground">رد نهائي خلال 5 أيام عمل كحد أقصى</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default JoinRequestPage
