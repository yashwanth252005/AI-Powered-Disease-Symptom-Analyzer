export default function RiskBadge({ level }) {
    let colorClasses = "";

    if (level === "Low") {
        colorClasses = "bg-green-100 text-green-700";
    } else if (level === "Medium") {
        colorClasses = "bg-yellow-100 text-yellow-700";
    } else if (level === "High") {
        colorClasses = "bg-red-100 text-red-700";
    } else {
        colorClasses = "bg-gray-100 text-gray-700";
    }

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colorClasses}`}>
            {level}
        </span>
    );
}
