import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store/store";
import { addTask } from "../model/task.slice";

interface Props {
  onClose: () => void;
}

const CreateTaskModal = ({ onClose }: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"todo" | "done">("todo");

  const handleSubmit = () => {
    if (!title.trim()) return;

    dispatch(
      addTask({
        id: Date.now().toString(),
        title,
        status,
        description: "",
        createdAt: new Date().toISOString(),
      }),
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white w-full max-w-md p-6 rounded-xl space-y-4">
        <h2 className="text-lg font-semibold">Create Task</h2>

        <input
          type="text"
          placeholder="Task title"
          className="w-full border p-2 rounded-lg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          className="w-full border p-2 rounded-lg"
          value={status}
          onChange={(e) => setStatus(e.target.value as "todo" | "done")}
        >
          <option value="todo">Pending</option>
          <option value="done">Completed</option>
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-gray-500">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
