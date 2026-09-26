import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema } from '../schemas/changePasswordSchema';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { toast } from 'react-toastify';

export const ChangePassword = () => {
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
      const token = localStorage.getItem('token');

      const response = await fetch(
        'http://127.0.0.1:8000/api/change-password',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || 'Password change failed');
        return;
      }

      toast.success(result.message || 'Password updated successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="bg-gray-200 flex justify-center items-center min-h-screen">
        <form
          className="bg-white p-8 rounded-lg flex flex-col gap-5 mt-20 mb-20 w-120"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Current Password */}
          <div className="relative flex flex-col gap-2">
            <label className="font-semibold">Current Password:</label>

            <input
              type={showCurrentPassword ? 'text' : 'password'}
              id="password"
              placeholder="Current Password"
              className="border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
              {...register('password')}
            />

            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 bottom-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={
                showCurrentPassword
                  ? 'Hide current password'
                  : 'Show current password'
              }
            >
              <FontAwesomeIcon
                icon={showCurrentPassword ? faEyeSlash : faEye}
              />
            </button>
          </div>

          {errors.password && (
            <span className="text-sm text-red-500">
              {errors.password.message}
            </span>
          )}

          {/* New Password */}
          <div className="relative flex flex-col gap-2">
            <label className="font-semibold">New Password:</label>

            <input
              type={showNewPassword ? 'text' : 'password'}
              id="new_password"
              placeholder="New Password"
              className="border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
              {...register('new_password')}
            />

            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 bottom-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={
                showNewPassword ? 'Hide new password' : 'Show new password'
              }
            >
              <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
            </button>
          </div>

          {errors.new_password && (
            <span className="text-sm text-red-500">
              {errors.new_password.message}
            </span>
          )}

          {/* Confirm New Password */}
          <div className="relative flex flex-col gap-2">
            <label className="font-semibold">Confirm New Password:</label>

            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="c_password"
              placeholder="Confirm Password"
              className="border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
              {...register('c_password')}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 bottom-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={
                showConfirmPassword
                  ? 'Hide confirm password'
                  : 'Show confirm password'
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

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-300 p-2 w-45 rounded-md focus:ring-blue-500 hover:bg-blue-600 self-center disabled:opacity-50"
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
