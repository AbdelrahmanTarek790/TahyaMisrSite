import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../../components/ui/sheet"
import { useError } from "../../context/ErrorContext"
import { usersAPI, positionsAPI } from "../../api"
import { Search, Edit, Trash2, Eye, UserPlus, Shield, User, Filter, Download } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { EGYPT_GOVERNORATES } from "../../constants/governorates"
import { getImageUrl } from "../../constants/api"
import { getInitials } from "../../lib/utils"

// Backend User model validation schema
const userSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
    phone: z.string().min(1, "Phone number is required"),
    university: z.string().min(2, "University must be at least 2 characters"),
    nationalId: z.string().min(1, "National ID is required"),
    governorate: z.string().min(1, "Governorate is required"),
    position: z.string().optional(),
    membershipNumber: z.string().optional(),
    membershipExpiry: z.string().optional(),
    role: z.enum(["student", "volunteer", "admin"]),
})

const createUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.string().min(1, "Phone number is required"),
    university: z.string().min(2, "University must be at least 2 characters"),
    nationalId: z.string().min(1, "National ID is required"),
    governorate: z.string().min(1, "Governorate is required"),
    position: z.string().optional(),
    membershipNumber: z.string().optional(),
    membershipExpiry: z.string().optional(),
    role: z.enum(["student", "volunteer", "admin"]),
})

