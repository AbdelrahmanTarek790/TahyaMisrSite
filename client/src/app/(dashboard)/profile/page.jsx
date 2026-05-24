"use client"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/AuthContext"
import { useError } from "@/context/ErrorContext"
import { usersAPI, customFieldsAPI } from "@/app/api/api"
import { User, Mail, University, MapPin, Phone, Calendar, Edit, Camera } from "lucide-react"
import CropEasy from "@/components/dialogs/CropEasy"

import { getInitials } from "@/lib/utils"
import { EGYPT_GOVERNORATES } from "@/constants/governorates"

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    university: z.string().min(2, "University must be at least 2 characters"),
    governorate: z.string().min(2, "Governorate must be at least 2 characters"),
    nationalId: z.string().length(14, "National ID must be exactly 14 digits").optional().or(z.literal("")),
})

const Profile = () => {
    const { user, updateUser } = useAuth()
    const { addError } = useError()
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [openCrop, setOpenCrop] = useState(false)
    const [photoURL, setPhotoURL] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [customFields, setCustomFields] = useState([])
    const [dynamicValues, setDynamicValues] = useState({})
    const [isDynamicDirty, setIsDynamicDirty] = useState(false)

    const uploadsBase =
        (window.location.origin.includes("localhost")
            ? import.meta.env?.VITE_API_BASE?.replace(/\/api\/v1$/, "") || ""
            : "https://tmbackend.tahyamisryu.com") + "/uploads/"

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
            university: user?.university || "",
            governorate: user?.governorate || "",
            nationalId: user?.nationalId || "",
        },
    })

    useEffect(() => {
        const loadCustomFields = async () => {
            try {
                const res = await customFieldsAPI.getAll({ status: "active" })
                setCustomFields(res.data || [])
            } catch (err) {
                console.error("Failed to load custom fields", err)
            }
        }
        loadCustomFields()
    }, [])

    useEffect(() => {
        if (user) {
            reset({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                university: user.university || "",
                governorate: user.governorate || "",
                nationalId: user.nationalId || "",
            })
            const initialDynamics = {}
            if (user.customFieldValues && Array.isArray(user.customFieldValues)) {
                user.customFieldValues.forEach(cfv => {
                    const fieldId = typeof cfv.fieldId === 'object' && cfv.fieldId ? cfv.fieldId._id : cfv.fieldId
                    if (fieldId) {
                        initialDynamics[fieldId] = cfv.value || ""
                    }
                })
            }
            setDynamicValues(initialDynamics)
            setIsDynamicDirty(false)
        }
    }, [user, reset])

    const handleDynamicChange = (fieldId, val) => {
        setDynamicValues(prev => ({
            ...prev,
            [fieldId]: val
        }))
        setIsDynamicDirty(true)
    }

    const onSubmit = async (data) => {
        try {
            setIsLoading(true)
            const submitData = {
                ...data,
                customFieldValues: Object.entries(dynamicValues).map(([fieldId, value]) => ({
                    fieldId,
                    value
                }))
            }
            const response = await usersAPI.updateMe(submitData)
            updateUser(response.data.user)
            addError("Profile updated successfully!", "success")
            setIsEditing(false)
            setIsDynamicDirty(false)
        } catch (error) {
            addError(error.message || "Failed to update profile")
        } finally {
            setIsLoading(false)
        }
    }

    const handleChooseImage = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        const url = URL.createObjectURL(file)
        setPhotoURL(url)
        setOpenCrop(true)
        // reset input value to allow same file re-select later
        e.target.value = ""
    }

    const handleCropped = async ({ file, url }) => {
        try {
            setUploading(true)
            const form = new FormData()
            form.append("profileImage", file)
            // allow sending basic fields too if needed
            const res = await fetch(`${import.meta.env?.VITE_API_BASE || "https://tmbackend.tahyamisryu.com/api/v1"}/users/me`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                },
                body: form,
            })
            if (!res.ok) throw new Error("Failed to upload image")
            const json = await res.json()
            updateUser(json.data.user)
            setPhotoURL(null)
        } catch (err) {
            addError(err.message || "Failed to upload image")
        } finally {
            setUploading(false)
        }
    }

    const handleCancel = () => {
        reset()
        const initialDynamics = {}
        if (user && user.customFieldValues && Array.isArray(user.customFieldValues)) {
            user.customFieldValues.forEach(cfv => {
                const fieldId = typeof cfv.fieldId === 'object' && cfv.fieldId ? cfv.fieldId._id : cfv.fieldId
                if (fieldId) {
                    initialDynamics[fieldId] = cfv.value || ""
                }
            })
        }
        setDynamicValues(initialDynamics)
        setIsDynamicDirty(false)
        setIsEditing(false)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                <p className="text-gray-600">Manage your account information</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Picture & Basic Info */}
                <Card>
                    <CardHeader className="text-center">
                        <Avatar className="h-24 w-24 mx-auto relative">
                            <AvatarImage
                                src={user?.profileImage ? `https://tmbackend.tahyamisryu.com/uploads/${user.profileImage}` : undefined}
                                alt={user?.name || "User"}
                            />
                            <AvatarFallback className="text-2xl">{user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
                            <label className="absolute bottom-2 right-2 bg-white rounded-full shadow p-2 cursor-pointer">
                                <input type="file" accept="image/*" className="hidden" onChange={handleChooseImage} />
                                <Camera className="h-4 w-4" />
                            </label>
                        </Avatar>
                        <CardTitle>{user?.name}</CardTitle>
                        <CardDescription className="flex items-center justify-center gap-1">
                            {user?.role === "admin" && <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Admin</span>}
                            {user?.role === "volunteer" && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Volunteer</span>
                            )}
                            {user?.role === "student" && <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Student</span>}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4" />
                            <span>{user?.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <University className="h-4 w-4" />
                            <span>{user?.university}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{user?.governorate}</span>
                        </div>
                        {user?.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="h-4 w-4" />
                                <span>{user.phone}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>Joined {new Date(user?.createdAt).toLocaleDateString()}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Edit Profile Form */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your account details</CardDescription>
                        </div>
                        {!isEditing && (
                            <Button onClick={() => setIsEditing(true)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Profile
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <Input {...register("name")} disabled={!isEditing} placeholder="Enter your full name" />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <Input {...register("email")} disabled={!isEditing} type="email" placeholder="Enter your email" />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <Input {...register("phone")} disabled={!isEditing} placeholder="Enter your phone number" />
                                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                                    <Input {...register("university")} disabled={!isEditing} placeholder="Enter your university" />
                                    {errors.university && <p className="text-red-500 text-sm mt-1">{errors.university.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Governorate</label>
                                    {isEditing ? (
                                        <select
                                            {...register("governorate")}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        >
                                            <option value="">Select Governorate</option>
                                            {EGYPT_GOVERNORATES.map((governorate) => (
                                                <option key={governorate} value={governorate}>
                                                    {governorate}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <Input {...register("governorate")} disabled={!isEditing} placeholder="Enter your governorate" />
                                    )}
                                    {errors.governorate && <p className="text-red-500 text-sm mt-1">{errors.governorate.message}</p>}
                                </div>


                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">National ID</label>
                                    <Input {...register("nationalId")} disabled={!isEditing} placeholder="Enter 14-digit National ID" />
                                    {errors.nationalId && <p className="text-red-500 text-sm mt-1">{errors.nationalId.message}</p>}
                                </div>

                                {customFields.map((field) => (
                                    <div key={field._id} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                                        {field.type === "textarea" ? (
                                            <textarea
                                                value={dynamicValues[field._id] || ""}
                                                disabled={!isEditing}
                                                onChange={(e) => handleDynamicChange(field._id, e.target.value)}
                                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder={`Enter ${field.label}`}
                                            />
                                        ) : (
                                            <Input
                                                type={field.type === "number" ? "number" : field.type === "email" ? "email" : "text"}
                                                value={dynamicValues[field._id] || ""}
                                                disabled={!isEditing}
                                                onChange={(e) => handleDynamicChange(field._id, e.target.value)}
                                                placeholder={`Enter ${field.label}`}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {isEditing && (
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button type="button" variant="outline" onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isLoading || (!isDirty && !isDynamicDirty)}>
                                        {isLoading ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>
            <CropEasy photoURL={photoURL} open={openCrop} setOpen={setOpenCrop} onCropped={handleCropped} aspect={1} />
        </div>
    )
}

export default Profile
