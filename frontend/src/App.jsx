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
import { ForgotPassword } from './components/forgetpassword';
import { ResetPassword } from './components/resetpassword';

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
      element: <Dashboard />,
    },
    {
      path: '/admin-dashboard',
      element: <AdminDashboard />,
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
      path: '/reset-password',
      element: <ResetPassword />,
    },
  ]);

  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
