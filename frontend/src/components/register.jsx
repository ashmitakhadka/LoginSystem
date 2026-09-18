import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../schemas/registerSchema';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
  // Controls password visibility separately
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Controls loading state
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (formData) => {
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      // Laravel validation error (422)
      if (response.status === 422) {
        if (result.errors) {
          Object.keys(result.errors).forEach((field) => {
            const message = result.errors[field][0];
            toast.error(message);
            setError(field, { type: 'server', message });
          });
        }
        return;
      }

      // Other server errors
      if (!response.ok) {
        toast.error(result.message || 'Registration failed');
        return;
      }

      // Successful registration
      toast.success(result.message || 'Registration successful!');

      navigate('/login');
    } catch (error) {
      console.error('Error posting data:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center min-h-screen p-4">
      <form
        className="bg-white p-8 rounded-2xl shadow-lg flex flex-col gap-4 w-full max-w-md my-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Create an Account
        </h2>

        {/* Username */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="username"
            className="font-semibold text-gray-700 text-sm"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            className="border border-gray-300 rounded-lg p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            {...register('username')}
          />
          {errors.username && (
            <span className="text-red-500 text-xs mt-0.5">
              {errors.username.message}
            </span>
          )}
        </div>

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
          {errors.email && (
            <span className="text-red-500 text-xs mt-0.5">
              {errors.email.message}
            </span>
          )}
        </div>

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
            <span className="text-red-500 text-xs mt-0.5">
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
            <span className="text-red-500 text-xs mt-0.5">
              {errors.c_password.message}
            </span>
          )}
        </div>

        {/* Register button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-blue-600 text-white font-medium p-2.5 w-full rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        {/* Login redirect link */}
        <p className="text-center text-sm text-gray-600 mt-2">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-blue-600 font-semibold hover:underline focus:outline-none"
          >
            Log in
          </button>
        </p>
      </form>
    </div>
  );
};

export default Register;
