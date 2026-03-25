import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardSummary from "../../dashboard/components/dashboard-summary";
import TimelineBoard from "../../dashboard/components/timeline-board";
import TimeTrackerWidget from "../../dashboard/components/time-tracker-widget";
import RemindersWidget from "../../reminders/components/reminders-widget";
import { fetchTasks, toggleTaskStatusAsync } from "../../task/model/task.slice";
import { fetchTeamMembers } from "../../team/model/team.slice";
import { selectAllTasks } from "../../task/model/task.selectors";
import type { AppDispatch, RootState } from "../../../store/store";
import toast from "react-hot-toast";

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector(selectAllTasks);
  const loading = useSelector((state: RootState) => state.task.loading);
  const error = useSelector((state: RootState) => state.task.error);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchTeamMembers());
  }, [dispatch]);

  const todayIso = useMemo(() => new Date().toISOString().split("T")[0], []);
  const upcoming = useMemo(
    () =>
      tasks
        .filter((t) => t.scheduledAt && t.scheduledAt >= todayIso)
        .slice(0, 4),
    [tasks, todayIso],
  );

  const handleToggle = async (id: string) => {
    try {
      await dispatch(toggleTaskStatusAsync(id)).unwrap();
      toast.success("Updated task status");
    } catch {
      toast.error("Could not update task status");
    }
  };

  if (loading && tasks.length === 0) {
    return <div className="text-center p-8">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="p-8 bg-white rounded-xl shadow-sm">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => dispatch(fetchTasks())}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <TimeTrackerWidget />
        <div className="md:col-span-2">
          <DashboardSummary />
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-semibold">Timeline Board</h2>
              <p className="text-sm text-gray-500">Tasks by day and time.</p>
            </div>
            <span className="text-xs text-blue-600">Auto-updated</span>
          </div>
          <TimelineBoard />
        </div>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-800">Upcoming Tasks</h3>
            <div className="mt-3 space-y-2">
              {upcoming.length === 0 ? (
                <p className="text-gray-500">No upcoming scheduled tasks.</p>
              ) : (
                upcoming.map((task) => (
                  <div
                    key={task.id}
                    className="border border-gray-200 p-2 rounded-md flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-xs text-gray-500">
                        {task.scheduledAt
                          ? new Date(task.scheduledAt).toLocaleString()
                          : "No schedule"}
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle(task.id)}
                      className="text-blue-600 text-xs px-2 py-1 rounded-md border border-blue-200"
                      aria-label="Toggle task status"
                    >
                      {task.status === "done" ? "Mark Pending" : "Mark Done"}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <RemindersWidget />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
