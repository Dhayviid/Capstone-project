import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store/store";
import { removeTeamMember } from "../model/team.slice";
import type { TeamMember } from "../model/team.types";
import { MdDelete, MdAdminPanelSettings, MdPerson } from "react-icons/md";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import toast from "react-hot-toast";

interface TeamMemberItemProps {
  member: TeamMember;
}

const TeamMemberItem = ({ member }: TeamMemberItemProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.team);

  const handleRemove = async () => {
    try {
      await dispatch(removeTeamMember(member.id)).unwrap();
      toast.success("Team member removed successfully");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to remove team member");
    }
  };

  return (
    <div className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          {member.role === "admin" ? (
            <MdAdminPanelSettings className="text-blue-600" />
          ) : (
            <MdPerson className="text-gray-600" />
          )}
        </div>
        <div>
          <p className="font-medium text-gray-900">{member.name}</p>
          <p className="text-sm text-gray-500">{member.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            member.role === "admin"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {member.role}
        </span>
        <button
          onClick={handleRemove}
          className="text-red-600 text-sm flex items-center cursor-pointer disabled:opacity-50"
          disabled={loading}
        >
          <MdDelete />
        </button>
      </div>
    </div>
  );
};

export default TeamMemberItem;
