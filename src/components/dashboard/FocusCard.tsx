import { memo } from "react";
import { MdPlayArrow, MdPause, MdAccessTime } from "react-icons/md";

export type FocusStatus = "running" | "paused";

interface FocusCardProps {
  projectName: string;
  status: FocusStatus;
  duration: string; // e.g. "25:00"
  onToggle: () => void;
}

const FocusCard = ({
  projectName,
  status,
  duration,
  onToggle,
}: FocusCardProps) => {
  const isRunning = status === "running";

  return (
    <div className="h-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Focus</p>
          <h3 className="mt-1 text-lg font-semibold text-gray-800">
            {projectName}
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            {isRunning ? "In progress" : "Paused"}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
            <MdAccessTime className="h-4 w-4" />
            {duration}
          </span>

          <button
            onClick={onToggle}
            className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-orange-500 text-white shadow-sm transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
            aria-label={isRunning ? "Pause focus timer" : "Start focus timer"}
          >
            {isRunning ? (
              <MdPause className="h-6 w-6" />
            ) : (
              <MdPlayArrow className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(FocusCard);
