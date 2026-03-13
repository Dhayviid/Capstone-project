import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../store/store";
import { updateTaskAsync } from "../model/task.slice";
import { fetchTeamMembers } from "../../team/model/team.slice";
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
  const { members } = useSelector((state: RootState) => state.team);
  const user = useSelector((state: RootState) => state.auth.user);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState<"todo" | "in-progress" | "done">(
    task.status,
  );
  const [dueDate, setDueDate] = useState(task.dueDate ?? "");
  const [assignedTo, setAssignedTo] = useState(task.assignedTo || "");

  const isAdmin = members.some(
    (member) => member.email === user?.email && member.role === "admin",
  );

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchTeamMembers());
    }
  }, [dispatch, isAdmin]);

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
          description: description?.trim() ?? "",
          status,
          dueDate: dueDate || undefined,
          assignedTo: assignedTo.trim() || undefined,
        }),
      ).unwrap();

      toast.success("Task updated successfully");
      onClose();
    } catch {
      toast.error("Failed to update task");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl space-y-4">
        <h2 className="text-lg font-semibold">Edit Task</h2>

        <input
          type="text"
          placeholder="Task title"
          className="w-full border border-gray-300 p-2 rounded-lg bg-white text-gray-900 placeholder-gray-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />

        <textarea
          placeholder="Task description"
          className="w-full border border-gray-300 p-2 rounded-lg bg-white text-gray-900 placeholder-gray-500"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          disabled={loading}
        />

        <select
          className="w-full border border-gray-300 p-2 rounded-lg bg-white text-gray-900"
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as "todo" | "in-progress" | "done")
          }
          disabled={loading}
        >
          <option value="todo">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Completed</option>
        </select>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            disabled={loading}
          />
          {dueDate && (
            <button
              type="button"
              onClick={() => setDueDate("")}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          )}
        </div>

        {isAdmin ? (
          <select
            className="w-full border border-gray-300 p-2 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            disabled={loading}
          >
            <option value="">Unassigned</option>
            {members.map((member) => (
              <option key={member.id} value={member.name}>
                {member.name} ({member.role})
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            placeholder="Assign to (optional)"
            className="w-full border border-gray-300 p-2 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-gray-500"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            disabled={loading}
          />
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