const UserManagement = () => {
    const [users, setUsers] = useState([])
    const [positions, setPositions] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterRole, setFilterRole] = useState("all")
    const [filterGovernorate, setFilterGovernorate] = useState("all")
    const [filterUniversity, setFilterUniversity] = useState("all")
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 })
    const { addError } = useError()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(userSchema),
    })

    const {
        register: registerCreate,
        handleSubmit: handleSubmitCreate,
        reset: resetCreate,
        formState: { errors: errorsCreate },
    } = useForm({
        resolver: zodResolver(createUserSchema),
    })

    useEffect(() => {
        fetchUsers()
        fetchPositions()
    }, [pagination.page])

    const fetchUsers = async () => {
        try {
            setIsLoading(true)
            const response = await usersAPI.getAll({
                page: pagination.page,
                limit: pagination.limit,
            })
            setUsers(response.data?.users || [])
            setPagination((prev) => ({
                ...prev,
                total: response.data?.total || 0,
            }))
        } catch (error) {
            addError("Failed to fetch users")
        } finally {
            setIsLoading(false)
        }
    }

    const fetchPositions = async () => {
        try {
            const response = await positionsAPI.getAll()
            setPositions(response.data || [])
        } catch (error) {
            // Positions might not be available, don't show error
            console.warn("Failed to fetch positions:", error)
        }
    }

    const handleDeleteUser = async (userId) => {
        if (!confirm("Are you sure you want to delete this user?")) return

        try {
            await usersAPI.delete(userId)
            addError("User deleted successfully!", "success")
            fetchUsers()
        } catch (error) {
            addError("Failed to delete user")
        }
    }

    const handleRoleChange = async (userId, newRole) => {
        try {
            await usersAPI.update(userId, { role: newRole })
            addError("User role updated successfully!", "success")
            fetchUsers()
        } catch (error) {
            addError("Failed to update user role")
        }
    }

    const handleEdit = (user) => {
        setEditingUser(user)
        reset({
            name: user.name,
            email: user.email,
            phone: user.phone || "",
            university: user.university,
            nationalId: user.nationalId || "",
            governorate: user.governorate,
            position: user.position?._id || "",
            membershipNumber: user.membershipNumber || "",
            membershipExpiry: user.membershipExpiry ? new Date(user.membershipExpiry).toISOString().split("T")[0] : "",
            role: user.role,
        })
        setIsSheetOpen(true)
    }

    const onSubmit = async (data) => {
        try {
            setIsLoading(true)

            // Convert membershipExpiry to proper date format if provided
            const submitData = {
                ...data,
                membershipExpiry: data.membershipExpiry ? new Date(data.membershipExpiry).toISOString() : undefined,
                position: data.position || undefined, // Don't send empty string
              
            }

            // Remove undefined fields
            Object.keys(submitData).forEach((key) => {
                if (submitData[key] === undefined || submitData[key] === "") {
                    delete submitData[key]
                }
            })

            await usersAPI.update(editingUser._id, submitData)
            addError("User updated successfully!", "success")
            setIsSheetOpen(false)
            setEditingUser(null)
            reset()
            fetchUsers()
        } catch (error) {
            addError(error.message || "Failed to update user")
        } finally {
            setIsLoading(false)
        }
    }

    const onCreateSubmit = async (data) => {
        try {
            setIsLoading(true)

            // Convert membershipExpiry to proper date format if provided
            const submitData = {
                ...data,
                membershipExpiry: data.membershipExpiry ? new Date(data.membershipExpiry).toISOString() : undefined,
                position: data.position || undefined, // Don't send empty string
            }

            // Remove undefined fields
            Object.keys(submitData).forEach((key) => {
                if (submitData[key] === undefined || submitData[key] === "") {
                    delete submitData[key]
                }
            })

            await usersAPI.create(submitData)
            addError("User created successfully!", "success")
            setIsCreateSheetOpen(false)
            resetCreate()
            fetchUsers()
        } catch (error) {
            addError(error.message || "Failed to create user")
        } finally {
            setIsLoading(false)
        }
    }

    const handleCloseSheet = () => {
        setIsSheetOpen(false)
        setEditingUser(null)
        reset()
    }

    const handleCloseCreateSheet = () => {
        setIsCreateSheetOpen(false)
        resetCreate()
    }

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.governorate.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.nationalId && user.nationalId.includes(searchTerm)) ||
            (user.membershipNumber && user.membershipNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.phone && user.phone.includes(searchTerm))

        const matchesRole = filterRole === "all" || user.role === filterRole
        const matchesGovernorate = filterGovernorate === "all" || user.governorate === filterGovernorate
        const matchesUniversity = filterUniversity === "all" || user.university === filterUniversity

        return matchesSearch && matchesRole && matchesGovernorate && matchesUniversity
    })

    // Get unique universities for filter
    const uniqueUniversities = [...new Set(users.map((user) => user.university).filter(Boolean))]

    // Clear filters function
    const clearFilters = () => {
        setSearchTerm("")
        setFilterRole("all")
        setFilterGovernorate("all")
        setFilterUniversity("all")
    }

    // Export CSV function
    const exportCSV = () => {
        // Use filtered users for export
        const dataToExport = filteredUsers.map(user => ({
            'Full Name': user.name,
            'Email': user.email,
            'Phone': user.phone || 'N/A',
            'National ID': user.nationalId || 'N/A',
            'University': user.university,
            'Governorate': user.governorate,
            'Role': user.role,
            'Position': user.position?.name || 'N/A',
            'Membership Number': user.membershipNumber || 'N/A',
            'Membership Expiry': user.membershipExpiry 
                ? new Date(user.membershipExpiry).toLocaleDateString() 
                : 'N/A',
            'Joined Date': new Date(user.createdAt).toLocaleDateString()
        }))

        // Convert to CSV
        const headers = Object.keys(dataToExport[0] || {})
        const csvContent = [
            headers.join(','),
            ...dataToExport.map(row => 
                headers.map(header => 
                    `"${(row[header] || '').toString().replace(/"/g, '""')}"`
                ).join(',')
            )
        ].join('\n')

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        
        // Generate filename with current date and filter info
        const today = new Date().toISOString().split('T')[0]
        let filename = `users_export_${today}`
        
        if (filterRole !== 'all') filename += `_${filterRole}`
        if (filterGovernorate !== 'all') filename += `_${filterGovernorate.replace(/\s+/g, '_')}`
        if (searchTerm) filename += '_filtered'
        
        link.setAttribute('download', `${filename}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        addError(`Exported ${filteredUsers.length} users to CSV`, 'success')
    }

    const getRoleIcon = (role) => {
        switch (role) {
            case "admin":
                return <Shield className="h-4 w-4 text-red-500" />
            case "volunteer":
                return <UserPlus className="h-4 w-4 text-blue-500" />
            default:
                return <User className="h-4 w-4 text-green-500" />
        }
    }

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case "admin":
                return "bg-red-100 text-red-800"
            case "volunteer":
                return "bg-blue-100 text-blue-800"
            default:
                return "bg-green-100 text-green-800"
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600">Manage users and their roles</p>
                </div>
                <div className="flex gap-2">
                    <Button 
                        onClick={exportCSV} 
                        variant="outline" 
                        disabled={filteredUsers.length === 0}
                        className="flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Export CSV ({filteredUsers.length})
                    </Button>
                    <Button onClick={() => setIsCreateSheetOpen(true)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Create User
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        type="text"
                        placeholder="Search users (name, email, university, national ID, membership, phone)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    <option value="all">All Roles</option>
                    <option value="student">Students</option>
                    <option value="volunteer">Volunteers</option>
                    <option value="admin">Admins</option>
                </select>
                <select
                    value={filterGovernorate}
                    onChange={(e) => setFilterGovernorate(e.target.value)}
                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    <option value="all">All Governorates</option>
                    {EGYPT_GOVERNORATES.map((governorate) => (
                        <option key={governorate} value={governorate}>
                            {governorate}
                        </option>
                    ))}
                </select>
                <select
                    value={filterUniversity}
                    onChange={(e) => setFilterUniversity(e.target.value)}
                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    <option value="all">All Universities</option>
                    {uniqueUniversities.map((university) => (
                        <option key={university} value={university}>
                            {university}
                        </option>
                    ))}
                </select>
                <Button variant="outline" onClick={clearFilters}>
                    <Filter className="h-4 w-4 mr-2" />
                    Clear
                </Button>
            </div>

            {/* Users Table */}
            {isLoading && users.length === 0 ? (
                <Card>
                    <CardContent className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </CardContent>
                </Card>
            ) : filteredUsers.length === 0 ? (
                <Card>
                    <CardContent className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchTerm || filterRole !== "all" || filterGovernorate !== "all" || filterUniversity !== "all"
                                    ? "No users found"
                                    : "No users available"}
                            </h3>
                            <p className="text-gray-600">
                                {searchTerm || filterRole !== "all" || filterGovernorate !== "all" || filterUniversity !== "all"
                                    ? "Try adjusting your search or filter criteria"
                                    : "Users will appear here once they register"}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Users ({filteredUsers.length})</CardTitle>
                        <CardDescription>Manage user accounts and permissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left pb-3 font-medium">User</th>
                                        <th className="text-left pb-3 font-medium">Role</th>
                                        <th className="text-left pb-3 font-medium">University</th>
                                        <th className="text-left pb-3 font-medium">Governorate</th>
                                        <th className="text-left pb-3 font-medium">National ID</th>
                                        <th className="text-left pb-3 font-medium">Position</th>
                                        <th className="text-left pb-3 font-medium">Membership</th>
                                        <th className="text-left pb-3 font-medium">Joined</th>
                                        <th className="text-left pb-3 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user._id} className="border-b">
                                            <td className="py-4">
                                                <div className="flex items-center space-x-3">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage 
                                                            src={getImageUrl(user?.profileImage)} 
                                                            alt={user?.name || "User"} 
                                                        />
                                                        <AvatarFallback>
                                                            {user?.name ? getInitials(user.name) : "U"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">{user.name}</div>
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                        <div className="text-xs text-gray-400">{user.phone}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center space-x-2">
                                                    {getRoleIcon(user.role)}
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getRoleBadgeColor(
                                                            user.role
                                                        )}`}
                                                    >
                                                        {user.role}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 text-sm">{user.university}</td>
                                            <td className="py-4 text-sm">{user.governorate}</td>
                                            <td className="py-4 text-sm font-mono">{user.nationalId}</td>
                                            <td className="py-4 text-sm">{user.position?.name || "N/A"}</td>
                                            <td className="py-4 text-sm">
                                                <div>
                                                    <div>{user.membershipNumber || "N/A"}</div>
                                                    {user.membershipExpiry && (
                                                        <div className="text-xs text-gray-400">
                                                            Expires: {new Date(user.membershipExpiry).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                                            <td className="py-4">
                                                <div className="flex space-x-2">
                                                    <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                        className="text-xs rounded border border-gray-300 px-2 py-1"
                                                    >
                                                        <option value="student">Student</option>
                                                        <option value="volunteer">Volunteer</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                    <Button variant="outline" size="sm" onClick={() => handleDeleteUser(user._id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Pagination */}
            {pagination.total > pagination.limit && !searchTerm && filterRole === "all" && (
                <div className="flex justify-center space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page === 1 || isLoading}
                    >
                        Previous
                    </Button>
                    <span className="flex items-center px-4">
                        Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                        disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit) || isLoading}
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* Edit User Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="w-[600px] sm:max-w-[600px]">
                    <SheetHeader>
                        <SheetTitle>Edit User</SheetTitle>
                    </SheetHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6 px-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                            <Input {...register("name")} placeholder="Enter full name" />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <Input {...register("email")} type="email" disabled placeholder="Enter email address" />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                <Input {...register("phone")} placeholder="Enter phone number" />
                                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">National ID *</label>
                                <Input {...register("nationalId")} placeholder="Enter national ID" />
                                {errors.nationalId && <p className="text-red-500 text-sm mt-1">{errors.nationalId.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">University *</label>
                                <Input {...register("university")} placeholder="Enter university" />
                                {errors.university && <p className="text-red-500 text-sm mt-1">{errors.university.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Governorate *</label>
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
                                {errors.governorate && <p className="text-red-500 text-sm mt-1">{errors.governorate.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                                <select {...register("role")} className="w-full p-2 border border-gray-300 rounded-md">
                                    <option value="student">Student</option>
                                    <option value="volunteer">Volunteer</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                                <select
                                    {...register("position")}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    <option value="">Select Position</option>
                                    {positions.map((position) => (
                                        <option key={position._id} value={position._id}>
                                            {position.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Membership Number</label>
                                <Input {...register("membershipNumber")} placeholder="Enter membership number" />
                                {errors.membershipNumber && <p className="text-red-500 text-sm mt-1">{errors.membershipNumber.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Membership Expiry</label>
                                <Input {...register("membershipExpiry")} type="date" placeholder="Select expiry date" />
                                {errors.membershipExpiry && <p className="text-red-500 text-sm mt-1">{errors.membershipExpiry.message}</p>}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={handleCloseSheet}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Updating..." : "Update User"}
                            </Button>
                        </div>
                    </form>
                </SheetContent>
            </Sheet>

            {/* Create User Sheet */}
            <Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
                <SheetContent className="w-[600px] sm:max-w-[600px]">
                    <SheetHeader>
                        <SheetTitle>Create New User</SheetTitle>
                    </SheetHeader>
                    <form onSubmit={handleSubmitCreate(onCreateSubmit)} className="space-y-4 mt-6 px-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                            <Input {...registerCreate("name")} placeholder="Enter full name" />
                            {errorsCreate.name && <p className="text-red-500 text-sm mt-1">{errorsCreate.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <Input {...registerCreate("email")} type="email" placeholder="Enter email address" />
                            {errorsCreate.email && <p className="text-red-500 text-sm mt-1">{errorsCreate.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                            <Input {...registerCreate("password")} type="password" placeholder="Enter password" />
                            {errorsCreate.password && <p className="text-red-500 text-sm mt-1">{errorsCreate.password.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                <Input {...registerCreate("phone")} placeholder="Enter phone number" />
                                {errorsCreate.phone && <p className="text-red-500 text-sm mt-1">{errorsCreate.phone.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">National ID *</label>
                                <Input {...registerCreate("nationalId")} placeholder="Enter national ID" />
                                {errorsCreate.nationalId && <p className="text-red-500 text-sm mt-1">{errorsCreate.nationalId.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">University *</label>
                                <Input {...registerCreate("university")} placeholder="Enter university" />
                                {errorsCreate.university && <p className="text-red-500 text-sm mt-1">{errorsCreate.university.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Governorate *</label>
                                <select
                                    {...registerCreate("governorate")}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    <option value="">Select Governorate</option>
                                    {EGYPT_GOVERNORATES.map((governorate) => (
                                        <option key={governorate} value={governorate}>
                                            {governorate}
                                        </option>
                                    ))}
                                </select>
                                {errorsCreate.governorate && <p className="text-red-500 text-sm mt-1">{errorsCreate.governorate.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                                <select {...registerCreate("role")} className="w-full p-2 border border-gray-300 rounded-md">
                                    <option value="student">Student</option>
                                    <option value="volunteer">Volunteer</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {errorsCreate.role && <p className="text-red-500 text-sm mt-1">{errorsCreate.role.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                                <select
                                    {...registerCreate("position")}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    <option value="">Select Position</option>
                                    {positions.map((position) => (
                                        <option key={position._id} value={position._id}>
                                            {position.name}
                                        </option>
                                    ))}
                                </select>
                                {errorsCreate.position && <p className="text-red-500 text-sm mt-1">{errorsCreate.position.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Membership Number</label>
                                <Input {...registerCreate("membershipNumber")} placeholder="Enter membership number" />
                                {errorsCreate.membershipNumber && (
                                    <p className="text-red-500 text-sm mt-1">{errorsCreate.membershipNumber.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Membership Expiry</label>
                                <Input {...registerCreate("membershipExpiry")} type="date" placeholder="Select expiry date" />
                                {errorsCreate.membershipExpiry && (
                                    <p className="text-red-500 text-sm mt-1">{errorsCreate.membershipExpiry.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={handleCloseCreateSheet}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Creating..." : "Create User"}
                            </Button>
                        </div>
                    </form>
                </SheetContent>
            </Sheet>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.filter((u) => u.role === "student").length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Volunteers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.filter((u) => u.role === "volunteer").length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.filter((u) => u.role === "admin").length}</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default UserManagement
