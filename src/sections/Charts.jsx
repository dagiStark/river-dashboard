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
import { fetchThingSpeakData, processData, fallbackData } from "../utils";
import { COLORS } from "../constants";
import { useTranslation } from "react-i18next";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
);

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
  const { t } = useTranslation();

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
              t("cards.riverFlowTitle"),
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
              t("cards.rainDropTitle"),
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
              t("cards.riverLevelTitle"),
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
                  label: t("cards.riverFlowTitle"),
                  data: riverFlowData,
                  borderColor: COLORS.riverFlow,
                  backgroundColor: `${COLORS.riverFlow}33`,
                  fill: true,
                  tension: 0.5,
                  pointRadius: 3,
                  pointHoverRadius: 5,
                },
                {
                  label: t("cards.rainDropTitle"),
                  data: rainDropData,
                  borderColor: COLORS.rainDrop,
                  backgroundColor: `${COLORS.rainDrop}33`,
                  fill: true,
                  tension: 0.5,
                  pointRadius: 3,
                  pointHoverRadius: 5,
                },
                {
                  label: t("cards.riverLevelTitle"),
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
