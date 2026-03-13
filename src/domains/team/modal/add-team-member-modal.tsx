import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store/store";
import { addTeamMember } from "../model/team.slice";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import toast from "react-hot-toast";

interface AddTeamMemberModalProps {
  onClose: () => void;
}

const AddTeamMemberModal = ({ onClose }: AddTeamMemberModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.team);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      await dispatch(
        addTeamMember({
          name: name.trim(),
          email: email.trim(),
          role,
        }),
      ).unwrap();

      toast.success("Team member added successfully");
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to add team member");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white w-full max-w-md p-6 rounded-xl space-y-4">
        <h2 className="text-lg font-semibold">Add Team Member</h2>

        <input
          type="text"
          placeholder="Full name"
          className="w-full border border-gray-300 p-2 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />

        <input
          type="email"
          placeholder="Email address"
          className="w-full border border-gray-300 p-2 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <select
          className="w-full border border-gray-300 p-2 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={role}
          onChange={(e) => setRole(e.target.value as "admin" | "member")}
          disabled={loading}
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>

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
            {loading ? "Adding..." : "Add Member"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTeamMemberModal;
