import { useSelector } from "react-redux";
import { selectTaskStats } from "../model/task.selectors";

const DashboardSummary = () => {
  const { total, completed, pending } = useSelector(selectTaskStats);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="p-4 bg-white rounded shadow">
        <h3 className="text-sm text-gray-500">Total Tasks</h3>
        <p className="text-2xl font-bold">{total}</p>
      </div>

      <div className="p-4 bg-green-100 rounded shadow">
        <h3 className="text-sm text-gray-600">Completed</h3>
        <p className="text-2xl font-bold text-green-700">{completed}</p>
      </div>

      <div className="p-4 bg-yellow-100 rounded shadow">
        <h3 className="text-sm text-gray-600">Pending</h3>
        <p className="text-2xl font-bold text-yellow-700">{pending}</p>
      </div>
    </div>
  );
};

export default DashboardSummary;
