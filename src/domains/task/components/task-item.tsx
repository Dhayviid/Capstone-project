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
        <p className="font-medium text-gray-900">{task.title}</p>
        <div className="flex items-center gap-4 mt-1">
          <p className="text-sm text-gray-500">
            {task.status === "done" ? "Completed" : "Pending"}
          </p>
          {task.assignedTo && (
            <p className="text-sm text-blue-600">
              Assigned to: {task.assignedTo}
            </p>
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
