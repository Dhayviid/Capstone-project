export type TaskStatus = "todo" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  assignedTo?: string;
}

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}
