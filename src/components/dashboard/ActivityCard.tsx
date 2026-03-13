import { memo } from "react";

interface ActivityCardProps {
  completion: number; // 0-100
  weekData: number[]; // 7 values
}

const MiniBar = ({ value }: { value: number }) => {
  const height = Math.max(4, Math.min(32, value));
  return (
    <div className="flex-1">
      <div
        className="mx-auto h-8 w-3 rounded-full bg-orange-500 transition-all"
        style={{ height: `${height}px` }}
      />
    </div>
  );
};

const ActivityCard = ({ completion, weekData }: ActivityCardProps) => (
  <div className="h-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
    <div className="flex items-start justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Activity</h3>
        <p className="mt-1 text-sm text-gray-500">Weekly progress overview</p>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-3xl font-bold text-gray-800">{completion}%</span>
        <span className="text-xs text-gray-500">completed</span>
      </div>
    </div>

    <div className="mt-5 grid grid-cols-7 gap-2">
      {weekData.map((val, idx) => (
        <MiniBar key={idx} value={val} />
      ))}
    </div>

    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
      <span>Goal: 80%</span>
      <span className="font-medium text-gray-800">
        +{completion - 62}% last week
      </span>
    </div>
  </div>
);

export default memo(ActivityCard);
