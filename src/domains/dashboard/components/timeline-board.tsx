import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import DayColumn from "./day-column";
import { updateTaskSchedule } from "../../task/model/task.slice";
import { selectAllTasks } from "../../task/model/task.selectors";
import type { AppDispatch } from "../../../store/store";
import type { Task } from "../../task/model/task.types";

// eslint-disable-next-line react-refresh/only-export-components
export const getMonthDays = (date = dayjs()) => {
  const monthStart = date.startOf("month");
  const daysInMonth = date.daysInMonth();
  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = monthStart.date(index + 1);
    return {
      iso: day.format("YYYY-MM-DD"),
      label: day.format("D MMM"),
    };
  });
};

// eslint-disable-next-line react-refresh/only-export-components
export const groupTasksByDate = (tasks: Task[]) => {
  return tasks
    .filter((task) => task.scheduledAt)
    .reduce<Record<string, Task[]>>((acc, task) => {
      const key = dayjs(task.scheduledAt).format("YYYY-MM-DD");
      if (!acc[key]) acc[key] = [];
      acc[key].push(task);
      return acc;
    }, {});
};

const TimelineBoard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector(selectAllTasks);
  const monthDays = useMemo(() => getMonthDays(dayjs()), []);
  const grouped = useMemo(() => groupTasksByDate(tasks), [tasks]);

  const handleDragEnd = (event: DragEndEvent) => {
    const taskId = String(event.active.id);
    const overId = event.over?.id;
    if (!overId || typeof overId !== "string") return;

    const foundDay = monthDays.find((day) => day.iso === overId);
    if (!foundDay) return;

    dispatch(updateTaskSchedule({ taskId, date: overId }));
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="overflow-x-auto py-2">
        <div className="flex gap-3 min-w-full">
          {monthDays.map((day) => (
            <DayColumn
              key={day.iso}
              date={day.iso}
              label={day.label}
              tasks={grouped[day.iso] ?? []}
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
};

export default TimelineBoard;
