import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { useAuth } from "../../context/AuthContext"
import { useError } from "../../context/ErrorContext"

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

const Login = () => {
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()
    const { addError } = useError()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data) => {
        try {
            setIsLoading(true)
            await login(data)
            navigate("/dashboard")
        } catch (error) {
            addError(error?.error || "Login failed. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        اتحاد شباب تحيا مصر
                    </h1>
                    <p className="mt-2 text-gray-600">
                        أهلاً بك مرة أخرى! الرجاء تسجيل الدخول إلى حسابك.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>تسجيل الدخول إلى حسابك</CardTitle>
                        <CardDescription>أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى حسابك</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    البريد الإلكتروني
                                </label>
                                <Input id="email" type="email" placeholder="أدخل بريدك الإلكتروني" {...register("email")} />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    كلمة المرور
                                </label>
                                <Input id="password" type="password" placeholder="أدخل كلمة المرور الخاصة بك" {...register("password")} />
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                            </div>

                            <div className="flex items-center justify-between">
                                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                                    هل نسيت كلمة المرور؟
                                </Link>
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "تسجيل الدخول..." : "تسجيل الدخول"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                لا تملك حسابًا؟{" "}
                                <Link to="/register" className="text-primary hover:underline">
                                    سجل الآن
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Login
