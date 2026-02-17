import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteTask, toggleTask } from "../model/task.slice";
import type { Task } from "../model/task.types";
import EditTaskModal from "../modal/edit-task-modal";
import { MdDelete, MdEdit, MdToggleOn } from "react-icons/md";

interface TaskItemProps {
  task: Task;
}

const TaskItem = ({ task }: TaskItemProps) => {
  const dispatch = useDispatch();
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div className="p-4 flex justify-between items-center">
      <div>
        <p className="font-medium">{task.title}</p>
        <p className="text-sm text-gray-500">
          {task.status === "done" ? "Completed" : "Pending"}
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setIsEditOpen(true)}
          className="text-green-600 text-sm flex flex-row gap-1.5 items-center cursor-pointer"
        >
          Edit
          <MdEdit />
        </button>

        <button
          onClick={() => dispatch(toggleTask(task.id))}
          className="text-blue-600 text-sm flex flex-row gap-1.5 items-center cursor-pointer"
        >
          Toggle
          <MdToggleOn />
        </button>

        <button
          onClick={() => dispatch(deleteTask(task.id))}
          className="text-red-600 text-sm flex flex-row gap-1.5 items-center cursor-pointer"
        >
          Delete
          <MdDelete />
        </button>
      </div>

      {isEditOpen && (
        <EditTaskModal task={task} onClose={() => setIsEditOpen(false)} />
      )}
    </div>
  );
};

export default TaskItem;
