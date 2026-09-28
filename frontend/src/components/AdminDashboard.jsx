import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Admin');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch user details to get the name
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user-details`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserName(data.user.name);
        }
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
    };

    async function fetchUsers() {
      try {
        const response = await fetch(`${API_BASE_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
        }
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    }

    // Fetch admin stats from the protected route
    const fetchAdminStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          // If the backend rejects them, kick them out
          toast.error('Access Denied! You are not an admin.');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };
    fetchUsers();
    fetchUserData();
    fetchAdminStats();
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
    } catch {
      // ignore network errors on logout
    }
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        toast.success(data.message || 'User deleted successfully');
      } else {
        toast.error(data.message || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Delete user error:', err);
      toast.error('Failed to delete user');
    }
  };

  return (
    <>
      <nav className="flex justify-between bg-blue-100 items-center py-4 px-40">
        <div className="font-semibold text-black-700">
          <i className="fa-solid fa-shield-halved mr-2"></i> Admin Panel
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg px-4 py-2 font-semibold text-black-700 
                    cursor-pointer transition duration-200 
                    hover:bg-red-500 hover:text-white"
        >
          <i className="fa-solid fa-right-from-bracket"></i> Logout
        </button>
      </nav>

      <div className="flex flex-col items-center mt-12 gap-3">
        <p className="text-2xl font-bold">
          Welcome Admin, <span className="text-blue-600">{userName}</span>!
        </p>
        {stats?.message && (
          <span className="text-sm bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full border border-blue-200">
            {stats.message}
          </span>
        )}
      </div>
      <div className="mt-12 mx-10 md:mx-20 lg:mx-40 bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h2 className="text-2xl font-bold mb-6">All Users</h2>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 items-center bg-gray-100 px-6 py-4 font-semibold text-gray-700">
            <div className="col-span-3">Name</div>
            <div className="col-span-5">Email</div>
            <div className="col-span-3">Role</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          {users.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-12 items-center px-6 py-4 border-t border-gray-200 hover:bg-gray-50"
            >
              {/* Name */}
              <div className="col-span-3 font-medium">{user.name}</div>

              {/* Email */}
              <div className="col-span-5 text-gray-600">{user.email}</div>

              {/* Role */}
              <div className="col-span-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                  {user.role}
                </span>
              </div>

              {/* Action */}
              <div className="col-span-1 text-right">
                <button
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                  onClick={() => handleDelete(user.id)}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
