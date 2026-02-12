import DashboardSummary from "../components/dashboardsummary";
import TaskList from "../components/tasklist";

const TaskPage = () => {
  return (
    <div className="p-6">
      <DashboardSummary />
      <TaskList />
    </div>
  );
};

export default TaskPage;
