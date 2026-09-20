import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { resetPasswordSchema } from '../schemas/resetPasswordSchema';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';

export const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const email = searchParams.get('email')?.trim();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: email || '',
    },
  });

  const onSubmit = async (data) => {
    const resetData = {
      token: token,
      email: data.email.trim(),
      password: data.password,
      password_confirmation: data.c_password,
    };

    console.log(resetData);

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/session/reset-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(resetData),
        }
      );

      const result = await response.json();

      console.log(result);

      if (response.ok) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Reset password error:', error);
    }
  };

  return (
    <>
      <div className="bg-gray-100 flex justify-center items-center min-h-screen p-4">
        <form
          className="bg-white p-8 rounded-2xl shadow-lg flex flex-col gap-4 w-full max-w-md my-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
            Reset Your Password
          </h2>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="font-semibold text-gray-700 text-sm"
            >
              Email
            </label>

            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="border border-gray-300 rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              {...register('email')}
            />
          </div>

          {errors.email && (
            <span className="text-sm text-red-500">{errors.email.message}</span>
          )}

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="font-semibold text-gray-700 text-sm"
            >
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
                className="border border-gray-300 rounded-lg p-2.5 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                {...register('password')}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>

            {errors.password && (
              <span className="text-sm text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="c_password"
              className="font-semibold text-gray-700 text-sm"
            >
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="c_password"
                placeholder="Confirm Password"
                className="border border-gray-300 rounded-lg p-2.5 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                {...register('c_password')}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={
                  showConfirmPassword ? 'Hide password' : 'Show password'
                }
              >
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                />
              </button>
            </div>

            {errors.c_password && (
              <span className="text-sm text-red-500">
                {errors.c_password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white font-medium p-2.5 w-full rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition"
          >
            Reset
          </button>

          <p className="text-center text-sm text-gray-600 mt-2">
            Remembered Your password?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};
