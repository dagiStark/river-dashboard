import { Outlet } from "react-router-dom";
import { CalendarDays, Search } from "lucide-react";
import { Input } from "@mui/material";

const DateRangeDisplay = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex items-center space-x-2 px-4 py-2 rounded-full border border-gray-300 shadow-sm bg-white hover:shadow-md transition">
      <CalendarDays className="text-gray-500" /> {/* Calendar Icon */}
      <span className="text-sm font-medium text-gray-700">{formattedDate}</span>
    </div>
  );
};

function Main() {
  return (
    <div className="w-full h-full flex flex-col pt-3 ml-3">
      <header>
        <div className="flex justify-between items-center mr-10">
          <h1 className="text-3xl font-bold text-[#adde33]">እንኳን ደህና መጡ</h1>
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2">
              <Search />
              <Input placeholder="ፈልግ..." />
            </div>
            <div>
              <DateRangeDisplay />
            </div>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Main;
