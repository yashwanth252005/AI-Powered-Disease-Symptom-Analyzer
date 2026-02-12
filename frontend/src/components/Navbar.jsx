import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const token = localStorage.getItem("token");

    let email = "";
    let initials = "";

    if (token) {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            email = payload.sub || payload.email || "";
        } catch (err) {
            console.error("Invalid token");
        }
    }

    if (email) {
        const namePart = email.split("@")[0];
        const parts = namePart.split(/[._-]/);
        initials =
            parts.length > 1
                ? (parts[0][0] + parts[1][0]).toUpperCase()
                : namePart[0].toUpperCase();
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <span className="text-3xl">🏥</span>
                    <h1
                        className="text-xl font-bold cursor-pointer hover:text-blue-100 transition-colors"
                        onClick={() => navigate("/dashboard")}
                    >
                        AI Health Platform
                    </h1>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="hidden md:flex items-center space-x-2 bg-blue-500 bg-opacity-50 px-4 py-2 rounded-full">
                        <span className="text-sm">👤</span>
                        <span className="text-sm">{email}</span>
                    </div>
                    <div className="relative">
                        <div
                            onClick={() => setOpen(!open)}
                            className="w-11 h-11 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
                        >
                            {initials}
                        </div>

                        {open && (
                            <div className="absolute right-0 mt-3 w-48 bg-white text-black rounded-lg shadow-xl overflow-hidden z-50">
                                <button
                                    onClick={() => {
                                        navigate("/profile");
                                        setOpen(false);
                                    }}
                                    className="block w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b"
                                >
                                    <span className="mr-2">👤</span> Profile
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 transition-colors"
                                >
                                    <span className="mr-2">🚪</span> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
