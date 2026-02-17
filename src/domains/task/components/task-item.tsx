import { useDispatch } from "react-redux";
import { deleteTask, toggleTask } from "../model/task.slice";
import type { Task } from "../model/task.types";

interface TaskItemProps {
  task: Task;
}

const TaskItem = ({ task }: TaskItemProps) => {
  const dispatch = useDispatch();

  return (
    <div className="p-4 flex justify-between items-center">
      <div>
        <p className="font-medium">{task.title}</p>
        <p className="text-sm text-gray-500">
          {task.status === "done" ? "Completed" : "Pending"}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => dispatch(toggleTask(task.id))}
          className="text-blue-600 text-sm"
        >
          Toggle
        </button>

        <button
          onClick={() => dispatch(deleteTask(task.id))}
          className="text-red-600 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
