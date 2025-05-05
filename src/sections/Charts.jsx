import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
);

// Generate last 12 months
const getLastTwelveMonths = () => {
  const months = [];
  const today = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push(
      date.toLocaleString("default", { month: "short", year: "numeric" })
    );
  }
  return months;
};

const fallbackData = {
  labels: getLastTwelveMonths(),
  riverFlow: new Array(12).fill(0),
  rainDrop: new Array(12).fill(0),
  riverLevel: new Array(12).fill(0),
};

const COLORS = {
  riverFlow: "#2C7A7B", // Teal
  rainDrop: "#68D391", // Green
  riverLevel: "#805AD5", // Purple
};

const fetchThingSpeakData = async () => {
  try {
    const response = await fetch(
      "https://api.thingspeak.com/channels/2820881/feeds.json?api_key=YF0V5ZPCZUEDAKGC&results=1000"
    );
    const result = await response.json();
    console.log("Fetched data:", result);
    return result.feeds || []; // ✅ Fix here
  } catch (error) {
    console.error("ThingSpeak fetch failed:", error);
    return [];
  }
};

const processData = (rawData) => {
  if (!rawData || rawData.length === 0) return fallbackData;

  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const monthlyData = {};
  rawData.forEach((entry) => {
    const date = new Date(entry.created_at);
    if (
      date >= twelveMonthsAgo &&
      entry.field2 &&
      entry.field3 &&
      entry.field4
    ) {
      const label = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      if (!monthlyData[label]) {
        monthlyData[label] = { flow: [], drop: [], level: [] };
      }
      monthlyData[label].flow.push(parseFloat(entry.field3));
      monthlyData[label].drop.push(parseFloat(entry.field4));
      monthlyData[label].level.push(parseFloat(entry.field2));
    }
  });

  const labels = getLastTwelveMonths();
  const riverFlow = [];
  const rainDrop = [];
  const riverLevel = [];

  labels.forEach((label) => {
    const group = monthlyData[label];
    if (group) {
      const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
      riverFlow.push(avg(group.flow));
      rainDrop.push(avg(group.drop));
      riverLevel.push(avg(group.level));
    } else {
      riverFlow.push(0);
      rainDrop.push(0);
      riverLevel.push(0);
    }
  });

  return { labels, riverFlow, rainDrop, riverLevel };
};

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: {
        color: "#333",
        font: {
          size: 13,
          weight: "bold",
        },
      },
    },
    tooltip: {
      mode: "index",
      intersect: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: "#e2e8f0",
      },
      ticks: {
        color: "#4A5568",
        font: { size: 11 },
      },
    },
    x: {
      grid: {
        color: "#edf2f7",
      },
      ticks: {
        color: "#4A5568",
        font: { size: 11 },
      },
    },
  },
};

const createChartData = (labels, data, label, color, fill = false) => ({
  labels,
  datasets: [
    {
      label,
      data,
      borderColor: color,
      backgroundColor: fill
        ? `${color}33` // Soft transparency
        : "transparent",
      pointBackgroundColor: color,
      tension: 0.5,
      pointRadius: 4,
      pointHoverRadius: 6,
      fill,
    },
  ],
});

export default function EnvironmentalCharts() {
  const [labels, setLabels] = useState(fallbackData.labels);
  const [riverFlowData, setRiverFlowData] = useState(fallbackData.riverFlow);
  const [rainDropData, setRainDropData] = useState(fallbackData.rainDrop);
  const [riverLevelData, setRiverLevelData] = useState(fallbackData.riverLevel);

  useEffect(() => {
    const loadData = async () => {
      const rawData = await fetchThingSpeakData();
      const { labels, riverFlow, rainDrop, riverLevel } = processData(rawData);
      setLabels(labels);
      setRiverFlowData(riverFlow);
      setRainDropData(rainDrop);
      setRiverLevelData(riverLevel);
    };

    loadData();
  }, []);

  const cardStyle = {
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.05)",
    padding: "10px",
    height: "320px",
  };

  return (
    <div
      style={{
        display: "grid",
        gap: "16px",
        padding: "10px",
        height: "750px",
        boxSizing: "border-box",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "0.9fr 1.1fr",
        gridTemplateAreas: `
          "chart1 chart2 chart3"
          "combined combined combined"
        `,
        overflow: "hidden",
        marginTop: "20px",
      }}
    >
      <div style={{ ...cardStyle, gridArea: "chart1", overflow: "hidden" }}>
        <div style={{ height: "100%", minHeight: 0 }}>
          <Line
            data={createChartData(
              labels,
              riverFlowData,
              "River Flow",
              COLORS.riverFlow
            )}
            options={commonOptions}
          />
        </div>
      </div>

      <div style={{ ...cardStyle, gridArea: "chart2", overflow: "hidden" }}>
        <div style={{ height: "100%", minHeight: 0 }}>
          <Line
            data={createChartData(
              labels,
              rainDropData,
              "Rain Drop",
              COLORS.rainDrop
            )}
            options={commonOptions}
          />
        </div>
      </div>

      <div style={{ ...cardStyle, gridArea: "chart3", overflow: "hidden" }}>
        <div style={{ height: "100%", minHeight: 0 }}>
          <Line
            data={createChartData(
              labels,
              riverLevelData,
              "River Level",
              COLORS.riverLevel
            )}
            options={commonOptions}
          />
        </div>
      </div>

      <div style={{ ...cardStyle, gridArea: "combined", overflow: "hidden" }}>
        <div style={{ height: "100%", minHeight: 0 }}>
          <Line
            data={{
              labels,
              datasets: [
                {
                  label: "River Flow",
                  data: riverFlowData,
                  borderColor: COLORS.riverFlow,
                  backgroundColor: `${COLORS.riverFlow}33`,
                  fill: true,
                  tension: 0.5,
                  pointRadius: 3,
                  pointHoverRadius: 5,
                },
                {
                  label: "Rain Drop",
                  data: rainDropData,
                  borderColor: COLORS.rainDrop,
                  backgroundColor: `${COLORS.rainDrop}33`,
                  fill: true,
                  tension: 0.5,
                  pointRadius: 3,
                  pointHoverRadius: 5,
                },
                {
                  label: "River Level",
                  data: riverLevelData,
                  borderColor: COLORS.riverLevel,
                  backgroundColor: `${COLORS.riverLevel}33`,
                  fill: true,
                  tension: 0.5,
                  pointRadius: 3,
                  pointHoverRadius: 5,
                },
              ],
            }}
            options={commonOptions}
          />
        </div>
      </div>
    </div>
  );
}
