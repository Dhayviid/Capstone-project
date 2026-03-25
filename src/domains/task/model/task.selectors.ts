import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../../store/store";

export const selectAllTasks = (state: RootState) => state.task.tasks;

export const selectCompletedTasks = createSelector(selectAllTasks, (tasks) =>
  tasks.filter((task) => task.status === "done"),
);

export const selectPendingTasks = createSelector(selectAllTasks, (tasks) =>
  tasks.filter((task) => task.status === "todo"),
);

export const selectTaskStats = createSelector(selectAllTasks, (tasks) => {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === "done").length;
  const pending = tasks.filter((task) => task.status === "todo").length;
  return { total, completed, pending };
});

export const selectTimelineByDay = createSelector(selectAllTasks, (tasks) => {
  const dayMap: Record<string, typeof tasks> = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
  };

  tasks
    .filter((task) => task.scheduledAt)
    .forEach((task) => {
      const date = new Date(task.scheduledAt!);
      const dayName = date.toLocaleDateString(undefined, { weekday: "long" });
      if (dayMap[dayName]) dayMap[dayName].push(task);
    });

  Object.keys(dayMap).forEach((day) => {
    dayMap[day].sort(
      (a, b) =>
        new Date(a.scheduledAt ?? "").getTime() -
        new Date(b.scheduledAt ?? "").getTime(),
    );
  });

  return dayMap;
});

export const selectTaskById = (state: RootState, taskId: string) =>
  state.task.tasks.find((task) => task.id === taskId);
