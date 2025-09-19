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
      const { confirmPassword, ...userData } = data;
      await registerUser(userData);
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
          <h1 className="text-3xl font-bold text-gray-900">اتحاد شباب تحيا مصر</h1>
          <p className="mt-2 text-gray-600">منصة اتحاد شباب تحيا مصر</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>إنشاء حسابك</CardTitle>
            <CardDescription>
              انضم إلى مجتمع اتحاد شباب تحيا مصر. املأ النموذج أدناه للبدء.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    الاسم الكامل *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="أدخل اسمك الكامل"
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="أدخل بريدك الإلكتروني"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    كلمة المرور *
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="أدخل كلمة المرور الخاصة بك"
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    تأكيد كلمة المرور *
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="تأكيد كلمة المرور الخاصة بك"
                    {...register('confirmPassword')}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    رقم الهاتف *
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
                    الجامعة *
                  </label>
                  <Input
                    id="university"
                    type="text"
                    placeholder="أدخل جامعتك"
                    {...register('university')}
                  />
                  {errors.university && (
                    <p className="mt-1 text-sm text-red-600">{errors.university.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700 mb-1">
                    الرقم القومي *
                  </label>
                  <Input
                    id="nationalId"
                    type="text"
                    placeholder="أدخل رقمك القومي (14 رقمًا)"
                    {...register('nationalId')}
                  />
                  {errors.nationalId && (
                    <p className="mt-1 text-sm text-red-600">{errors.nationalId.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="governorate" className="block text-sm font-medium text-gray-700 mb-1">
                    المحافظة *
                  </label>
                  <select
                    id="governorate"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...register('governorate')}
                  >
                    <option value="">اختر محافظتك</option>
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
                      (اختياري) المنصب داخل الاتحاد
                    </label>
                    <select
                      id="position"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      {...register('position')}
                    >
                      <option value="">اختر المنصب</option>
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
                    (اختياري) رقم العضوية
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
                {isLoading ? 'إنشاء حساب...' : 'إنشاء حساب'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                لديك حساب بالفعل؟{' '}
                <Link to="/login" className="text-primary hover:underline">
                  تسجيل الدخول
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