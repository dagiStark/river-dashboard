// calculation.js
export const cropsT = [
    { name: "Teff", waterPerHectare: 500 },  // Example: 500 m³ per hectare
    { name: "Wheat", waterPerHectare: 600 },
    { name: "Maize", waterPerHectare: 700 }
  ];
  
  export function calculateWaterNeeded(cropName, landSize) {
    const crop = cropsT.find(c => c.name === cropName);
    if (!crop || isNaN(landSize)) return 0;
    return crop.waterPerHectare * landSize;
  }
  