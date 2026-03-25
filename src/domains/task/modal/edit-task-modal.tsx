import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../store/store";
import { updateTaskAsync } from "../model/task.slice";
import type { Task } from "../model/task.types";
import type { RootState } from "../../../store/store";
import toast from "react-hot-toast";

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
}

const EditTaskModal = ({ task, onClose }: EditTaskModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.task);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [status, setStatus] = useState<"todo" | "done">(task.status);
  const [scheduledAt, setScheduledAt] = useState(task.scheduledAt ?? "");
  const [assignedTo, setAssignedTo] = useState(task.assignedTo ?? "");

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      await dispatch(
        updateTaskAsync({
          ...task,
          title: title.trim(),
          description: description.trim() || undefined,
          status,
          scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
          assignedTo: assignedTo.trim() || undefined,
        }),
      ).unwrap();
      toast.success("Task updated");
      onClose();
    } catch {
      toast.error("Could not update task");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md p-5 rounded-xl shadow-lg space-y-3">
        <h3 className="text-lg font-semibold">Edit Task</h3>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-2 rounded" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border p-2 rounded" rows={3} />
        <select value={status} onChange={(e) => setStatus(e.target.value as "todo" | "done")} className="w-full border p-2 rounded">
          <option value="todo">Pending</option>
          <option value="done">Completed</option>
        </select>
        <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="w-full border p-2 rounded" />
        <input value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="w-full border p-2 rounded" placeholder="Assign to" />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 border rounded">Cancel</button>
          <button onClick={handleSubmit} className="px-3 py-1.5 bg-blue-600 text-white rounded" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
