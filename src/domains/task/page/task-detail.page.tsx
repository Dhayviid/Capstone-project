import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteTaskAsync,
  fetchTasks,
  toggleTaskStatusAsync,
} from "../model/task.slice";
import { selectTaskById } from "../model/task.selectors";
import type { AppDispatch, RootState } from "../../../store/store";
import EditTaskModal from "../modal/edit-task-modal";
import DeleteConfirmationModal from "../modal/delete-confirmation-modal";
import toast from "react-hot-toast";

const TaskDetailPage = () => {
  const { taskId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const task = useSelector((state: RootState) =>
    taskId ? selectTaskById(state, taskId) : undefined,
  );
  const { loading } = useSelector((state: RootState) => state.task);

  useEffect(() => {
    if (!task) {
      dispatch(fetchTasks());
    }
  }, [dispatch, task]);

  const handleMarkComplete = async () => {
    if (!task) return;
    try {
      await dispatch(toggleTaskStatusAsync(task.id)).unwrap();
      toast.success("Task status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    try {
      await dispatch(deleteTaskAsync(task.id)).unwrap();
      toast.success("Task deleted");
      navigate("/task");
    } catch {
      toast.error("Could not delete task");
    }
  };

  if (loading && !task) {
    return <div className="p-6 text-center">Loading task...</div>;
  }

  if (!task) {
    return (
      <div className="p-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold">Task not found</h2>
          <p className="text-gray-600 mt-2">
            This task does not exist or may have been deleted.
          </p>
          <button
            onClick={() => navigate("/task")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Back to tasks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <button
            onClick={() => navigate("/task")}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Tasks
          </button>
          <h1 className="text-2xl font-bold mt-2">{task.title}</h1>
          <p className="text-sm text-gray-500 mt-1">Task detail overview</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditOpen(true)}
            className="px-3 py-2 bg-gray-200 rounded-lg text-sm"
          >
            Edit
          </button>
          <button
            onClick={handleMarkComplete}
            className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm"
          >
            {task.status === "done" ? "Reopen" : "Mark Complete"}
          </button>
          <button
            onClick={() => setIsDeleteOpen(true)}
            className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Task Information</h2>
          <p className="text-gray-700 mb-3">
            {task.description || "No description provided."}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
            <div className="bg-slate-50 p-3 rounded-lg border border-gray-200">
              <p className="text-xs uppercase text-gray-500">Status</p>
              <p className="font-medium">{task.status}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-gray-200">
              <p className="text-xs uppercase text-gray-500">Priority</p>
              <p className="font-medium">{task.priority}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-gray-200">
              <p className="text-xs uppercase text-gray-500">Assigned To</p>
              <p className="font-medium">{task.assignedTo || "Unassigned"}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-gray-200">
              <p className="text-xs uppercase text-gray-500">Time Spent</p>
              <p className="font-medium">{Math.floor(task.timeSpent / 60)}m</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Metadata</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <div>
              <div className="text-xs uppercase text-gray-500">Created</div>
              <div>{new Date(task.createdAt).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-gray-500">Scheduled</div>
              <div>
                {task.scheduledAt
                  ? new Date(task.scheduledAt).toLocaleString()
                  : "Not scheduled"}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase text-gray-500">Task ID</div>
              <div className="text-xs text-gray-500 break-all">{task.id}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-semibold">Activity</h3>
        <ul className="text-sm text-gray-600 mt-2 space-y-1">
          <li>
            Task created on {new Date(task.createdAt).toLocaleDateString()}
          </li>
          <li>Status: {task.status}</li>
          <li>Priority: {task.priority}</li>
        </ul>
      </div>

      {isEditOpen && (
        <EditTaskModal task={task} onClose={() => setIsEditOpen(false)} />
      )}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default TaskDetailPage;
