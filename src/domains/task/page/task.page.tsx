import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { selectAllTasks } from "../model/task.selectors";
import TaskHeader from "../components/task-header";
import TaskItem from "../components/task-item";

const TaskPage = () => {
  const tasks = useSelector(selectAllTasks);
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");

  const filteredTasks =
    status === "completed"
      ? tasks.filter((t) => t.status === "done")
      : status === "pending"
        ? tasks.filter((t) => t.status === "todo")
        : tasks;

  return (
    <div className="space-y-6">
      <TaskHeader />

      <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-200">
        {filteredTasks.length === 0 ? (
          <p className="p-6 text-gray-500">No tasks found</p>
        ) : (
          filteredTasks.map((task) => <TaskItem key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
};

export default TaskPage;
