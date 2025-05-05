import { Ellipsis, TrendingUp, TrendingDown, Box } from "lucide-react";
import { useState, useEffect } from "react";
import { crops } from "../constants";
import { Trash2, Plus } from "lucide-react";
import {
  fetchAndCacheAveragedData,
  distributeWater,
  encodeFullDistributionData,
  sendToThingSpeak,
  calculateWaterNeeded,
} from "../utils";
import WaterDistributionDialog from "./WaterDistributionDialog";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";

// Register required components for Bar chart
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const getPercentChange = (latest, prev) => {
  if (!prev || prev === 0) return { percent: 0, up: true };
  const change = ((latest - prev) / prev) * 100;
  return {
    percent: change.toFixed(1),
    up: change >= 0,
  };
};

function LeftOverview() {
  const [showDialog, setShowDialog] = useState(false);
  const [distributionResult, setDistributionResult] = useState(null);

  const [rows, setRows] = useState([
    { name: "", crop: crops[0].name, landSize: "" },
  ]);

  const [data, setData] = useState({
    riverLevel: null,
    riverFlow: null,
    rainDrop: null,
  });
  const [deltas, setDeltas] = useState({});

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([...rows, { name: "", crop: crops[0].name, landSize: "" }]);
  };

  const handleCalculate = async () => {
    const result = distributeWater(rows, crops, data.riverFlow || 0);
    console.log("Result: ", result.results);
    setDistributionResult(result);

    const encoded = encodeFullDistributionData(result.results);
    await sendToThingSpeak(encoded);
    setShowDialog(true);
  };

  useEffect(() => {
    fetchAndCacheAveragedData().then((result) => {
      const last12 = Object.keys(result.riverFlow).sort().slice(-2);
      const [prevMonth, currentMonth] = last12;

      const riverLevel = result.riverLevel[currentMonth] || 0;
      const riverFlow = result.riverFlow[currentMonth] || 0;
      const rainDrop = result.rainDrop[currentMonth] || 0;

      setData({ riverLevel, riverFlow, rainDrop });

      setDeltas({
        riverLevel: getPercentChange(
          result.riverLevel[currentMonth],
          result.riverLevel[prevMonth]
        ),
        riverFlow: getPercentChange(
          result.riverFlow[currentMonth],
          result.riverFlow[prevMonth]
        ),
        rainDrop: getPercentChange(
          result.rainDrop[currentMonth],
          result.rainDrop[prevMonth]
        ),
      });
    });
  }, []);

  const cards = [
    {
      title: "River Flow",
      value: data.riverFlow,
      unit: "L/min",
      delta: deltas.riverFlow,
    },
    {
      title: "River Level",
      value: data.riverLevel,
      unit: "m",
      delta: deltas.riverLevel,
    },
    {
      title: "Rain Drop",
      value: data.rainDrop,
      unit: "mm",
      delta: deltas.rainDrop,
    },
  ];

  return (
    <div className="border-2 p-4 rounded-lg">
      {/* upper section */}
      <div>
        <div className="flex items-center justify-between gap-5 ">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Overview</h1>
            <p className="text-sm text-black/80">
              An IoT system for monitoring, optimizing irrigation and ensuring
              sustainable water management.
            </p>
          </div>
          <div>space holder</div>
        </div>

        <div className="flex items-center justify-between gap-5 mt-5">
          {cards.map(({ title, value, unit, delta }) => (
            <div
              key={title}
              className="flex flex-col items-start justify-between gap-2  p-5 rounded-2xl text-wrap w-[33%] h-48 border-2"
            >
              <div className="flex items-center justify-between w-full">
                <h1 className="text-black/80 font-bold">{title}</h1>
                <Ellipsis />
              </div>
              <div className="relative flex items-center justify-between w-full">
                <p className="font-semibold text-3xl pl-3">
                  {value ? value.toFixed(1) : "0"}{" "}
                  <span className="text-lg align-super">{unit}</span>
                </p>
              </div>
              <div>
                <p className="flex gap-1">
                  <span
                    className={`font-medium flex ${
                      delta?.up ? "text-[#3eff34]" : "text-red-500"
                    }`}
                  >
                    {delta?.up ? <TrendingUp /> : <TrendingDown />}
                    {delta?.percent}%
                  </span>{" "}
                  from last month
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* lower section */}
      <div className="flex justify-between mt-5 gap-5">
        <div className="flex flex-col w-[40%] border-2 p-4 rounded-lg">
          <div className="flex justify-between items-center w-full">
            <h1 className="font-semibold text-lg">Crop types</h1>
            <p>
              Amount of water<span> (L/ha)</span>
            </p>
          </div>

          <div className="mt-2 max-h-80 overflow-y-auto pr-2 scroll-thin">
            {crops.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center gap-2 mt-2 mr-2"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[#022213] font-medium flex bg-black/10 rounded-full p-1 text-center">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-10 h-10 rounded-full"
                    />
                  </span>
                  <div className="flex flex-col">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-black/60">{item.date}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <p>{item.water}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col w-[60%] border-2 p-4 rounded-lg gap-5">
          <div className="flex items-center justify-between pl-3 pr-3">
            <h1 className="text-xl font-semibold">Calculation</h1>
            <div className="flex gap-2">
              <p className="text-black/60 flex gap-1">
                <span className="text-[#022213] font-medium flex">
                  <Box />
                </span>
                make sure to add your land size
              </p>
              {/* <p className="text-black/60 flex gap-1">
                <span className="text-[#adde33] font-medium flex">
                  <Box />
                </span>
                Expenses
              </p> */}
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto scroll-thin">
            <div className="space-y-6 p-4 max-w-4xl mx-auto">
              {rows.map((row, index) => {
                const waterNeeded = calculateWaterNeeded(
                  row.crop,
                  parseFloat(row.landSize),
                  crops
                );

                return (
                  <div
                    key={index}
                    className="grid grid-cols-4 gap-4 p-4 border rounded border-black/20 relative"
                  >
                    {/* Name */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium mb-1">Name</label>
                      <input
                        type="text"
                        value={row.name}
                        onChange={(e) =>
                          handleChange(index, "name", e.target.value)
                        }
                        className="border p-2 rounded"
                      />
                    </div>

                    {/* Crop Select */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium mb-1">
                        Crop Type
                      </label>
                      <select
                        value={row.crop}
                        onChange={(e) =>
                          handleChange(index, "crop", e.target.value)
                        }
                        className="border p-2 rounded"
                      >
                        {crops.map((crop) => (
                          <option key={crop.name} value={crop.name}>
                            {crop.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Land Size */}
                    <div className="flex flex-col">
                      <label className="text-sm font-medium mb-1">
                        Land Size (ha)
                      </label>
                      <input
                        type="number"
                        value={row.landSize}
                        onChange={(e) =>
                          handleChange(index, "landSize", e.target.value)
                        }
                        className="border p-2 rounded"
                      />
                    </div>

                    {/* Water Needed */}
                    <div className="flex flex-col justify-end">
                      <label className="text-sm font-medium mb-1">
                        Water Needed
                      </label>
                      <p className="p-2 border rounded bg-gray-100 font-semibold">
                        {waterNeeded} L
                      </p>
                    </div>
                    <button
                      className="absolute bottom-2 right-2"
                      // onClick={() => handleDelete(index)}
                    >
                      <Trash2 className="text-red-600 w-4 h-4" />
                    </button>
                  </div>
                );
              })}

              {/* Add Row Button */}
              <div className="flex justify-start gap-4 pt-4">
                <button
                  onClick={addRow}
                  className="px-4 py-2 bg-[#103524] text-white rounded hover:bg-[#aaab11]"
                >
                  <Plus />
                </button>
                <button
                  onClick={handleCalculate}
                  className="px-4 py-2 bg-[#103524] text-white rounded hover:bg-[#aaab11]"
                >
                  Calculate
                </button>

                {distributionResult && (
                  <WaterDistributionDialog
                    open={showDialog}
                    onOpenChange={setShowDialog}
                    results={distributionResult.results}
                    totalWater={distributionResult.totalRiverWaterPerWeek}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftOverview;
