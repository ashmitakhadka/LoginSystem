import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("Admin");
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate("/login");
            return;
        }

        // Fetch user details to get the name
        const fetchUserData = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/user-details", {
                    headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserName(data.user.name);
                }
            } catch (error) {
                console.error("Failed to fetch user", error);
            }
        };

        // Fetch admin stats from the protected route
        const fetchAdminStats = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/admin/stats", {
                    headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
                });
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                } else {
                    // If the backend rejects them, kick them out
                    alert("Access Denied! You are not an admin.");
                    navigate("/dashboard");
                }
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        };

        fetchUserData();
        fetchAdminStats();
    }, [navigate]);

    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        await fetch("http://127.0.0.1:8000/api/logout", {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${token}`, 
                "Accept": "application/json" },
        });
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate("/login");
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

            <div className="flex flex-col items-center mt-20 gap-6">
                <p className="text-2xl font-bold">
                    Welcome Admin, <span className="text-blue-600">{userName}</span>!
                </p>
                
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800">
                    Role: ADMIN
                </span>

            </div>
        </>
    );
};

export default AdminDashboard;