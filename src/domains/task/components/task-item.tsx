import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  startTimerAsync,
  pauseTimerAsync,
  resumeTimerAsync,
  cancelTimerAsync,
} from "../../timer/model/timer.slice";
import { toggleTaskStatusAsync, deleteTaskAsync } from "../model/task.slice";
import type { Task } from "../model/task.types";
import EditTaskModal from "../modal/edit-task-modal";
import DeleteConfirmationModal from "../modal/delete-confirmation-modal";
import { MdDelete, MdEdit } from "react-icons/md";
import type { AppDispatch, RootState } from "../../../store/store";
import toast from "react-hot-toast";
import TimerStatusChip from "../../../shared/components/TimerStatusChip";

interface TaskItemProps {
  task: Task;
}

const TaskItem = ({ task }: TaskItemProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const timer = useSelector((state: RootState) => state.timer);
  const isActive = timer.activeTaskId === task.id;

  const handleToggle = async () => {
    try {
      await dispatch(toggleTaskStatusAsync(task.id)).unwrap();
      toast.success("Task status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteTaskAsync(task.id)).unwrap();
      toast.success("Task deleted");
      setIsDeleteOpen(false);
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="p-4 flex flex-col gap-2 border-b last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="font-medium">{task.title}</div>
            <TimerStatusChip isActive={isActive} isRunning={timer.isRunning} />
          </div>
          <div className="text-xs text-gray-500">
            {task.description ?? "No description"}
          </div>
        </div>
        <div className="flex gap-5">
          <button
            onClick={() => navigate(`/tasks/${task.id}`)}
            className="text-blue-700 text-xs flex items-center gap-1 cursor-pointer"
          >
            View Task
          </button>
          <button
            onClick={() => setIsEditOpen(true)}
            className="text-blue-700 text-xs flex items-center gap-1 cursor-pointer"
          >
            <MdEdit /> Edit
          </button>
          {!isActive && (
            <button
              onClick={async () => {
                try {
                  await dispatch(startTimerAsync({ taskId: task.id })).unwrap();
                  toast.custom(
                    (t) => (
                      <div className="fixed top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded shadow-lg flex items-center gap-3">
                        <span>Timer is active for {task.title}</span>
                        <button
                          onClick={() => {
                            toast.dismiss(t.id);
                            document
                              .getElementById("tracker-section")
                              ?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="underline text-sm"
                        >
                          Go to tracker
                        </button>
                      </div>
                    ),
                    { id: "timer-active-banner", duration: 3000 },
                  );
                } catch (err) {
                  toast.error(
                    typeof err === "string" ? err : "Could not start timer",
                  );
                }
              }}
              className="text-blue-700 text-xs cursor-pointer"
            >
              Start Timer
            </button>
          )}
          {isActive && timer.isRunning && (
            <button
              onClick={async () => {
                try {
                  const result = await dispatch(pauseTimerAsync()).unwrap();
                  if (result) {
                    toast.success(`Timer paused for ${task.title}`);
                  }
                } catch {
                  toast.error("Could not pause timer");
                }
              }}
              className="text-orange-700 text-xs cursor-pointer"
            >
              Pause
            </button>
          )}
          {isActive && !timer.isRunning && (
            <button
              onClick={async () => {
                try {
                  await dispatch(resumeTimerAsync()).unwrap();
                  toast.success(`Timer resumed for ${task.title}`);
                } catch {
                  toast.error("Could not resume timer");
                }
              }}
              className="text-blue-700 text-xs cursor-pointer"
            >
              Resume
            </button>
          )}
          {isActive && (
            <button
              onClick={async () => {
                try {
                  await dispatch(cancelTimerAsync()).unwrap();
                  toast.success(`Timer canceled for ${task.title}`);
                } catch {
                  toast.error("Could not cancel timer");
                }
              }}
              className="text-red-600 text-xs cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleToggle}
            className="text-green-700 text-xs cursor-pointer"
          >
            {task.status === "done" ? "Reopen" : "Complete"}
          </button>
          <button
            onClick={() => setIsDeleteOpen(true)}
            className="text-red-600 text-xs cursor-pointer flex flex-row gap-1"
          >
            <MdDelete /> Delete
          </button>
        </div>
      </div>
      <div className="text-xs text-gray-500 flex flex-wrap gap-2">
        <span>Status: {task.status}</span>
        <span>Priority: {task.priority}</span>
        {task.assignedTo && <span>Assigned: {task.assignedTo}</span>}
        <span>Time: {Math.floor(task.timeSpent / 60)}m</span>
        {task.scheduledAt && (
          <span>Scheduled: {new Date(task.scheduledAt).toLocaleString()}</span>
        )}
      </div>

      {isEditOpen && (
        <EditTaskModal task={task} onClose={() => setIsEditOpen(false)} />
      )}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Delete ${task.title}?`}
      />
    </div>
  );
};

export default TaskItem;
