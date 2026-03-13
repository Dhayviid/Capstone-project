import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeamMembers } from "../model/team.slice";
import TeamMemberItem from "../components/team-member-item";
import AddTeamMemberModal from "../modal/add-team-member-modal";
import type { RootState, AppDispatch } from "../../../store/store";
import { MdAdd } from "react-icons/md";

const TeamPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { members, loading, error } = useSelector(
    (state: RootState) => state.team,
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTeamMembers());
  }, [dispatch]);

  if (loading && members.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading team members...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-center text-red-600">
            <p>Error loading team members: {error}</p>
            <button
              onClick={() => dispatch(fetchTeamMembers())}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <MdAdd />
          Add Member
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-200">
        {members.length === 0 ? (
          <p className="p-6 text-gray-500">
            No team members yet. Add your first team member!
          </p>
        ) : (
          members.map((member) => (
            <TeamMemberItem key={member.id} member={member} />
          ))
        )}
      </div>

      {isAddModalOpen && (
        <AddTeamMemberModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  );
};

export default TeamPage;
