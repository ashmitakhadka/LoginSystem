import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LogOut, Shield, KeyRound, LayoutDashboard } from 'lucide-react';
import { UserProfile } from './userprofile';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout, isAdmin, token } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully!');
    } catch {
      toast.error('Unable to logout cleanly.');
    } finally {
      navigate('/login');
    }
  };

  const testAdminRoute = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Admin stats accessed successfully!');
      } else if (response.status === 401) {
        toast.error('You are not authenticated.');
        logout();
        navigate('/login');
      } else if (response.status === 403) {
        toast.error(data.message || 'You are not authorized to access this.');
      } else {
        toast.error(data.message || 'Unable to access admin stats.');
      }
    } catch (error) {
      console.error('Admin route error:', error);
      toast.error('Unable to connect to the server.');
    }
  };

  return (
    <>
      <nav className="flex justify-between bg-blue-100 items-center py-4 px-6 md:px-20 lg:px-40 shadow-sm">
        <div className="flex items-center gap-2 font-semibold text-gray-800 text-lg">
          <LayoutDashboard className="w-5 h-5 text-blue-600" />
          <span>My App</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/change-password"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-blue-200 transition"
          >
            <KeyRound className="w-4 h-4" />
            <span>Change Password</span>
          </Link>

          {isAdmin && (
            <Link
              to="/admin-dashboard"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Panel</span>
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-700 cursor-pointer transition hover:bg-red-500 hover:text-white"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <div className="flex flex-col items-center mt-12 gap-6 px-4">
        {user && (
          <p className="text-2xl font-bold text-gray-800">
            Welcome, <span className="text-blue-600">{user.name}</span>!
          </p>
        )}

        {user && <UserProfile user={user} setUser={updateUser} />}

        {/* Admin-only action button */}
        {isAdmin && (
          <button
            onClick={testAdminRoute}
            className="bg-purple-600 text-white px-6 py-2.5 rounded-lg hover:bg-purple-700 transition flex items-center gap-2 font-medium cursor-pointer shadow-sm"
          >
            <Shield className="w-4 h-4" />
            <span>Test Admin Endpoint</span>
          </button>
        )}
      </div>
    </>
  );
};

export default Dashboard;
