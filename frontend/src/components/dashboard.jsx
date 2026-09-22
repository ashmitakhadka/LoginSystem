import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserProfile } from './userprofile';

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: 'Loading...',
    role: 'user',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/user-details', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('USER API RESPONSE:', data);
          setUser(data.user);
        } else if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');

          toast.error('Session expired. Please login again.');
          navigate('/login');
        } else {
          toast.error('Failed to load user information.');
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
        toast.error('Unable to connect to the server.');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        toast.success('Logged out successfully!');
      } else {
        toast.error('Logout failed.');
      }
    } catch (error) {
      console.error('Logout failed', error);
      toast.error('Unable to logout from the server.');
    } finally {
      // Always remove local authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');

      navigate('/login');
    }
  };

  // Test protected admin route
  const testAdminRoute = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/admin/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Admin stats accessed successfully!');

        console.log('Admin stats:', data);
      } else if (response.status === 401) {
        toast.error('You are not authenticated.');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
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
      <nav className="flex justify-between bg-blue-100 items-center py-4 px-40">
        <div className="font-semibold text-black-700">My App</div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg px-4 py-2 font-semibold text-black-700 cursor-pointer transition duration-200 hover:bg-red-500 hover:text-white"
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          Logout
        </button>
      </nav>

      <div className="flex flex-col items-center mt-20 gap-6">
        <p className="text-2xl font-bold">
          Welcome, <span className="text-blue-600">{user.name}</span>!
        </p>

        <UserProfile user={user} />

        {/* Admin-only button */}
        {user.role === 'admin' && (
          <button
            onClick={testAdminRoute}
            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition flex items-center gap-2"
          >
            <i className="fa-solid fa-shield-halved"></i>
            Access Admin Stats
          </button>
        )}
      </div>
    </>
  );
};
export default Dashboard;
