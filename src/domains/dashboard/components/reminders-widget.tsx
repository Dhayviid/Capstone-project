import type { Meeting } from "../../../types/meeting.types";

interface Props {
  meetings: Meeting[];
}

const RemindersWidget = ({ meetings }: Props) => (
  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">Reminders</h3>
        <p className="text-xs text-gray-500">Upcoming reminders</p>
      </div>
    </div>
    <div className="mt-3 space-y-2">
      {meetings.length === 0 ? (
        <p className="text-gray-500 text-sm">No reminders yet.</p>
      ) : (
        meetings.slice(0, 4).map((meeting) => (
          <div key={meeting.id} className="border p-2 rounded-md bg-slate-50">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">{meeting.title}</div>
              <span className="text-xs text-gray-500">{meeting.time}</span>
            </div>
            <div className="text-xs text-gray-500">
              {meeting.location ?? "No Notes"}
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

export default RemindersWidget;
