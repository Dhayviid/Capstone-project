import type { RootState } from "../../../store/store";

export const selectAllTasks = (state: RootState) => state.task.tasks;

export const selectActiveProject = (state: RootState) =>
  state.task.activeProject;

export const selectProjects = (state: RootState) => {
  const projects = Array.from(
    new Set(state.task.tasks.map((task) => task.project)),
  );
  return projects.sort();
};

export const selectTasksByProject = (state: RootState) => {
  const active = state.task.activeProject;
  return active
    ? state.task.tasks.filter((task) => task.project === active)
    : state.task.tasks;
};

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
