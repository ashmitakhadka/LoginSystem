import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { User } from 'lucide-react';
import { API_BASE_URL } from '../api';
import { useAuth } from '../context/AuthContext';

export const UserProfile = ({ user: propUser, setUser: propSetUser }) => {
  const { user: authUser, updateUser: authUpdateUser, token: authToken } = useAuth();
  const [internalUser, setInternalUser] = useState(null);

  const currentUser = propUser || authUser || internalUser;

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  // If no user prop or context user was provided, fetch it directly
  useEffect(() => {
    if (propUser || authUser) {
      return;
    }

    const token =
      authToken ||
      localStorage.getItem('token') ||
      sessionStorage.getItem('token');

    if (!token) {
      return;
    }

    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user-details`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        if (response.ok && isMounted) {
          const data = await response.json();
          setInternalUser(data.user);
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [propUser, authUser, authToken]);

  const updateUserData = (updatedUser) => {
    if (propSetUser) {
      propSetUser(updatedUser);
    }
    if (authUpdateUser) {
      authUpdateUser(updatedUser);
    }
    setInternalUser(updatedUser);
  };

  async function handleClick() {
    // First click: enter edit mode and populate current values
    if (!isEditing) {
      setEditName(currentUser?.name || '');
      setEditEmail(currentUser?.email || '');
      setIsEditing(true);
      return;
    }

    // Second click: save changes
    try {
      const token =
        authToken ||
        localStorage.getItem('token') ||
        sessionStorage.getItem('token');

      if (!token) {
        toast.error('You are not authenticated.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/user-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Profile update failed');
        return;
      }

      updateUserData(data.user);
      toast.success(data.message || 'Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Unable to update profile.');
    }
  }

  if (!currentUser) {
    return (
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-md text-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-md">
      <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
          <User className="w-7 h-7 text-blue-600" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800">{currentUser.name}</h2>
          <p className="text-sm text-gray-500">{currentUser.email}</p>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {/* Name */}
        <div className="flex items-center justify-between py-4">
          <span className="text-sm text-gray-500">Name</span>

          {isEditing ? (
            <input
              type="text"
              className="w-52 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              value={editName}
              onChange={(event) => {
                setEditName(event.target.value);
              }}
            />
          ) : (
            <span className="text-sm font-medium text-gray-800">
              {currentUser.name}
            </span>
          )}
        </div>

        {/* Email */}
        <div className="flex items-center justify-between py-4">
          <span className="text-sm text-gray-500">Email</span>

          {isEditing ? (
            <input
              type="text"
              className="w-52 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              value={editEmail}
              onChange={(event) => {
                setEditEmail(event.target.value);
              }}
            />
          ) : (
            <span className="ml-4 max-w-[220px] truncate text-right text-sm font-medium text-gray-800">
              {currentUser.email}
            </span>
          )}
        </div>

        {/* Role */}
        <div className="flex items-center justify-between py-4">
          <span className="text-sm text-gray-500">Role</span>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              currentUser.role === 'admin'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {(currentUser.role || 'user').toUpperCase()}
          </span>
        </div>
      </div>

      <div className="pt-5">
        <button
          type="button"
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
          onClick={handleClick}
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
