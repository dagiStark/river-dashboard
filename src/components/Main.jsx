import { Outlet } from "react-router-dom";
import { CalendarDays, Search } from "lucide-react";
import { Input } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

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
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(localStorage.getItem("language") || "en");

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    setLang(lang);
  };

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <header className="overflow-hidden shadow-xl shadow-gray-300">
        <div
          className="flex justify-between items-center bg-cover bg-center bg-no-repeat py-2 px-4"
          style={{ backgroundImage: "url('/bg.png')" }}
        >
          <h1 className="text-4xl font-extrabold text-black/80">
            {t("welcome")}
          </h1>
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2 text-white">
              <Search />
              <Input placeholder={`${t("search")}...`} className="bg-white/70 rounded-xl px-2 focus:cursor-help" />
            </div>
            <div>
              <DateRangeDisplay />
            </div>
            <div className="">
              <select
                value={lang}
                onChange={(e) => changeLanguage(e.target.value)}
                className="border border-gray-300 rounded-lg px-2 py-1"
              >
                <option value="en">English</option>
                <option value="am">አማርኛ</option>
              </select>
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
