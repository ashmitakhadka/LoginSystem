import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Shield, LogOut, Trash2, LayoutDashboard } from 'lucide-react';
import { API_BASE_URL } from '../api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user: currentUser, logout, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

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
          toast.error('Access Denied! You are not an admin.');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };

    fetchUsers();
    fetchAdminStats();
  }, [token, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore logout network errors
    }
    navigate('/login');
  };

  const handleDelete = async (id) => {
    const targetUser = users.find((u) => u.id === id);
    if (
      (currentUser?.id && currentUser.id === id) ||
      (currentUser?.email && targetUser?.email === currentUser.email)
    ) {
      toast.error('You cannot delete your own account.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

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
        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== id));
        toast.success(data.message || 'User deleted successfully');
      } else {
        toast.error(data.message || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Delete user error:', err);
      toast.error('Failed to delete user');
    }
  };

  const handleRoleChange = async (id, newRole) => {
    setUpdatingId(id);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();

      if (response.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
        );
        toast.success(`Role updated to ${newRole}`);
      } else {
        toast.error(data.message || 'Failed to update role');
      }
    } catch (err) {
      console.error('Update role error:', err);
      toast.error('Failed to update user role');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <nav className="flex justify-between bg-blue-100 items-center py-4 px-6 md:px-20 lg:px-40 shadow-sm">
        <div className="flex items-center gap-2 font-semibold text-gray-800 text-lg">
          <Shield className="w-5 h-5 text-purple-700" />
          <span>Admin Panel</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-blue-200 transition"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>User Dashboard</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-700 cursor-pointer transition hover:bg-red-500 hover:text-white"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <div className="flex flex-col items-center mt-12 gap-3 px-4">
        <p className="text-2xl font-bold text-gray-800">
          Welcome Admin,{' '}
          <span className="text-purple-600">{currentUser?.name || 'Admin'}</span>!
        </p>

        {stats?.message && (
          <span className="text-sm bg-purple-50 text-purple-700 px-4 py-1.5 rounded-full border border-purple-200">
            {stats.message}
          </span>
        )}
      </div>

      <div className="mt-8 mx-4 md:mx-20 lg:mx-40 bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">All Users</h2>
          <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
            Total Users: {users.length}
          </span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 items-center bg-gray-100 px-6 py-4 font-semibold text-gray-700 text-sm">
            <div className="col-span-3">Name</div>
            <div className="col-span-4">Email</div>
            <div className="col-span-3">Role Management</div>
            <div className="col-span-2 text-right">Action</div>
          </div>

          {users.map((userItem) => {
            const isSelf =
              (currentUser?.id && currentUser.id === userItem.id) ||
              (currentUser?.email && currentUser.email === userItem.email);

            return (
              <div
                key={userItem.id}
                className="grid grid-cols-12 items-center px-6 py-4 border-t border-gray-100 hover:bg-gray-50 transition"
              >
                {/* Name */}
                <div className="col-span-3 font-medium text-gray-900 flex items-center gap-2">
                  <span>{userItem.name}</span>
                  {isSelf && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                      You
                    </span>
                  )}
                </div>

                {/* Email */}
                <div className="col-span-4 text-gray-600 text-sm truncate pr-2">
                  {userItem.email}
                </div>

                {/* Role Toggle Selector */}
                <div className="col-span-3 flex items-center gap-2">
                  <select
                    value={userItem.role}
                    disabled={updatingId === userItem.id || isSelf}
                    onChange={(e) => handleRoleChange(userItem.id, e.target.value)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-md border transition cursor-pointer ${
                      userItem.role === 'admin'
                        ? 'bg-purple-50 text-purple-700 border-purple-200 focus:ring-purple-400'
                        : 'bg-gray-50 text-gray-700 border-gray-200 focus:ring-blue-400'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Action */}
                <div className="col-span-2 text-right">
                  <button
                    disabled={isSelf}
                    className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    title={isSelf ? 'Cannot delete yourself' : 'Delete user'}
                    onClick={() => handleDelete(userItem.id)}
                  >
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </div>
              </div>
            );
          })}

          {users.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
              No users found.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
