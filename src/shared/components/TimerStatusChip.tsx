import type { FC } from "react";

interface TimerStatusChipProps {
  isActive: boolean;
  isRunning: boolean;
}

const TimerStatusChip: FC<TimerStatusChipProps> = ({ isActive, isRunning }) => {
  if (!isActive) {
    return null;
  }

  return (
    <span
      className={`text-[10px] font-semibold uppercase px-2 py-1 rounded-full ${
        isRunning
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-800"
      }`}
    >
      {isRunning ? "Timer running" : "Timer paused"}
    </span>
  );
};

export default TimerStatusChip;
