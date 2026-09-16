import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./components/login";
import Register from "./components/register";
import Dashboard from "./components/dashboard";
import AdminDashboard from "./components/AdminDashboard";
import SessionLogin from "./components/sessionlogin";
import SessionDashboard from "./components/sessiondashboard";

import "./App.css";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/admin-dashboard",
      element: <AdminDashboard />,
    },
    {
      path: "/session-login",
      element: <SessionLogin />,
    },
    { path: "/session-dashboard", element: <SessionDashboard /> },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
