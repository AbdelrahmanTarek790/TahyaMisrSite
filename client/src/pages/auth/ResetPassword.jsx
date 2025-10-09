import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authAPI } from "@/api"
import { useError } from "@/context/ErrorContext"
import { useNavigate, useSearchParams } from "react-router-dom"

const schema = z.object({
    token: z.string().min(10, "رمز غير صالح"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
})

export default function ResetPassword() {
    const [isLoading, setIsLoading] = useState(false)
    const { addError } = useError()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const initialToken = searchParams.get("token") || ""
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(schema), defaultValues: { token: initialToken } })

    const onSubmit = async ({ token, password }) => {
        try {
            setIsLoading(true)
            const res = await authAPI.resetPassword(token, password)
            addError("تم تحديث كلمة المرور بنجاح", "success")
            // Optionally save token/user and redirect
            if (res?.data?.token) {
                localStorage.setItem("token", res.data.token)
                localStorage.setItem("user", JSON.stringify(res.data.user))
            }
            navigate("/dashboard")
        } catch (e) {
            addError(e?.error || "تعذر إعادة تعيين كلمة المرور")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full">
                <Card>
                    <CardHeader>
                        <CardTitle>إعادة تعيين كلمة المرور</CardTitle>
                        <CardDescription>أدخل الرمز الذي وصلك عبر البريد الإلكتروني وكلمة المرور الجديدة</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">رمز إعادة التعيين</label>
                                <Input placeholder="أدخل الرمز" {...register("token")} />
                                {errors.token && <p className="text-sm text-red-600 mt-1">{errors.token.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">كلمة المرور الجديدة</label>
                                <Input type="password" placeholder="********" {...register("password")} />
                                {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
                            </div>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "تحديث..." : "تحديث كلمة المرور"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
