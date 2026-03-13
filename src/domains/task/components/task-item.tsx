import { useState } from "react";
import { useDispatch } from "react-redux";
import { toggleTaskAsync, deleteTaskAsync } from "../model/task.slice";
import type { Task } from "../model/task.types";
import EditTaskModal from "../modal/edit-task-modal";
import DeleteConfirmationModal from "../modal/delete-confirmation-modal";
import { MdDelete, MdEdit, MdToggleOn } from "react-icons/md";
import { useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../store/store";
import toast from "react-hot-toast";

const getInitials = (name: string) => {
  const parts = name.trim().split(" ");
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

interface TaskItemProps {
  task: Task;
}

const TaskItem = ({ task }: TaskItemProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.task);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleToggle = async () => {
    try {
      await dispatch(toggleTaskAsync(task.id)).unwrap();
      toast.success("Task status updated");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to update task status");
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteTaskAsync(task.id)).unwrap();
      toast.success("Task deleted successfully");
      setIsDeleteOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  return (
    <div className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <p className="font-medium text-gray-900">{task.title}</p>
          {task.dueDate && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              Due{" "}
              {new Date(task.dueDate).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 mt-2">
          <p className="text-sm text-gray-500">
            {task.status === "done" ? "Completed" : "Pending"}
          </p>
          {task.assignedTo && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">
                {getInitials(task.assignedTo)}
              </span>
              <span className="text-blue-600">
                Assigned to: {task.assignedTo}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setIsEditOpen(true)}
          className="text-green-600 text-sm flex flex-row gap-1.5 items-center cursor-pointer disabled:opacity-50"
          disabled={loading}
        >
          Edit
          <MdEdit />
        </button>

        <button
          onClick={handleToggle}
          className="text-blue-600 text-sm flex flex-row gap-1.5 items-center cursor-pointer disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Updating..." : "Toggle"}
          <MdToggleOn />
        </button>

        <button
          onClick={() => setIsDeleteOpen(true)}
          className="text-red-600 text-sm flex flex-row gap-1.5 items-center cursor-pointer disabled:opacity-50"
          disabled={loading}
        >
          Delete
          <MdDelete />
        </button>
      </div>

      {isEditOpen && (
        <EditTaskModal task={task} onClose={() => setIsEditOpen(false)} />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default TaskItem;
