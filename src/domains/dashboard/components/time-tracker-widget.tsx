import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  startTimerAsync,
  pauseTimerAsync,
  resumeTimerAsync,
  cancelTimerAsync,
  selectTimerDisplay,
} from "../../timer/model/timer.slice";
import type { RootState, AppDispatch } from "../../../store/store";
import toast from "react-hot-toast";

const TimeTrackerWidget = () => {
  const dispatch = useDispatch<AppDispatch>();
  const timer = useSelector((state: RootState) => state.timer);
  const trackedTime = useSelector(selectTimerDisplay);
  const tasks = useSelector((state: RootState) => state.task.tasks);
  const [displayTime, setDisplayTime] = useState(trackedTime);

  const activeTask = useMemo(
    () => tasks.find((task) => task.id === timer.activeTaskId),
    [tasks, timer.activeTaskId],
  );

  useEffect(() => {
    setDisplayTime(trackedTime);
  }, [trackedTime]);

  useEffect(() => {
    if (!timer.activeTaskId) return undefined;
    const handle = window.setInterval(() => {
      setDisplayTime((current) => current + 1);
    }, 1000);
    return () => window.clearInterval(handle);
  }, [timer.activeTaskId]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleStart = async () => {
    if (!activeTask) {
      return;
    }
    try {
      await dispatch(startTimerAsync({ taskId: activeTask.id })).unwrap();
      toast.success(`Timer started for ${activeTask.title}`, {
        id: "timer-start",
      });
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Could not start timer");
    }
  };

  const handlePause = async () => {
    try {
      await dispatch(pauseTimerAsync()).unwrap();
      toast.success("Timer paused", { id: "timer-pause" });
    } catch {
      toast.error("Could not pause timer");
    }
  };

  const handleResume = async () => {
    try {
      await dispatch(resumeTimerAsync()).unwrap();
      toast.success("Timer resumed", { id: "timer-resume" });
    } catch {
      toast.error("Could not resume timer");
    }
  };

  const handleCancel = async () => {
    try {
      await dispatch(cancelTimerAsync()).unwrap();
      toast.success("Timer canceled", { id: "timer-cancel" });
    } catch {
      toast.error("Could not cancel timer");
    }
  };

  const timerStateLabel = timer.isRunning
    ? "Running"
    : timer.activeTaskId
      ? "Paused"
      : "Idle";

  return (
    <div
      id="tracker-section"
      className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">Time Tracker</h3>
          <p className="text-xs text-gray-500">One active timer at a time</p>
        </div>
        <span className="text-xs font-medium text-blue-600">
          {timerStateLabel}
        </span>
      </div>
      <div className="mt-3 bg-gray-50 p-3 rounded-md">
        <div className="text-xs text-gray-500">Active Task</div>
        <div className="mt-1 font-medium text-gray-800">
          {activeTask?.title ?? "No active task"}
        </div>
        <div className="text-xs text-gray-500">Elapsed</div>
        <div className="text-sm text-blue-600 mt-1">
          {formatDuration(displayTime)}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={handleStart}
          disabled={!activeTask || timer.isRunning}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          Start
        </button>
        <button
          onClick={handlePause}
          disabled={!timer.isRunning}
          className="px-3 py-1.5 bg-orange-500 text-white rounded-lg disabled:opacity-50"
        >
          Pause
        </button>
        <button
          onClick={handleResume}
          disabled={!timer.activeTaskId || timer.isRunning}
          className="px-3 py-1.5 bg-green-600 text-white rounded-lg disabled:opacity-50"
        >
          Resume
        </button>
        <button
          onClick={handleCancel}
          disabled={!timer.activeTaskId}
          className="px-3 py-1.5 bg-red-600 text-white rounded-lg disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
      {timer.error && (
        <p className="mt-2 text-xs text-red-500">{timer.error}</p>
      )}
      <div className="mt-2 text-xs text-gray-500">
        Tip: Use the task list to pick a task and control timer here.
      </div>
    </div>
  );
};

export default TimeTrackerWidget;
