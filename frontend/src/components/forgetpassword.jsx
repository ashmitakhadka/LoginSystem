import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '../schemas/forgetPasswordSchema';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    console.log(data);

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/session/forget-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      console.log(result);

      if (!response.ok) {
        toast.error(result.message || 'Something went wrong');
        return;
      }

      toast.success(result.message);

      reset();
    } catch (error) {
      console.error(error);
      toast.error('Unable to connect to the server');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Email</label>

            <input
              type="email"
              {...register('email')}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Enter your email"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg"
          >
            Send Reset Link
          </button>
        </form>

        <p className="text-center mt-4">
          Remembered your password?{' '}
          <Link to="/login" className="text-blue-600">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
