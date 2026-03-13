import { useState } from "react";
import type { TeamMember } from "../../domains/team/model/team.types";
import type { Meeting } from "../../types/meeting.types";

interface AddMeetingModalProps {
  onClose: () => void;
  onCreate: (meeting: Meeting) => void;
  members: TeamMember[];
}

const AddMeetingModal = ({ onClose, onCreate, members }: AddMeetingModalProps) => {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const toggleMember = (name: string) => {
    setSelectedMembers((prev) =>
      prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name],
    );
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    if (!time.trim()) return;

    onCreate({
      id: Date.now().toString(),
      title: title.trim(),
      time: time.trim(),
      participants: selectedMembers,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl space-y-4">
        <h2 className="text-lg font-semibold">Schedule Meeting</h2>

        <input
          type="text"
          placeholder="Meeting title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Participants</p>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {members.length === 0 ? (
              <p className="text-sm text-gray-500 col-span-2">
                No team members available. Add members on the Team page.
              </p>
            ) : (
              members.map((member) => (
                <label
                  key={member.id}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member.name)}
                    onChange={() => toggleMember(member.name)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  {member.name}
                </label>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={!title.trim() || !time.trim()}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMeetingModal;
