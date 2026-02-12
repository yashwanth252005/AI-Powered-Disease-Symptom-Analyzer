import { useEffect, useState } from "react";
import API from "../api";
import RiskBadge from "./RiskBadge";

export default function PredictionForm() {
    const [allSymptoms, setAllSymptoms] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSymptoms = async () => {
            try {
                const res = await API.get("/symptoms");
                setAllSymptoms(res.data.symptoms);
            } catch (err) {
                console.error("Failed to load symptoms");
            }
        };

        fetchSymptoms();
    }, []);

    const toggleSymptom = (symptom) => {
        if (selectedSymptoms.includes(symptom)) {
            setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
        } else {
            setSelectedSymptoms([...selectedSymptoms, symptom]);
        }
    };

    const handlePredict = async () => {
        if (selectedSymptoms.length === 0) {
            alert("Select at least one symptom.");
            return;
        }

        setLoading(true);

        try {
            const res = await API.post("/predict", {
                symptoms: selectedSymptoms
            });
            setResult(res.data.prediction);
        } catch (err) {
            alert("Prediction failed");
        }

        setLoading(false);
    };

    const filteredSymptoms = allSymptoms.filter(symptom =>
        symptom.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-white p-6 shadow-lg rounded-xl mb-8">
            <div className="flex items-center mb-6">
                <span className="text-2xl mr-3">🔍</span>
                <h3 className="text-xl font-bold text-gray-800">
                    Symptom Selection
                </h3>
            </div>

            {/* Search */}
            <div className="relative mb-4">
                <span className="absolute left-3 top-3 text-gray-400">🔎</span>
                <input
                    type="text"
                    placeholder="Search symptoms..."
                    className="border-2 border-gray-200 w-full pl-10 pr-4 py-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Selected Symptoms Pills */}
            {selectedSymptoms.length > 0 && (
                <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Selected Symptoms ({selectedSymptoms.length})</p>
                    <div className="flex flex-wrap gap-2 bg-blue-50 p-3 rounded-lg">
                        {selectedSymptoms.map((symptom) => (
                            <span
                                key={symptom}
                                onClick={() => toggleSymptom(symptom)}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                            >
                                {symptom} <span className="ml-1 font-bold">✕</span>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Symptom List */}
            <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">Available Symptoms</p>
                <div className="max-h-64 overflow-y-auto border-2 border-gray-200 rounded-lg p-3 bg-gray-50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {filteredSymptoms.slice(0, 50).map((symptom) => (
                            <button
                                key={symptom}
                                onClick={() => toggleSymptom(symptom)}
                                className={`text-sm px-4 py-2.5 rounded-lg border-2 transition-all duration-200 font-medium ${selectedSymptoms.includes(symptom)
                                        ? "bg-blue-100 border-blue-500 text-blue-700 shadow-md"
                                        : "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                                    }`}
                            >
                                {selectedSymptoms.includes(symptom) ? "✓ " : ""}{symptom}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <button
                onClick={handlePredict}
                disabled={loading || selectedSymptoms.length === 0}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
            >
                {loading ? (
                    <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                    </span>
                ) : (
                    <span>🔬 Analyze Health Risk</span>
                )}
            </button>

            {/* Result */}
            {result && (
                <div className="mt-8 border-t-2 border-gray-200 pt-6 animate-fadeIn">
                    <div className="flex items-center mb-6">
                        <span className="text-2xl mr-3">🧪</span>
                        <h4 className="font-bold text-xl text-gray-800">
                            AI Risk Analysis Results
                        </h4>
                    </div>

                    {/* Top Prediction Highlight */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-6 border-2 border-blue-200 shadow-md">
                        <p className="text-sm font-semibold text-blue-600 mb-2">
                            🎯 Most Likely Condition
                        </p>
                        <p className="text-2xl font-bold text-gray-800 mb-3">
                            {result.top_prediction}
                        </p>

                        <div className="flex items-center space-x-4 mt-4">
                            <div>
                                <RiskBadge level={result.risk_level} />
                            </div>
                            <div className="flex-1 text-right">
                                <p className="text-sm text-gray-600">Health Score</p>
                                <p className="text-3xl font-bold text-blue-600">{result.health_score}</p>
                            </div>
                        </div>
                    </div>

                    {/* Probability List */}
                    <div>
                        <p className="font-semibold text-gray-700 mb-4">📊 Top 3 Predictions</p>
                        <div className="space-y-4">
                            {result.top_3_predictions.map((item, index) => {
                                const percentage = (item.probability * 100).toFixed(1);
                                const isTop = index === 0;

                                return (
                                    <div key={index} className={`p-4 rounded-lg border-2 ${isTop ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-gray-50"
                                        }`}>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-semibold text-gray-800">
                                                {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"} {item.disease}
                                            </span>
                                            <span className="font-bold text-lg text-blue-600">{percentage}%</span>
                                        </div>

                                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                            <div
                                                className={`h-3 rounded-full transition-all duration-1000 ${isTop ? "bg-gradient-to-r from-blue-500 to-blue-600" : "bg-gradient-to-r from-gray-400 to-gray-500"
                                                    }`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
