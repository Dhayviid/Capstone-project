import type { Task as GlobalTask } from "../../../types/task.types";

export type Task = GlobalTask;

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  activeProject: string | null;
}
