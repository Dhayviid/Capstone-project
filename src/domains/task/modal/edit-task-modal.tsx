import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store/store";
import { updateTask } from "../model/task.slice";
import type { Task } from "../model/task.types";

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
}

const EditTaskModal = ({ task, onClose }: EditTaskModalProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState<"todo" | "done">(task.status);

  const handleSubmit = () => {
    if (!title.trim()) return;

    dispatch(
      updateTask({
        ...task,
        title,
        description,
        status,
      }),
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl space-y-4">
        <h2 className="text-lg font-semibold">Edit Task</h2>

        <input
          type="text"
          placeholder="Task title"
          className="w-full border p-2 rounded-lg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Task description"
          className="w-full border p-2 rounded-lg"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
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
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
