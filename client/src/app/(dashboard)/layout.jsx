import AuthGuard from "@/components/auth/AuthGuard"
import { DashboardLayout } from "@/components/layout/DashboardLayout"

export default function DashboardGroupLayout({ children }) {
    return (
        <AuthGuard>
            <DashboardLayout>{children}</DashboardLayout>
        </AuthGuard>
    )
}
