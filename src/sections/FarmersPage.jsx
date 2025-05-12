import { useEffect, useState } from "react";
import { fetchAndDecodeFromThingSpeak } from "../utils";
import { useTranslation } from "react-i18next";

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
    <div className=" p-6 min-h-[100vh] bg-gray-50">
      <h1 className="text-2xl font-bold text-center mb-6">
        {t("farmers_overview")}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {farmers.map((farmer, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 border border-[#adde33]"
          >
            <h2 className="text-lg font-bold text-[#022213] mb-2 flex items-center gap-2">
              <img
                src="./farmer.png"
                alt="farmer picture"
                className="w-10 h-10 text-center rounded-full border-[#adde33] border-2"
              />
              {farmer.name || `Farmer ${index + 1}`}
            </h2>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>
                <strong>{t("crop_select")}</strong>{" "}
                {t(`crops.${farmer.crop.toLowerCase()}`) || "N/A"}
              </li>
              <li>
                <strong>{t("farm_land")}</strong> {farmer.landSize || "N/A"}{" "}
                hectares
              </li>
              <li>
                <strong>{t("farmers_amount")}</strong>{" "}
                {farmer.weeklyNeed || "N/A"} {t("farmers_water")}
              </li>
              <li>
                <strong>{t("farmers_allocated")}</strong>{" "}
                {farmer.allocatedWater || "N/A"} {t("farmers_water")}
              </li>
              <li>
                <strong>{t("farmers_suggestion")}</strong>{" "}
                {farmer.suggestion || "N/A"}
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FarmersPage;
