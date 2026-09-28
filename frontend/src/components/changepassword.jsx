import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema } from '../schemas/changePasswordSchema';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../api';
import { useAuth } from '../context/AuthContext';

export const ChangePassword = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  async function onSubmit(data) {
    setLoading(true);

    try {
      const activeToken =
        token || localStorage.getItem('token') || sessionStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/change-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || 'Password change failed');
        return;
      }

      toast.success(result.message || 'Password updated successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-100 flex justify-center items-center min-h-screen p-4">
      <form
        className="bg-white p-8 rounded-2xl shadow-md flex flex-col gap-5 w-full max-w-md my-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <Link
            to="/dashboard"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <h2 className="text-xl font-bold text-gray-800">Change Password</h2>
        </div>

        {/* Current Password */}
        <div className="flex flex-col gap-1.5">
          <label className="font-medium text-sm text-gray-700">Current Password:</label>

          <div className="relative">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              id="password"
              placeholder="Enter current password"
              className="border border-gray-300 rounded-lg p-2.5 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
              {...register('password')}
            />

            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
              aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
            >
              {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {errors.password && (
            <span className="text-xs text-red-500">{errors.password.message}</span>
          )}
        </div>

        {/* New Password */}
        <div className="flex flex-col gap-1.5">
          <label className="font-medium text-sm text-gray-700">New Password:</label>

          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              id="new_password"
              placeholder="Enter new password (min. 6 characters)"
              className="border border-gray-300 rounded-lg p-2.5 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
              {...register('new_password')}
            />

            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
              aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
            >
              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {errors.new_password && (
            <span className="text-xs text-red-500">{errors.new_password.message}</span>
          )}
        </div>

        {/* Confirm New Password */}
        <div className="flex flex-col gap-1.5">
          <label className="font-medium text-sm text-gray-700">Confirm New Password:</label>

          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="c_password"
              placeholder="Confirm new password"
              className="border border-gray-300 rounded-lg p-2.5 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
              {...register('c_password')}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {errors.c_password && (
            <span className="text-xs text-red-500">{errors.c_password.message}</span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium p-2.5 w-full rounded-lg transition focus:ring-4 focus:ring-blue-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Updating...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
