import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store/store";
import { createTask } from "../model/task.slice";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import toast from "react-hot-toast";

interface Props {
  onClose: () => void;
}

const CreateTaskModal = ({ onClose }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.task);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"todo" | "done">("todo");
  const [assignedTo, setAssignedTo] = useState("");

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      await dispatch(
        createTask({
          title: title.trim(),
          description: description.trim(),
          status,
          assignedTo: assignedTo.trim() || undefined,
        }),
      ).unwrap();

      toast.success("Task created successfully");
      onClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white w-full max-w-md p-6 rounded-xl space-y-4">
        <h2 className="text-lg font-semibold">Create Task</h2>

        <input
          type="text"
          placeholder="Task title"
          className="w-full border border-gray-300 p-2 rounded-lg bg-white text-gray-900"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />

        <textarea
          placeholder="Task description (optional)"
          className="w-full border border-gray-300 p-2 rounded-lg bg-white text-gray-900"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          disabled={loading}
        />

        <select
          className="w-full border border-gray-300 p-2 rounded-lg bg-white text-gray-900"
          value={status}
          onChange={(e) => setStatus(e.target.value as "todo" | "done")}
          disabled={loading}
        >
          <option value="todo">Pending</option>
          <option value="done">Completed</option>
        </select>

        <input
          type="text"
          placeholder="Assign to (optional)"
          className="w-full border border-gray-300 p-2 rounded-lg bg-white text-gray-900"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          disabled={loading}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="text-gray-500 disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
