import { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || sessionStorage.getItem('token') || null;
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user details whenever token changes
  useEffect(() => {
    const fetchUser = async () => {
      const activeToken =
        localStorage.getItem('token') || sessionStorage.getItem('token');

      if (!activeToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/user-details`, {
          headers: {
            Authorization: `Bearer ${activeToken}`,
            Accept: 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          // Keep userRole in sync for quick checks
          localStorage.setItem('userRole', data.user.role || 'user');
        } else if (response.status === 401) {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          localStorage.removeItem('userRole');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Error fetching authenticated user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = (authToken, userData, remember = true) => {
    if (remember) {
      localStorage.setItem('token', authToken);
      sessionStorage.removeItem('token');
    } else {
      sessionStorage.setItem('token', authToken);
      localStorage.removeItem('token');
    }

    if (userData?.role) {
      localStorage.setItem('userRole', userData.role);
    }

    setToken(authToken);
    setUser(userData);
  };

  const logout = async () => {
    const activeToken =
      localStorage.getItem('token') || sessionStorage.getItem('token');

    if (activeToken) {
      try {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${activeToken}`,
            Accept: 'application/json',
          },
        });
      } catch (err) {
        console.error('Logout error:', err);
      }
    }

    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
    if (updatedUser?.role) {
      localStorage.setItem('userRole', updatedUser.role);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin' || localStorage.getItem('userRole') === 'admin',
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
