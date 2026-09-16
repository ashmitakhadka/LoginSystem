// SessionDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sessionApi from "../sessionApi"; // was: import api from "../api" // the axios instance with withCredentials + withXSRFToken

const SessionDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/api/session/user-details");
        setUser(data.user);
      } catch (error) {
        navigate("/login"); // 401 means no valid session cookie
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await api.post("/api/session/logout");
    navigate("/login");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <nav className="flex justify-between bg-blue-100 items-center py-4 px-40">
        <div className="font-semibold text-black-700">My App (Session)</div>
        <button onClick={handleLogout} className="...">
          Logout
        </button>
      </nav>
      <div className="flex flex-col items-center mt-20 gap-6">
        <p className="text-2xl font-bold">
          Welcome, <span className="text-blue-600">{user.name}</span>!
        </p>
      </div>
    </>
  );
};

export default SessionDashboard;
