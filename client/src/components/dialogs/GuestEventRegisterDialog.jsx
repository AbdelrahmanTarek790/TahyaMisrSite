import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { EGYPT_GOVERNORATES } from "@/constants/governorates"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

const GuestEventRegisterDialog = ({ open, onOpenChange, onSubmit, loading }) => {
    const [form, setForm] = useState({ name: "", email: "", phone: "", nationalId: "", governorate: "" })
    const [errors, setErrors] = useState({})

    const validate = () => {
        const errs = {}
        if (!form.name || form.name.trim().length < 2) errs.name = "الاسم مطلوب"
        if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "بريد إلكتروني غير صالح"
        if (form.phone && form.phone.length < 7) errs.phone = "رقم غير صالح"
        if (form.nationalId && form.nationalId.length !== 14) errs.nationalId = "الرقم القومي يجب أن يكون 14 رقمًا"
        if (form.governorate && form.governorate.trim().length < 2) errs.governorate = "المحافظة غير صالحة"
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return
        await onSubmit(form, () => setForm({ name: "", email: "", phone: "", nationalId: "", governorate: "" }))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-arabic text-right">التسجيل كضيف</DialogTitle>
                    <DialogDescription className="font-arabic text-right">أدخل بياناتك للتسجيل في الفعالية دون إنشاء حساب.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-2 text-right">
                        <Label htmlFor="name" className="font-arabic">
                            الاسم الكامل
                        </Label>
                        <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="الاسم" />
                        {errors.name && <p className="text-xs text-red-600 font-arabic">{errors.name}</p>}
                    </div>
                    <div className="grid gap-2 text-right">
                        <Label htmlFor="email" className="font-arabic">
                            البريد الإلكتروني
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="email@example.com"
                        />
                        {errors.email && <p className="text-xs text-red-600 font-arabic">{errors.email}</p>}
                    </div>
                    <div className="grid gap-2 text-right">
                        <Label htmlFor="phone" className="font-arabic">
                            رقم الهاتف (اختياري)
                        </Label>
                        <Input
                            id="phone"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            placeholder="01XXXXXXXXX"
                        />
                        {errors.phone && <p className="text-xs text-red-600 font-arabic">{errors.phone}</p>}
                    </div>
                    <div className="grid gap-2 text-right">
                        <Label htmlFor="nationalId" className="font-arabic">
                            الرقم القومي (اختياري)
                        </Label>
                        <Input
                            id="nationalId"
                            value={form.nationalId}
                            onChange={(e) => setForm({ ...form, nationalId: e.target.value })}
                            placeholder="14 رقمًا"
                        />
                        {errors.nationalId && <p className="text-xs text-red-600 font-arabic">{errors.nationalId}</p>}
                    </div>
                    <div className="grid gap-2 text-right">
                        <Label htmlFor="governorate" className="font-arabic">
                            المحافظة (اختياري)
                        </Label>
                        <Select value={form.governorate} onValueChange={(value) => setForm({ ...form, governorate: value })}>
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
                        {errors.governorate && <p className="text-xs text-red-600 font-arabic">{errors.governorate}</p>}
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="font-arabic">
                            إلغاء
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-egypt-red hover:bg-egypt-red/90 text-white font-arabic">
                            {loading ? "جاري التسجيل..." : "تسجيل"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default GuestEventRegisterDialog
