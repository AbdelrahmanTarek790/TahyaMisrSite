import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useAuth } from '../context/AuthContext';
import { useError } from '../context/ErrorContext';
import { usersAPI } from '../api';
import { User, Mail, University, MapPin, Phone, Calendar, Edit } from 'lucide-react';
import { getInitials } from '../lib/utils';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  university: z.string().min(2, 'University must be at least 2 characters'),
  governorate: z.string().min(2, 'Governorate must be at least 2 characters'),
  faculty: z.string().optional(),
  year: z.string().optional(),
});

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { addError } = useError();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      university: user?.university || '',
      governorate: user?.governorate || '',
      faculty: user?.faculty || '',
      year: user?.year || '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        university: user.university || '',
        governorate: user.governorate || '',
        faculty: user.faculty || '',
        year: user.year || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await usersAPI.updateMe(data);
      updateUser(response.data.user);
      addError('Profile updated successfully!', 'success');
      setIsEditing(false);
    } catch (error) {
      addError(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

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
            <Avatar className="h-24 w-24 mx-auto">
              <AvatarImage src={user?.photo} alt={user?.name || "User"} />
              <AvatarFallback className="text-2xl">
                {user?.name ? getInitials(user.name) : "U"}
              </AvatarFallback>
            </Avatar>
            <CardTitle>{user?.name}</CardTitle>
            <CardDescription className="flex items-center justify-center gap-1">
              {user?.role === 'admin' && <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Admin</span>}
              {user?.role === 'volunteer' && <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Volunteer</span>}
              {user?.role === 'student' && <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Student</span>}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <Input
                    {...register('name')}
                    disabled={!isEditing}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    {...register('email')}
                    disabled={!isEditing}
                    type="email"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <Input
                    {...register('phone')}
                    disabled={!isEditing}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    University
                  </label>
                  <Input
                    {...register('university')}
                    disabled={!isEditing}
                    placeholder="Enter your university"
                  />
                  {errors.university && (
                    <p className="text-red-500 text-sm mt-1">{errors.university.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Governorate
                  </label>
                  <Input
                    {...register('governorate')}
                    disabled={!isEditing}
                    placeholder="Enter your governorate"
                  />
                  {errors.governorate && (
                    <p className="text-red-500 text-sm mt-1">{errors.governorate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Faculty
                  </label>
                  <Input
                    {...register('faculty')}
                    disabled={!isEditing}
                    placeholder="Enter your faculty"
                  />
                  {errors.faculty && (
                    <p className="text-red-500 text-sm mt-1">{errors.faculty.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Academic Year
                  </label>
                  <Input
                    {...register('year')}
                    disabled={!isEditing}
                    placeholder="Enter your academic year"
                  />
                  {errors.year && (
                    <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading || !isDirty}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;