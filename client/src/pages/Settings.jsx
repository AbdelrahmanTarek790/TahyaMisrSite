import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../context/AuthContext';
import { useError } from '../context/ErrorContext';
import { authAPI } from '../api';
import { Lock, Shield, Bell, Palette, Globe, Save } from 'lucide-react';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Settings = () => {
  const { user } = useAuth();
  const { addError } = useError();
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('security');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmitPassword = async (data) => {
    try {
      setIsLoading(true);
      await authAPI.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      addError('Password changed successfully!', 'success');
      reset();
    } catch (error) {
      addError(error.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const settingsSections = [
    { id: 'security', label: 'الأمان', icon: Shield },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'appearance', label: 'المظهر', icon: Palette },
    { id: 'language', label: 'اللغة', icon: Globe },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">الإعدادات</h1>
        <p className="text-gray-600">إدارة تفضيلات حسابك وأمانه</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">الإعدادات</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <nav className="space-y-1">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                      activeSection === section.id
                        ? 'bg-primary/10 text-primary border-r-2 border-primary'
                        : 'text-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Security Settings */}
          {activeSection === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  إعدادات الأمان
                </CardTitle>
                <CardDescription>
                  تحديث كلمة المرور الخاصة بك وإدارة تفضيلات الأمان
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      كلمة المرور الحالية
                    </label>
                    <Input
                      {...register('currentPassword')}
                      type="password"
                      placeholder="أدخل كلمة المرور الحالية"
                    />
                    {errors.currentPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.currentPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      كلمة المرور الجديدة
                    </label>
                    <Input
                      {...register('newPassword')}
                      type="password"
                      placeholder="أدخل كلمة المرور الجديدة"
                    />
                    {errors.newPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      تأكيد كلمة المرور الجديدة
                    </label>
                    <Input
                      {...register('confirmPassword')}
                      type="password"
                      placeholder="تأكيد كلمة المرور الجديدة"
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    {isLoading ? 'تغيير كلمة المرور...' : 'تغيير كلمة المرور'}
                  </Button>
                </form>

                <div className="mt-8 pt-6 border-t">
                  <h4 className="font-medium text-gray-900 mb-4">أمان الحساب</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">المصادقة الثنائية</p>
                        <p className="text-xs text-gray-500">إضافة طبقة أمان إضافية</p>
                      </div>
                      <Button variant="outline" size="sm" disabled>
                        تفعيل
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">إشعارات تسجيل الدخول</p>
                        <p className="text-xs text-gray-500">الحصول على إشعارات بتسجيل الدخول الجديد</p>
                      </div>
                      <Button variant="outline" size="sm" disabled>
                        إعداد
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications Settings */}
          {activeSection === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  تفضيلات الإشعارات
                </CardTitle>
                <CardDescription>
                  اختر الإشعارات التي تريد تلقيها
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">إشعارات البريد الإلكتروني</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">تحديثات الأخبار</p>
                          <p className="text-xs text-gray-500">الحصول على إشعارات حول المقالات الإخبارية الجديدة</p>
                        </div>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">تذكيرات الأحداث</p>
                          <p className="text-xs text-gray-500">الحصول على تذكيرات حول الأحداث القادمة</p>
                        </div>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">التقرير الأسبوعي</p>
                          <p className="text-xs text-gray-500">ملخص أسبوعي لنشاط المنصة</p>
                        </div>
                        <input type="checkbox" className="rounded" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">إشعارات </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">أعلانات مهمه</p>
                          <p className="text-xs text-gray-500">إعلانات مهمة على المنصة</p>
                        </div>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">تسجيلات الأحداث</p>
                          <p className="text-xs text-gray-500">تأكيد تسجيلات الأحداث</p>
                        </div>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Button className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    حفظ التفضيلات
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Appearance Settings */}
          {activeSection === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  المظهر
                </CardTitle>
                <CardDescription>
                  تخصيص مظهر لوحة القيادة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">
                      المظهر
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="border-2 border-primary rounded-lg p-3 cursor-pointer">
                        <div className="w-full h-16 bg-white border rounded mb-2"></div>
                        <p className="text-sm text-center">فاتح</p>
                      </div>
                      <div className="border-2 border-gray-200 rounded-lg p-3 cursor-pointer">
                        <div className="w-full h-16 bg-gray-900 rounded mb-2"></div>
                        <p className="text-sm text-center">داكن</p>
                      </div>
                      <div className="border-2 border-gray-200 rounded-lg p-3 cursor-pointer">
                        <div className="w-full h-16 bg-gradient-to-br from-white to-gray-900 rounded mb-2"></div>
                        <p className="text-sm text-center">تلقائي</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">تخطيط</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">وضع مدمج</p>
                          <p className="text-xs text-gray-500">تقليل المسافة بين العناصر</p>
                        </div>
                        <input type="checkbox" className="rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">تلقائي</p>
                          <p className="text-xs text-gray-500">تلقائي</p>
                        </div>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Button className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    حفظ المظهر
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Language Settings */}
          {activeSection === 'language' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  اللغة & المنطقة
                </CardTitle>
                <CardDescription>
                  قم بتعيين اللغة المفضلة لديك وإعدادات المنطقة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      لغة العرض
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option value="en">English</option>
                      <option value="ar">العربية (Arabic)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المنطقة الزمنية
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option value="Africa/Cairo">القاهرة (UTC+2)</option>
                      <option value="UTC">UTC (UTC+0)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تنسيق التاريخ
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <Button className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    حفظ إعدادات اللغة
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;