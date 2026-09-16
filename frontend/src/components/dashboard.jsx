import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

const Dashboard = () => {
    const navigate = useNavigate();
    
    const [user, setUser] = useState({ name: "Loading...", role: "user" });

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) 
                { navigate("/login"); 
                    return; 
                }
            
            try {
                const response = await fetch("http://127.0.0.1:8000/api/user-details", {
                    headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user); 
                } else {
                    localStorage.removeItem('token');
                    navigate("/login");
                }
            } catch (error) {
                console.error("Failed to fetch user data", error);
            }
        };
        fetchUserData();
    }, [navigate]);

    // UPDATED CODE:
const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
        await fetch("http://127.0.0.1:8000/api/logout", {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${token}`, 
                "Accept": "application/json" 
            },
        });
    } catch (error) {
        console.error("Logout failed", error);
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate("/login");
};

    // Function to test the protected admin route
    const testAdminRoute = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch("http://127.0.0.1:8000/api/admin/stats", {
            headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
        });
    };

    return (
        <>
            <nav className="flex justify-between bg-blue-100 items-center py-4 px-40">
                <div className="font-semibold text-black-700">My App</div>
                <button onClick={handleLogout} className="flex items-center gap-2 rounded-lg px-4 py-2 font-semibold text-black-700 cursor-pointer transition duration-200 hover:bg-red-500 hover:text-white">
                    <i className="fa-solid fa-right-from-bracket"></i> Logout
                </button>
            </nav>

            <div className="flex flex-col items-center mt-20 gap-6">
                <p className="text-2xl font-bold">
                    Welcome, <span className="text-blue-600">{user.name}</span>!
                </p>
                
                {/* Show a badge indicating their role */}
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                    Role: {user.role.toUpperCase()}
                </span>

                {/* AUTHORIZATION: Only show this button if the user is an admin */}
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