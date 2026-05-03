import RoleGuard from "@/components/auth/RoleGuard"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { LocalizationProvider } from "@/hooks/useLocalization.jsx"
import { ErrorProvider } from "@/context/ErrorContext"

export default function AdminLayout({ children }) {
    return (
        <LocalizationProvider>
            <ErrorProvider>
                <RoleGuard allowedRoles={["admin", "publisher"]}>
                    <DashboardLayout>{children}</DashboardLayout>
                </RoleGuard>
            </ErrorProvider>
        </LocalizationProvider>
    )
}
