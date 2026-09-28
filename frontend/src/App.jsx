import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Login from './components/login';
import Register from './components/register';
import Dashboard from './components/dashboard';
import AdminDashboard from './components/AdminDashboard';
import SessionLogin from './components/sessionlogin';
import SessionDashboard from './components/sessiondashboard';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';
import ForgotPassword from './components/forgetpassword';
import { ResetPassword } from './components/resetpassword';
import { UserProfile } from './components/userprofile';
import { ChangePassword } from './components/changepassword';
import { ProtectedRoute } from './components/protectedroute';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Login />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
    {
      path: '/dashboard',
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: '/admin-dashboard',
      element: (
        <ProtectedRoute requiredRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: '/session-login',
      element: <SessionLogin />,
    },
    {
      path: '/session-dashboard',
      element: <SessionDashboard />,
    },
    {
      path: '/forget-password',
      element: <ForgotPassword />,
    },
    {
      path: '/reset-password/:token',
      element: <ResetPassword />,
    },
    {
      path: '/user-profile',
      element: (
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      ),
    },
    {
      path: '/change-password',
      element: (
        <ProtectedRoute>
          <ChangePassword />
        </ProtectedRoute>
      ),
    },
  ]);

  return (
    <AuthProvider>
      <ToastContainer />
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
