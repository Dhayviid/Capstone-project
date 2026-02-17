import { useSelector } from "react-redux";
import { selectTaskStats } from "../../task/model/task.selectors";
import type { RootState } from "../../../store/store";
import StatsCard from "./stats-card";

import { FiCheckCircle, FiClock, FiList } from "react-icons/fi";

const DashboardSummary = () => {
  const { total, completed, pending } = useSelector((state: RootState) =>
    selectTaskStats(state),
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard
        title="Total Tasks"
        value={total}
        icon={<FiList />}
        color="bg-blue-500"
        to="/task"
      />

      <StatsCard
        title="Completed Tasks"
        value={completed}
        icon={<FiCheckCircle />}
        color="bg-green-500"
        to="/task?status=completed"
      />

      <StatsCard
        title="Pending Tasks"
        value={pending}
        icon={<FiClock />}
        color="bg-yellow-500"
        to="/task?status=pending"
      />
    </div>
  );
};

export default DashboardSummary;
