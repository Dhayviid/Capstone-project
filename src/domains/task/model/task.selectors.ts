import type { RootState } from "../../../store/store";

export const selectAllTasks = (state: RootState) => state.task.tasks;

export const selectCompletedTasks = (state: RootState) =>
  state.task.tasks.filter((task) => task.status === "done");

export const selectPendingTasks = (state: RootState) =>
  state.task.tasks.filter((task) => task.status === "todo");

export const selectTaskStats = (state: RootState) => {
  const tasks = state.task.tasks;

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "done").length;
  const pending = tasks.filter((t) => t.status === "todo").length;

  return { total, completed, pending };
};
