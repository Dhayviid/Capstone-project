import { memo } from "react";
import { MdAdd } from "react-icons/md";
import type { Meeting } from "../../types/meeting.types";

interface MeetingsCardProps {
  meetings: Meeting[];
  onAddMeeting?: () => void;
}

const MeetingItem = ({ meeting }: { meeting: Meeting }) => (
  <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 shadow-sm transition hover:bg-gray-100">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-gray-800">{meeting.title}</p>
        <p className="text-xs text-gray-500">{meeting.time}</p>
      </div>
      {meeting.participants && meeting.participants.length > 0 ? (
        <div className="flex -space-x-2">
          {meeting.participants.slice(0, 3).map((participant) => (
            <span
              key={participant}
              className="h-7 w-7 rounded-full bg-gray-200 text-[10px] font-semibold text-gray-700 flex items-center justify-center border border-white"
              title={participant}
            >
              {participant.slice(0, 2).toUpperCase()}
            </span>
          ))}
          {meeting.participants.length > 3 && (
            <span className="h-7 w-7 rounded-full bg-gray-200 text-[10px] font-semibold text-gray-700 flex items-center justify-center border border-white">
              +{meeting.participants.length - 3}
            </span>
          )}
        </div>
      ) : null}
    </div>
  </div>
);

const MeetingsCard = ({ meetings, onAddMeeting }: MeetingsCardProps) => (
  <div className="h-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-800">Meetings</h3>
      <div className="flex items-center gap-3">
        {onAddMeeting && (
          <button
            onClick={onAddMeeting}
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <MdAdd />
            Add
          </button>
        )}
        <span className="text-sm font-medium text-gray-500">Today</span>
      </div>
    </div>

    <div className="mt-4 grid gap-3">
      {meetings.map((meeting) => (
        <MeetingItem key={meeting.id} meeting={meeting} />
      ))}
    </div>
  </div>
);

export default memo(MeetingsCard);
