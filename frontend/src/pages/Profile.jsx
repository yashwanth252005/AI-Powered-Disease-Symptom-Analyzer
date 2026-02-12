import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api";

export default function Profile() {
    const [history, setHistory] = useState([]);

    const token = localStorage.getItem("token");

    let email = "";

    if (token) {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            email = payload.sub || payload.email || "";
        } catch (err) {
            console.error("Invalid token");
        }
    }

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await API.get("/history");
                setHistory(res.data.history || []);
            } catch (err) {
                console.error("Failed to fetch history");
            }
        };

        fetchHistory();
    }, []);

    const totalPredictions = history.length;

    const averageScore =
        history.length > 0
            ? (
                history.reduce((sum, item) => sum + item.health_score, 0) /
                history.length
            ).toFixed(1)
            : 0;

    const lastPrediction =
        history.length > 0
            ? new Date(history[history.length - 1].created_at).toLocaleString()
            : "N/A";

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <Navbar />

            <div className="p-6 max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile</h1>
                    <p className="text-gray-600">Your health analytics and account information</p>
                </div>

                {/* User Info Card */}
                <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
                    <div className="flex items-center space-x-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                            {email ? email.split("@")[0][0].toUpperCase() : "U"}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                {email.split("@")[0]}
                            </h2>
                            <p className="text-gray-600 flex items-center">
                                <span className="mr-2">📧</span> {email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">
                                    Total Predictions
                                </p>
                                <h3 className="text-4xl font-bold text-white mt-2">
                                    {totalPredictions}
                                </h3>
                            </div>
                            <div className="text-5xl opacity-20">📊</div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">
                                    Avg Health Score
                                </p>
                                <h3 className="text-4xl font-bold text-white mt-2">
                                    {averageScore}
                                </h3>
                            </div>
                            <div className="text-5xl opacity-20">💯</div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm font-medium">
                                    Last Prediction
                                </p>
                                <h3 className="text-sm font-semibold text-white mt-2">
                                    {lastPrediction}
                                </h3>
                            </div>
                            <div className="text-5xl opacity-20">🕐</div>
                        </div>
                    </div>
                </div>

                {/* Activity Summary */}
                {history.length > 0 && (
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <div className="flex items-center mb-6">
                            <span className="text-2xl mr-3">📈</span>
                            <h3 className="text-xl font-bold text-gray-800">
                                Recent Activity
                            </h3>
                        </div>
                        <div className="space-y-3">
                            {history.slice(-5).reverse().map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div>
                                        <p className="font-semibold text-gray-800">{item.top_prediction}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-blue-600">{item.health_score}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
