import { useState } from "react";
import API from "../api";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            await API.post("/signup", { email, password });
            alert("Signup successful! Please login.");
            navigate("/");
        } catch (error) {
            alert(error.response?.data?.detail || "Signup failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all hover:scale-105">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🆕</div>
                    <h2 className="text-3xl font-bold text-gray-800">
                        Create Account
                    </h2>
                    <p className="text-gray-600 mt-2">Join AI Health Platform</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="border-2 border-gray-200 p-3 w-full rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            placeholder="Create a password"
                            className="border-2 border-gray-200 p-3 w-full rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    onClick={handleSignup}
                    className="mt-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white w-full py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                    Sign Up
                </button>

                <p className="text-sm text-center mt-6 text-gray-600">
                    Already have an account?{" "}
                    <Link to="/" className="text-purple-600 hover:text-purple-700 font-semibold hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
