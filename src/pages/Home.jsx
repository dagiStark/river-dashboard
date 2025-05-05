import { Routes, Route, Navigate } from "react-router-dom";

import Main from "../components/Main";
import Sidebar from "../components/Sidebar";
import Overview from "../sections/Overview";
import Charts from "../sections/Charts";
import FarmersPage from "../sections/FarmersPage";

function Home() {
  return (
    <div className="">
      <div className="flex">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Main />}>
            <Route index element={<Navigate to="overview" />} />
            <Route path="overview" element={<Overview />} />
            <Route path="charts" element={<Charts />} />
            <Route path="farmers" element={<FarmersPage />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default Home;
