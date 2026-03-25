import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../store/store";
import { createTask } from "../model/task.slice";
import { fetchTeamMembers } from "../../team/model/team.slice";
import type { RootState } from "../../../store/store";
import toast from "react-hot-toast";

interface Props {
  onClose: () => void;
}

const CreateTaskModal = ({ onClose }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.task);
  const { members } = useSelector((state: RootState) => state.team);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [scheduledAt, setScheduledAt] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  useEffect(() => {
    if (members.length === 0) {
      dispatch(fetchTeamMembers());
    }
  }, [dispatch, members.length]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!assignedTo.trim()) {
      toast.error("Please assign this task to a team member");
      return;
    }

    try {
      await dispatch(
        createTask({
          title: title.trim(),
          description: description.trim() || undefined,
          status: "todo",
          assignedTo: assignedTo.trim(),
          priority,
          scheduledAt: scheduledAt
            ? new Date(scheduledAt).toISOString()
            : undefined,
          timeSpent: 0,
        }),
      ).unwrap();
      toast.success("Task created");
      onClose();
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Could not create task");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md p-5 rounded-xl shadow-lg space-y-3">
        <h3 className="text-lg font-semibold">Create Task</h3>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border p-2 rounded"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full border p-2 rounded"
          rows={3}
        />
        <div className="grid grid-cols-2 gap-2">
          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as "low" | "medium" | "high")
            }
            className="border p-2 rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">
            Assign to:
          </label>
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="w-full border p-2 rounded mt-1"
          >
            <option value="">Select team member</option>
            {members.map((member) => (
              <option key={member.id} value={member.name}>
                {member.name}
              </option>
            ))}
          </select>
          {members.length === 0 && (
            <p className="text-xs text-red-500 mt-1">
              No team members found. Add members before creating tasks.
            </p>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-1.5 bg-blue-600 text-white rounded"
            disabled={loading || members.length === 0}
          >
            {loading ? "Saving..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
