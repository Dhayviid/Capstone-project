import { useSelector } from "react-redux";
import { selectTaskStats } from "../../task/model/task.selectors";
import type { RootState } from "../../../store/store";
import StatsCard from "./stats-card";

const DashboardSummary = () => {
  const { total, completed, pending } = useSelector((state: RootState) =>
    selectTaskStats(state),
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard title="Total Tasks" value={total} />
      <StatsCard title="Completed Tasks" value={completed} />
      <StatsCard title="Pending Tasks" value={pending} />
    </div>
  );
};

export default DashboardSummary;
