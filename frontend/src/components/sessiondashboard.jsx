import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import sessionApi from "../sessionApi";

const SessionDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await sessionApi.get("/api/session/user-details");

        setUser(data.user);
      } catch (error) {
        console.log("Error fetching user:", error);

        if (error.response?.status === 401) {
          navigate("/login");
          return;
        }

        toast.error(
          error.response?.data?.message || "Unable to load user details",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await sessionApi.post("/api/session/logout");

      toast.success("Logged out successfully!");

      navigate("/login");
    } catch (error) {
      console.log("Logout error:", error);

      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <nav className="flex justify-between bg-blue-100 items-center py-4 px-40">
        <div className="font-semibold text-black-700">My App (Session)</div>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
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
