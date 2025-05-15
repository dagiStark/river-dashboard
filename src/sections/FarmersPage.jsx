import { useEffect, useState } from "react";
import { fetchAndDecodeFromThingSpeak } from "../utils";
import { useTranslation } from "react-i18next";
import { capitalizeName } from "../utils";

const FarmersPage = () => {
  const [farmers, setFarmers] = useState([]);
  const { t } = useTranslation();

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
    <div className="p-6 min-h-[100vh] bg-gradient-to-br from-gray-50 to-gray-100 mt-5">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-gray-800 tracking-tight">
        {t("farmers_overview")}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {farmers.map((farmer, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-xl p-6 border border-[#adde33] hover:shadow-xl transition-shadow duration-300 ease-in-out"
          >
            <div className="flex items-center gap-3 mb-4">
              <img
                src="./farmer.png"
                alt="farmer picture"
                className="w-12 h-12 rounded-full border-2 border-[#adde33] object-cover"
              />
              <h2 className="text-xl font-semibold text-[#022213] truncate">
                {capitalizeName(farmer.name) || `Farmer ${index + 1}`}
              </h2>
            </div>
            <ul className="text-sm text-gray-600 space-y-3">
              <li className="flex items-center gap-2">
                <span className="text-[#022213] font-medium">
                  {t("crop_select")}:
                </span>
                <span className="text-gray-700">
                  {t(`${farmer.crop.toLowerCase()}`) || "N/A"}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#022213] font-medium">
                  {t("farm_land")}:
                </span>
                <span className="text-gray-700">
                  {farmer.landSize || "N/A"} {t("hectare")}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#022213] font-medium">
                  {t("farmers_amount")}:
                </span>
                <span className="text-gray-700">
                  {farmer.weeklyNeed || "N/A"} {t("farmers_water")}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#022213] font-medium">
                  {t("farmers_allocated")}:
                </span>
                <span className="text-gray-700">
                  {farmer.allocatedWater || "N/A"} {t("farmers_water")}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#022213] font-medium">
                  {t("suggestion")}:
                </span>
                <span className="text-gray-700">
                  {farmer.suggestion || "N/A"}
                </span>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FarmersPage;
