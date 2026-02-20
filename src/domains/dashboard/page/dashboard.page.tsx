import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardSummary from "../components/dashboard-summary";
import { fetchTasks } from "../../task/model/task.slice";
import type { RootState, AppDispatch } from "../../../store/store";

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { error } = useSelector((state: RootState) => state.task);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error loading dashboard data: {error}</p>
        </div>
      )}
      <DashboardSummary />
    </div>
  );
};

export default DashboardPage;
