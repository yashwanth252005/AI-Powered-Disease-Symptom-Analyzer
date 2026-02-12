import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
);

export default function HealthChart({ history }) {
    if (!history || history.length === 0) {
        return <p className="text-gray-500">No data available</p>;
    }

    const sortedHistory = [...history].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );

    const data = {
        labels: sortedHistory.map((item) =>
            new Date(item.created_at).toLocaleDateString()
        ),
        datasets: [
            {
                label: "Health Score",
                data: sortedHistory.map((item) => item.health_score),
                borderColor: "#3b82f6",
                backgroundColor: "#3b82f6",
                tension: 0.3,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            y: {
                min: 0,
                max: 100,
            },
        },
    };

    return <Line data={data} options={options} />;
}
