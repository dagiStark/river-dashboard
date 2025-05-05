import { useEffect, useState } from "react";
import { fetchAndDecodeFromThingSpeak } from "../utils";

const FarmersPage = () => {
  const [farmers, setFarmers] = useState([]);

  useEffect(() => {
    const getFarmers = async () => {
      try {
        const data = await fetchAndDecodeFromThingSpeak(); // defaults to field 5
        setFarmers(data);
      } catch (error) {
        console.error("Error fetching farmers:", error);
      }
    };

    getFarmers();
  }, []);

  return (
    <div className=" p-6 min-h-[100vh] bg-gray-50">
      <h1 className="text-2xl font-bold text-center mb-6">Farmers Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {farmers.map((farmer, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 border border-[#adde33]"
          >
            <h2 className="text-lg font-bold text-[#022213] mb-2">
              {farmer.name || `Farmer ${index + 1}`}
            </h2>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>
                <strong>Crop:</strong> {farmer.crop || "N/A"}
              </li>
              <li>
                <strong>Land Size:</strong> {farmer.landSize || "N/A"} hectares
              </li>
              <li>
                <strong>Weekly Need:</strong> {farmer.weeklyNeed || "N/A"}{" "}
                liters
              </li>
              <li>
                <strong>Allocated Water:</strong>{" "}
                {farmer.allocatedWater || "N/A"} liters
              </li>
              <li>
                <strong>Suggestion:</strong> {farmer.suggestion || "N/A"}
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FarmersPage;
