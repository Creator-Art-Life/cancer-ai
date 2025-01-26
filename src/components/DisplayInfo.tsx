import { useMetricsData } from "../utils/useMetricsData";
import MetricsCard from "./MetricsCard";

const DisplayInfo = () => {
  const metricsData = useMetricsData();

  return (
    <div className="flex flex-wrap gap-[26px]">
      <div className="mt-7 grid w-full gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2">
        {metricsData.slice(0, 2).map((metric) => (
          <MetricsCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="mt-[9px] grid w-full gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {metricsData.slice(2).map((metric) => (
          <MetricsCard key={metric.title} {...metric} />
        ))}
      </div>
    </div>

    // <div className={`flex justify-center items-center mt-100 `}>
    //   <div className="text-center">
    //     <p className="font-semibold text-white text-4xl">
    //       Soon create Home page with MetricsCard
    //     </p>
    //   </div>
    // </div>
  );
};

export default DisplayInfo;
