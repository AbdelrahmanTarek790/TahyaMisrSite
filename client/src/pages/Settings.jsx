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
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'language', label: 'Language', icon: Globe },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Settings</CardTitle>
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
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Update your password and manage security preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <Input
                      {...register('currentPassword')}
                      type="password"
                      placeholder="Enter your current password"
                    />
                    {errors.currentPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.currentPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <Input
                      {...register('newPassword')}
                      type="password"
                      placeholder="Enter your new password"
                    />
                    {errors.newPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <Input
                      {...register('confirmPassword')}
                      type="password"
                      placeholder="Confirm your new password"
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    {isLoading ? 'Changing Password...' : 'Change Password'}
                  </Button>
                </form>

                <div className="mt-8 pt-6 border-t">
                  <h4 className="font-medium text-gray-900 mb-4">Account Security</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Two-Factor Authentication</p>
                        <p className="text-xs text-gray-500">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline" size="sm" disabled>
                        Enable
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Login Notifications</p>
                        <p className="text-xs text-gray-500">Get notified of new sign-ins</p>
                      </div>
                      <Button variant="outline" size="sm" disabled>
                        Configure
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
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Email Notifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">News Updates</p>
                          <p className="text-xs text-gray-500">Get notified about new news articles</p>
                        </div>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Event Reminders</p>
                          <p className="text-xs text-gray-500">Receive reminders about upcoming events</p>
                        </div>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Weekly Digest</p>
                          <p className="text-xs text-gray-500">Weekly summary of platform activity</p>
                        </div>
                        <input type="checkbox" className="rounded" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Push Notifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Urgent Announcements</p>
                          <p className="text-xs text-gray-500">Important platform announcements</p>
                        </div>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Event Registrations</p>
                          <p className="text-xs text-gray-500">Confirmation of event registrations</p>
                        </div>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Button className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Preferences
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
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Theme</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="border-2 border-primary rounded-lg p-3 cursor-pointer">
                        <div className="w-full h-16 bg-white border rounded mb-2"></div>
                        <p className="text-sm text-center">Light</p>
                      </div>
                      <div className="border-2 border-gray-200 rounded-lg p-3 cursor-pointer">
                        <div className="w-full h-16 bg-gray-900 rounded mb-2"></div>
                        <p className="text-sm text-center">Dark</p>
                      </div>
                      <div className="border-2 border-gray-200 rounded-lg p-3 cursor-pointer">
                        <div className="w-full h-16 bg-gradient-to-br from-white to-gray-900 rounded mb-2"></div>
                        <p className="text-sm text-center">Auto</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Layout</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Compact Mode</p>
                          <p className="text-xs text-gray-500">Reduce spacing between elements</p>
                        </div>
                        <input type="checkbox" className="rounded" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Sidebar Auto-collapse</p>
                          <p className="text-xs text-gray-500">Automatically collapse sidebar on mobile</p>
                        </div>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Button className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Appearance
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
                  Language & Region
                </CardTitle>
                <CardDescription>
                  Set your preferred language and regional settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Language
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option value="en">English</option>
                      <option value="ar">العربية (Arabic)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Zone
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option value="Africa/Cairo">Cairo (UTC+2)</option>
                      <option value="UTC">UTC (UTC+0)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Format
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <Button className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Language Settings
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