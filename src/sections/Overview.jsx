import LeftOverview from "../components/LeftOverview";
import RightOverview from "../components/RightOverview";

function Overview() {
  return (
    <div className=" w-full">
      <div className="flex gap-8 pl-5 pr-5 mt-5">
        {/* Left Side */}
        <div className="w-[80%]">
          <LeftOverview />
        </div>

        {/* Right Side */}
        <div className="">
          <RightOverview />
        </div>
      </div>
    </div>
  );
}

export default Overview;
