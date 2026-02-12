import { useEffect, useState } from "react";
import API from "../api";
import PredictionForm from "../components/PredictionForm";
import HealthChart from "../components/HealthChart";
import Navbar from "../components/Navbar";
import RiskBadge from "../components/RiskBadge";


export default function Dashboard() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await API.get("/history");
            setHistory(res.data.history);
        } catch (error) {
            console.error("Error fetching history:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <Navbar />

            <div className="p-6 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Health Dashboard
                    </h1>
                    <p className="text-gray-600">Monitor your health metrics and predictions</p>
                </div>

                {/* SUMMARY CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Latest Health Score */}
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Latest Health Score</p>
                                <h2 className="text-4xl font-bold text-white mt-2">
                                    {history.length > 0
                                        ? history[history.length - 1].health_score
                                        : "--"}
                                </h2>
                            </div>
                            <div className="text-5xl opacity-20">💯</div>
                        </div>
                    </div>

                    {/* Latest Risk Level */}
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm font-medium">Latest Risk Level</p>
                                <div className="mt-3">
                                    {history.length > 0 ? (
                                        <div className="bg-white px-4 py-2 rounded-lg inline-block">
                                            <RiskBadge level={history[history.length - 1].risk_level} />
                                        </div>
                                    ) : (
                                        <span className="text-white text-2xl">--</span>
                                    )}
                                </div>
                            </div>
                            <div className="text-5xl opacity-20">⚠️</div>
                        </div>
                    </div>

                    {/* Total Predictions */}
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Total Predictions</p>
                                <h2 className="text-4xl font-bold text-white mt-2">
                                    {history.length}
                                </h2>
                            </div>
                            <div className="text-5xl opacity-20">📊</div>
                        </div>
                    </div>
                </div>

                {/* Prediction Form */}
                <PredictionForm />

                {/* Prediction History */}
                <div className="mt-8 bg-white p-6 shadow-lg rounded-xl">
                    <div className="flex items-center mb-6">
                        <span className="text-2xl mr-3">📋</span>
                        <h3 className="text-xl font-bold text-gray-800">
                            Prediction History
                        </h3>
                    </div>

                    {history.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🏥</div>
                            <p className="text-gray-500 text-lg">
                                No predictions yet. Start by analyzing your symptoms above.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {history.map((item, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow duration-200 bg-gradient-to-r from-white to-gray-50"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-800 text-lg">
                                                {item.top_prediction}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                🕒 {new Date(item.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                        <RiskBadge level={item.risk_level} />
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Health Score</span>
                                            <span className="font-bold text-blue-600 text-lg">{item.health_score}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Health Score Chart */}
                <div className="mt-8 bg-white p-6 shadow-lg rounded-xl">
                    <div className="flex items-center mb-6">
                        <span className="text-2xl mr-3">📈</span>
                        <h3 className="text-xl font-bold text-gray-800">
                            Health Score Trend
                        </h3>
                    </div>
                    {history.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p>Chart will appear after your first prediction</p>
                        </div>
                    ) : (
                        <HealthChart history={history} />
                    )}
                </div>
            </div>
        </div>
    );

}
