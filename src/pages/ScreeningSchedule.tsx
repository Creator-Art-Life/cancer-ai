import KanbanBoard from "@/components/KanbanBoard";
import { useLocation } from "react-router-dom";

function ScreeningSchedule() {
  const state = useLocation();
  return (
    <div className="w-full overflow-visible">
      <KanbanBoard state={state} />;
    </div>
  );
}

export default ScreeningSchedule;
