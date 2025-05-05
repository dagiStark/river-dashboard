// utils/fetchAndCacheAveragedData.js

export const fetchAndCacheAveragedData = async () => {
  const cacheKey = "monthlyAverages";
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const CHANNEL_ID = "2820881";
  const MAX_RESULTS = 8000;

  const res = await fetch(
    `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=YF0V5ZPCZUEDAKGC&results=${MAX_RESULTS}`
  );
  const data = await res.json();

  const grouped = {};

  data.feeds.forEach((feed) => {
    const date = new Date(feed.created_at);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    if (!grouped[monthKey]) {
      grouped[monthKey] = {
        riverLevel: [],
        riverFlow: [],
        rainDrop: [],
      };
    }

    if (feed.field2) grouped[monthKey].riverLevel.push(Number(feed.field2));
    if (feed.field3) grouped[monthKey].riverFlow.push(Number(feed.field3));
    if (feed.field4) grouped[monthKey].rainDrop.push(Number(feed.field4));
  });

  const sortedMonths = Object.keys(grouped).sort().slice(-12);

  const result = {
    riverLevel: {},
    riverFlow: {},
    rainDrop: {},
  };

  sortedMonths.forEach((month) => {
    const { riverLevel, riverFlow, rainDrop } = grouped[month];
    if (riverLevel.length) {
      result.riverLevel[month] =
        riverLevel.reduce((a, b) => a + b, 0) / riverLevel.length;
    }
    if (riverFlow.length) {
      result.riverFlow[month] =
        riverFlow.reduce((a, b) => a + b, 0) / riverFlow.length;
    }
    if (rainDrop.length) {
      result.rainDrop[month] =
        rainDrop.reduce((a, b) => a + b, 0) / rainDrop.length;
    }
  });

  localStorage.setItem(cacheKey, JSON.stringify(result));
  return result;
};

export const distributeWater = (rows, crops, riverFlowLPM) => {
  const totalRiverWaterPerWeek = riverFlowLPM * 60 * 24 * 7; // L/week
  const results = [];

  // Get weekly requirement per crop type
  const cropWeeklyNeeds = {};
  crops.forEach((crop) => {
    const weekly = (parseFloat(crop.amount) / crop.season) * 7;
    cropWeeklyNeeds[crop.name] = weekly;
  });

  // Compute each farmer's weekly need
  const farmers = rows.map((row) => {
    const weeklyNeedPerHa = cropWeeklyNeeds[row.crop];
    const totalNeed = weeklyNeedPerHa * parseFloat(row.landSize || 0);
    return {
      ...row,
      weeklyNeed: totalNeed,
    };
  });

  // Sort by water need (increasing)
  farmers.sort((a, b) => a.weeklyNeed - b.weeklyNeed);

  let remainingWater = totalRiverWaterPerWeek;
  let allocations = Array(farmers.length).fill(0);
  let i = 0;

  while (i < farmers.length) {
    const share = remainingWater / (farmers.length - i);

    if (share >= farmers[i].weeklyNeed) {
      allocations[i] = farmers[i].weeklyNeed;
      remainingWater -= farmers[i].weeklyNeed;
      i++;
    } else {
      for (let j = i; j < farmers.length; j++) {
        allocations[j] = share;
      }
      break;
    }
  }

  // Build result per farmer
  for (let j = 0; j < farmers.length; j++) {
    const farmer = farmers[j];
    const allocated = allocations[j];
    const cropWeekly = cropWeeklyNeeds[farmer.crop];
    const suggestedLandSize = allocated / cropWeekly;

    results.push({
      name: farmer.name || `Farmer ${j + 1}`,
      crop: farmer.crop,
      landSize: farmer.landSize,
      weeklyNeed: farmer.weeklyNeed.toFixed(2),
      allocatedWater: allocated.toFixed(2),
      suggestion:
        allocated >= farmer.weeklyNeed
          ? "Sufficient water for planned land size."
          : `Can only irrigate ${suggestedLandSize.toFixed(2)} ha.`,
    });
  }

  return {
    totalRiverWaterPerWeek: totalRiverWaterPerWeek.toFixed(2),
    results,
  };
};

export const calculateWaterNeeded = (cropName, landSize, crops) => {
  const crop = crops.find((c) => c.name === cropName);
  if (!crop || isNaN(landSize)) return 0;
  return crop.amount * landSize;
};

export const encodeFullDistributionData = (results) => {
  const raw = results
    .map(
      (f) =>
        `${f.name}|${f.crop}|${f.landSize}|${f.weeklyNeed}|${f.allocatedWater}|${f.suggestion}`
    )
    .join(";");
  return encodeURIComponent(raw);
};

export const fetchAndDecodeFromThingSpeak = async (fieldNumber = 5) => {
  try {
    const channelId = "2820881";
    const readApiKey = "YF0V5ZPCZUEDAKGC";

    const url = `https://api.thingspeak.com/channels/${channelId}/fields/${fieldNumber}.json?api_key=${readApiKey}&results=1`;

    const response = await fetch(url);
    const data = await response.json();

    const encodedString = data.feeds?.[0]?.[`field${fieldNumber}`];

    if (!encodedString) {
      throw new Error("No encoded data found in the response.");
    }

    const decodedString = decodeURIComponent(encodedString);

    const entries = decodedString.split(";");
    const results = entries.map((entry) => {
      const [name, crop, landSize, weeklyNeed, allocatedWater, suggestion] =
        entry.split("|");
      return {
        name,
        crop,
        landSize: parseFloat(landSize),
        weeklyNeed: parseFloat(weeklyNeed),
        allocatedWater: parseFloat(allocatedWater),
        suggestion,
      };
    });

    return results;
  } catch (error) {
    console.error("Failed to fetch and decode ThingSpeak data:", error);
    return [];
  }
};

export const sendToThingSpeak = async (encodedData) => {
  console.log("Sending data to ThingSpeak:", encodedData);
  const apiKey = "LXCXVTAMESKF563W";
  const url = `https://api.thingspeak.com/update?api_key=${apiKey}&field5=${encodedData}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error("ThingSpeak update failed:", response.statusText);
    } else {
      console.log("Data sent to ThingSpeak successfully");
    }
  } catch (error) {
    console.error("ThingSpeak request error:", error);
  }
};
