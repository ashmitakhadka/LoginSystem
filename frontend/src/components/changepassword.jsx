import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema } from '../schemas/changePasswordSchema';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export const ChangePassword = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  return (
    <>
      <div className="bg-gray-200 flex justify-center items-center min-h-screen">
        <form
          className="bg-white p-8 rounded-lg flex flex-col gap-5 mt-20 mb-20 w-120"
          onSubmit={handleSubmit((data) => console.log(data))}
        >
          <div className="relative flex flex-col gap-2">
            <label className="font-semibold">Current Password:</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Current Password"
              className="border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-2 text-gray-500 hover:text-gray-700 focus:outline-none"
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

          <div className="relative flex flex-col gap-2">
            <label className="font-semibold">Confirm Password:</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="c_password"
              placeholder="Confirm Password"
              className="border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
              {...register('c_password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>

          {errors.c_password && (
            <span className="text-sm text-red-500">
              {errors.c_password.message}
            </span>
          )}

          <div className="relative flex flex-col gap-2">
            <label className="font-semibold">New Password:</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="new_password"
              placeholder="New Password"
              className="border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
              {...register('new_password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>

          {errors.new_password && (
            <span className="text-sm text-red-500">
              {errors.new_password.message}
            </span>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-300 p-2 w-45 rounded-md focus:ring-blue-500 hover:bg-blue-600 self-center disabled:opacity-50"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
