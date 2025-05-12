import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { fetchAndDecodeFromThingSpeak } from "../utils";
import { generateRelatedColors } from "../constants";
import { useTranslation } from "react-i18next";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  BarElement,
  CategoryScale,
  LinearScale
);

// Optional: Customize labels inside pie segments
const customPieLabel = {
  id: "customPieLabel",
  afterDatasetsDraw(chart) {
    const {
      ctx,
      chartArea: { width },
    } = chart;
    const dataset = chart.data.datasets[0];
    const total = dataset.data.reduce((acc, val) => acc + val, 0);

    dataset.data.forEach((value, index) => {
      const meta = chart.getDatasetMeta(0).data[index];
      const midAngle = (meta.startAngle + meta.endAngle) / 2;
      const radius = (meta.outerRadius + meta.innerRadius) / 2;

      const x = meta.x + Math.cos(midAngle) * radius * 0.85;
      const y = meta.y + Math.sin(midAngle) * radius * 0.85;

      const percentage = ((value / total) * 100).toFixed(1) + "%";

      ctx.save();
      ctx.fillStyle = "#ffffff"; // Use black for better visibility
      ctx.font = `${Math.max(15, width * 0.025)}px Arial`; // Dynamic font size
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(percentage, x, y);
      ctx.restore();
    });
  },
};

const CircularChart = () => {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const farmers = await fetchAndDecodeFromThingSpeak();
      const fallback = () => Math.floor(Math.random() * 100 + 10);

      const dataValues = farmers.map((f) => f.allocatedWater || fallback());
      const labels = farmers.map((f) => f.name);
      const backgroundColors = generateRelatedColors(farmers.length);

      setChartData({
        labels,
        datasets: [
          {
            label: "Allocated Water",
            data: dataValues,
            backgroundColor: backgroundColors,
            borderWidth: 0,
          },
        ],
      });
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: t("right_dist"),
        font: { size: 16, weight: "bold" },
        padding: { top: 10, bottom: 10 },
      },
      tooltip: { enabled: false },
      legend: { display: false },
    },
  };

  if (!chartData) return <p>Loading chart...</p>;

  return (
    <div className="w-72 mx-auto p-4 bg-gray-100 rounded-md shadow-lg">
      <Pie data={chartData} options={options} plugins={[customPieLabel]} />
      <div className="mt-4 flex flex-wrap justify-center gap-2 text-wrap">
        {chartData.labels.map((name, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: chartData.datasets[0].backgroundColor[index],
              }}
            ></span>
            <p className="text-sm">{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

function RightOverview() {
  return (
    <div className="border-2 p-4 rounded-lg">
      <div className="flex flex-col items-center justify-between">
        <div className="mt-2">
          <CircularChart />
        </div>
        <div>
          <img src="./river.png" alt="" className="w-80 max-h-96"/>
        </div>
      </div>
    </div>
  );
}

export default RightOverview;
