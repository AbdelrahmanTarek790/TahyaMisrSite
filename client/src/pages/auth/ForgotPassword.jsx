import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authAPI } from "@/api"
import { useError } from "@/context/ErrorContext"

const schema = z.object({ email: z.string().email("الرجاء إدخال بريد إلكتروني صحيح") })

export default function ForgotPassword() {
    const [isLoading, setIsLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const { addError } = useError()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(schema) })

    const onSubmit = async ({ email }) => {
        try {
            setIsLoading(true)
            await authAPI.forgotPassword(email)
            setSent(true)
            addError("تم إرسال رسالة إعادة تعيين كلمة المرور إلى بريدك الإلكتروني", "success")
        } catch (e) {
            addError(e?.error || "تعذر إرسال رسالة إعادة التعيين")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full">
                <Card>
                    <CardHeader>
                        <CardTitle>نسيت كلمة المرور</CardTitle>
                        <CardDescription>أدخل بريدك الإلكتروني لإرسال رمز إعادة التعيين</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {sent ? (
                            <p className="text-green-600">تحقق من بريدك الإلكتروني للمتابعة.</p>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
                                    <Input type="email" placeholder="email@example.com" {...register("email")} />
                                    {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
                                </div>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "إرسال..." : "إرسال"}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
