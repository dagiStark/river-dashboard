import { Logs, ChartArea, LandPlot } from "lucide-react";

export const navItems = [
  {
    name: "አጠቃላይ እይታ",
    path: "/overview",
    icon: Logs,
  },
  {
    name: "ግራፍ",
    path: "/charts",
    icon: ChartArea,
  },
  {
    name: "ተጠቃሚዎች",
    path: "/farmers",
    icon: LandPlot,
  },
];

export const dummyData = [
  { name: "Toyota", status: "Active", lastUpdate: "2023-01-01" },
  { name: "Toyota", status: "Active", lastUpdate: "2023-01-01" },
  { name: "Toyota", status: "Active", lastUpdate: "2023-01-01" },
  { name: "Toyota", status: "Active", lastUpdate: "2023-01-01" },
  { name: "Toyota", status: "Active", lastUpdate: "2023-01-01" },
  { name: "Toyota", status: "Active", lastUpdate: "2023-01-01" },
  { name: "Toyota", status: "Active", lastUpdate: "2023-01-01" },
];

export const fakeData = [
  {
    id: "1",
    vehicleName: "Toyota",
    status: "Active",
    lastUpdate: "2023-01-01",
  },
  {
    id: "2",
    vehicleName: "Toyota",
    status: "Active",
    lastUpdate: "2023-01-01",
  },
  {
    id: "3",
    vehicleName: "Toyota",
    status: "Active",
    lastUpdate: "2023-01-01",
  },
  {
    id: "4",
    vehicleName: "Toyota",
    status: "Active",
    lastUpdate: "2023-01-01",
  },
];

export const usStates = [
  { value: "received", label: "Received" },
  { value: "maintaining", label: "Maintaining" },
  { value: "delivered", label: "Delivered" },
  { value: "trashed", label: "Trashed" },
];

export const crops = [
  {
    name: "ጤፍ",
    amount: 3500,
    season: 75,
    img: "/crops/teff.jpeg",
    water: "3000-4000",
  },
  {
    name: "በቆሎ",
    amount: 6500,
    season: 105,
    img: "/crops/maize.jpeg",
    water: "5000-8000",
  },
  {
    name: "ማሽላ",
    amount: 5500,
    season: 105,
    img: "/crops/sorghum.jpeg",
    water: "4500-6500",
  },
  {
    name: "ስንዴ",
    amount: 5750,
    season: 135,
    img: "/crops/wheat.jpeg",
    water: "4500-7000",
  },
  {
    name: "ገብስ",
    amount: 5000,
    season: 120,
    img: "/crops/barley.jpeg",
    water: "4000-6000",
  },
  {
    name: "አጃ",
    amount: 6000,
    season: 110,
    img: "/crops/oats.jpeg",
    water: "5000-7000",
  },
  {
    name: "ሩዝ",
    amount: 12500,
    season: 135,
    img: "/crops/rice.jpeg",
    water: "10000-15000",
  },
  {
    name: "ድንች",
    amount: 6000,
    season: 105,
    img: "/crops/potato.jpeg",
    water: "5000-7000",
  },
  {
    name: "ስኳር ድንች",
    amount: 5000,
    season: 135,
    img: "/crops/sweet_potato.jpeg",
    water: "4000-6000",
  },
  {
    name: "ያም",
    amount: 7000,
    season: 210,
    img: "/crops/yam.jpeg",
    water: "6000-8000",
  },
  {
    name: "ካሳቫ ",
    amount: 4000,
    season: 300,
    img: "/crops/cassava.jpeg",
    water: "3000-5000",
  },
  {
    name: "ሽንኩርት",
    amount: 4500,
    season: 105,
    img: "/crops/onion.jpeg",
    water: "3500-5500",
  },
  {
    name: "ቲማቲም",
    amount: 7000,
    season: 105,
    img: "/crops/tomato.jpeg",
    water: "6000-8000",
  },
  {
    name: "ጎመን",
    amount: 4250,
    season: 80,
    img: "/crops/cabbage.jpg",
    water: "3500-5000",
  },
];

const areaChartData = [
  [
    { x: new Date(2002, 0, 1), y: 2.2 },
    { x: new Date(2003, 0, 1), y: 3.4 },
    { x: new Date(2004, 0, 1), y: 2.8 },
    { x: new Date(2005, 0, 1), y: 1.6 },
    { x: new Date(2006, 0, 1), y: 2.3 },
    { x: new Date(2007, 0, 1), y: 2.5 },
    { x: new Date(2008, 0, 1), y: 2.9 },
    { x: new Date(2009, 0, 1), y: 3.8 },
    { x: new Date(2010, 0, 1), y: 1.4 },
    { x: new Date(2011, 0, 1), y: 3.1 },
  ],
  [
    { x: new Date(2002, 0, 1), y: 2 },
    { x: new Date(2003, 0, 1), y: 1.7 },
    { x: new Date(2004, 0, 1), y: 1.8 },
    { x: new Date(2005, 0, 1), y: 2.1 },
    { x: new Date(2006, 0, 1), y: 2.3 },
    { x: new Date(2007, 0, 1), y: 1.7 },
    { x: new Date(2008, 0, 1), y: 1.5 },
    { x: new Date(2009, 0, 1), y: 2.8 },
    { x: new Date(2010, 0, 1), y: 1.5 },
    { x: new Date(2011, 0, 1), y: 2.3 },
  ],
  [
    { x: new Date(2002, 0, 1), y: 0.8 },
    { x: new Date(2003, 0, 1), y: 1.3 },
    { x: new Date(2004, 0, 1), y: 1.1 },
    { x: new Date(2005, 0, 1), y: 1.6 },
    { x: new Date(2006, 0, 1), y: 2 },
    { x: new Date(2007, 0, 1), y: 1.7 },
    { x: new Date(2008, 0, 1), y: 2.3 },
    { x: new Date(2009, 0, 1), y: 2.7 },
    { x: new Date(2010, 0, 1), y: 1.1 },
    { x: new Date(2011, 0, 1), y: 2.3 },
  ],
];

export const areaCustomSeries = [
  {
    dataSource: areaChartData[0],
    xName: "x",
    yName: "y",
    name: "USA",
    opacity: "0.8",
    type: "SplineArea",
    width: "2",
  },
  {
    dataSource: areaChartData[1],
    xName: "x",
    yName: "y",
    name: "France",
    opacity: "0.8",
    type: "SplineArea",
    width: "2",
  },
  {
    dataSource: areaChartData[2],
    xName: "x",
    yName: "y",
    name: "Germany",
    opacity: "0.8",
    type: "SplineArea",
    width: "2",
  },
];

export const generateRelatedColors = (count) => {
  const baseColors = ["#adde33", "#022213"]; // Teal and Green

  const lightenDarkenColor = (col, amt) => {
    let usePound = false;
    if (col[0] === "#") {
      col = col.slice(1);
      usePound = true;
    }

    const num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    let g = ((num >> 8) & 0x00ff) + amt;
    let b = (num & 0x0000ff) + amt;

    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));

    return (
      (usePound ? "#" : "") +
      ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
    );
  };

  const colors = [];
  for (let i = 0; i < count; i++) {
    const base = baseColors[i % baseColors.length];
    const variation = i < baseColors.length ? 0 : i * 15;
    colors.push(lightenDarkenColor(base, variation));
  }

  return colors;
};

export const COLORS = {
  riverFlow: "#2C7A7B", // Teal
  rainDrop: "#68D391", // Green
  riverLevel: "#805AD5", // Purple
};
