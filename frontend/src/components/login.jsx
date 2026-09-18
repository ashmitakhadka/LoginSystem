import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../schemas/loginSchema';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  // Controls whether the password is visible or hidden
  const [showPassword, setShowPassword] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();

  // Controls loading state while API request is running
  const [loading, setLoading] = useState(false);

  async function onSubmit(data) {
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      // Laravel/API error
      if (!response.ok) {
        toast.error(result.message || 'Login failed');
        return;
      }

      // Successful login
      toast.success(result.message || 'Login successful!');

      // Store authentication token
      localStorage.setItem('token', result.token);

      // Redirect based on role
      if (result.user?.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error posting data:', error);

      toast.error('Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-200 flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg gap-4 flex flex-col mt-20 w-120 mb-20"
      >
        {/* Email */}
        <label htmlFor="email" className="font-semibold">
          Email
        </label>

        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          className="border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-1"
          {...register('email')}
        />

        {errors.email && (
          <span className="text-sm text-red-500">{errors.email.message}</span>
        )}

        {/* Password */}
        <label htmlFor="password" className="font-semibold">
          Password
        </label>

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="Enter your password"
            className="border border-gray-200 rounded-md p-2 pr-16 w-full focus:outline-none focus:ring-1"
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
        <div className="flex justify-end">
          <p className="flex justify-center gap-2">
            <Link
              to="/forget-password"
              className="text-blue-600 hover:underline"
            >
              Forgot Password
            </Link>
          </p>
        </div>

        {/* Login button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-300 p-2 w-45 rounded-md focus:ring-blue-500 hover:bg-blue-600 self-center disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {/* Register link */}
        <p className="flex justify-center gap-2">
          Don't have an account yet?
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
