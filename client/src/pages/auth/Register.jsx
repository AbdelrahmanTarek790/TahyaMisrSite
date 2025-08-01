import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useAuth } from '../../context/AuthContext';
import { useError } from '../../context/ErrorContext';
import { positionsAPI } from '../../api';
import { EGYPT_GOVERNORATES } from '../../constants/governorates';
import ProfileImageUpload from '../../components/ProfileImageUpload';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  university: z.string().min(2, 'University is required'),
  nationalId: z.string().min(14, 'National ID must be 14 digits'),
  governorate: z.string().min(2, 'Governorate is required'),
  position: z.string().optional(),
  membershipNumber: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [positions, setPositions] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageError, setProfileImageError] = useState('');
  const { register: registerUser } = useAuth();
  const { addError } = useError();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const watchGovernorate = watch('governorate');

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await positionsAPI.getAll({ 
          governorate: watchGovernorate 
        });
        setPositions(response.data || []);
      } catch (error) {
        console.error('Failed to fetch positions:', error);
      }
    };

    if (watchGovernorate) {
      fetchPositions();
    }
  }, [watchGovernorate]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setProfileImageError('');
      
      // Validate profile image is required
      if (!profileImage) {
        setProfileImageError('Profile image is required');
        return;
      }
      
      const { confirmPassword, ...userData } = data;
      
      // Create FormData to handle file upload
      const formData = new FormData();
      
      // Append all form fields
      Object.keys(userData).forEach(key => {
        if (userData[key]) {
          formData.append(key, userData[key]);
        }
      });
      
      // Append profile image (it's now required)
      formData.append('profileImage', profileImage);
      
      await registerUser(formData);
      addError('Registration successful! Welcome to Tahya Misr.', 'success');
      navigate('/dashboard');
    } catch (error) {
      addError(error?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Tahya Misr</h1>
          <p className="mt-2 text-gray-600">Students Union Platform</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>
              Join the Tahya Misr Students Union community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Profile Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                  Profile Picture *
                </label>
                <ProfileImageUpload
                  value={profileImage}
                  onChange={setProfileImage}
                  error={profileImageError}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    {...register('confirmPassword')}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    {...register('phone')}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
                    University *
                  </label>
                  <Input
                    id="university"
                    type="text"
                    placeholder="Enter your university"
                    {...register('university')}
                  />
                  {errors.university && (
                    <p className="mt-1 text-sm text-red-600">{errors.university.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700 mb-1">
                    National ID *
                  </label>
                  <Input
                    id="nationalId"
                    type="text"
                    placeholder="14-digit National ID"
                    {...register('nationalId')}
                  />
                  {errors.nationalId && (
                    <p className="mt-1 text-sm text-red-600">{errors.nationalId.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="governorate" className="block text-sm font-medium text-gray-700 mb-1">
                    Governorate *
                  </label>
                  <select
                    id="governorate"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...register('governorate')}
                  >
                    <option value="">Select your governorate</option>
                    {EGYPT_GOVERNORATES.map((gov) => (
                      <option key={gov} value={gov}>{gov}</option>
                    ))}
                  </select>
                  {errors.governorate && (
                    <p className="mt-1 text-sm text-red-600">{errors.governorate.message}</p>
                  )}
                </div>

                {positions.length > 0 && (
                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                      Position (Optional)
                    </label>
                    <select
                      id="position"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      {...register('position')}
                    >
                      <option value="">Select a position</option>
                      {positions.map((position) => (
                        <option key={position._id} value={position._id}>
                          {position.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label htmlFor="membershipNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Membership Number (Optional)
                  </label>
                  <Input
                    id="membershipNumber"
                    type="text"
                    placeholder="TM-2025-XXX"
                    {...register('membershipNumber')}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;