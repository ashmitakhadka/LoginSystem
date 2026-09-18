import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '../schemas/forgetPasswordSchema';
import { Link } from 'react-router-dom';

export const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data) => {
    setLoading(true);
    console.log(data);
    setLoading(false);
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
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white font-medium p-2.5 w-full rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send Reset Email
          </button>

          {/* Login redirect link */}
          <p className="text-center text-sm text-gray-600 mt-2">
            Remembered Your passsword?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};
