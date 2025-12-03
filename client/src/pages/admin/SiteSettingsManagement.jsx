import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Settings, Save, Loader2 } from "lucide-react"
import { siteSettingsAPI } from "@/api"

export default function SiteSettingsManagement() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [settings, setSettings] = useState({
        joinRequestsEnabled: true,
        maintenanceMode: false,
        maintenanceMessage: "",
        joinRequestMessage: "",
    })

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            setLoading(true)
            const response = await siteSettingsAPI.getSettings()
            setSettings(response.data || response)
        } catch (error) {
            console.error("Error fetching settings:", error)
            toast.error("فشل تحميل الإعدادات")
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        try {
            setSaving(true)
            await siteSettingsAPI.updateSettings(settings)
            toast.success("تم حفظ الإعدادات بنجاح")
        } catch (error) {
            console.error("Error saving settings:", error)
            toast.error(error.error || "فشل حفظ الإعدادات")
        } finally {
            setSaving(false)
        }
    }

    const handleToggleJoinRequests = async () => {
        try {
            const response = await siteSettingsAPI.toggleJoinRequests()
            setSettings((prev) => ({
                ...prev,
                joinRequestsEnabled: response.data?.joinRequestsEnabled ?? response.joinRequestsEnabled,
            }))
            toast.success(response.data?.message || response.message || "تم تحديث حالة طلبات الانضمام")
        } catch (error) {
            console.error("Error toggling join requests:", error)
            toast.error("فشل تحديث حالة طلبات الانضمام")
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center gap-3">
                <Settings className="w-8 h-8 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold">إعدادات الموقع</h1>
                    <p className="text-muted-foreground">إدارة إعدادات الموقع العامة</p>
                </div>
            </div>

            {/* Join Requests Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>طلبات الانضمام</CardTitle>
                    <CardDescription>التحكم في قبول طلبات الانضمام الجديدة</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="joinRequests">تفعيل طلبات الانضمام</Label>
                            <p className="text-sm text-muted-foreground">السماح للمستخدمين بتقديم طلبات انضمام جديدة</p>
                        </div>
                        <Switch
                            id="joinRequests"
                            checked={settings.joinRequestsEnabled}
                            onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, joinRequestsEnabled: checked }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="joinRequestMessage">رسالة إغلاق طلبات الانضمام</Label>
                        <Textarea
                            id="joinRequestMessage"
                            placeholder="عذراً، التسجيل غير متاح حالياً"
                            value={settings.joinRequestMessage}
                            onChange={(e) => setSettings((prev) => ({ ...prev, joinRequestMessage: e.target.value }))}
                            rows={3}
                        />
                        <p className="text-sm text-muted-foreground">هذه الرسالة ستظهر للمستخدمين عند محاولة التسجيل والطلبات معطلة</p>
                    </div>

                    <Button onClick={handleToggleJoinRequests} variant="outline" className="w-full">
                        {settings.joinRequestsEnabled ? "إيقاف" : "تفعيل"} طلبات الانضمام
                    </Button>
                </CardContent>
            </Card>

            {/* Maintenance Mode Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>وضع الصيانة</CardTitle>
                    <CardDescription>تفعيل وضع الصيانة للموقع</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="maintenanceMode">تفعيل وضع الصيانة</Label>
                            <p className="text-sm text-muted-foreground">عرض رسالة صيانة للمستخدمين عند زيارة الموقع</p>
                        </div>
                        <Switch
                            id="maintenanceMode"
                            checked={settings.maintenanceMode}
                            onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, maintenanceMode: checked }))}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="maintenanceMessage">رسالة الصيانة</Label>
                        <Textarea
                            id="maintenanceMessage"
                            placeholder="الموقع تحت الصيانة حالياً"
                            value={settings.maintenanceMessage}
                            onChange={(e) => setSettings((prev) => ({ ...prev, maintenanceMessage: e.target.value }))}
                            rows={3}
                        />
                        <p className="text-sm text-muted-foreground">هذه الرسالة ستظهر للمستخدمين عند تفعيل وضع الصيانة</p>
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving} size="lg">
                    {saving ? (
                        <>
                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                            جاري الحفظ...
                        </>
                    ) : (
                        <>
                            <Save className="ml-2 h-4 w-4" />
                            حفظ الإعدادات
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
