export type TaskPriority = "low" | "medium" | "high";

export type TaskStatus = "todo" | "done";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignedTo?: string;
  createdAt: string;
  priority: TaskPriority;
  scheduledAt?: string;
  timeSpent: number;
  project?: string;
  favorite?: boolean;
  dueDate?: string;
  day?: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  participants?: string[];
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status: TaskStatus;
  assignedTo: string;
  priority: TaskPriority;
  scheduledAt?: string;
  timeSpent: number;
  project?: string;
  favorite?: boolean;
  dueDate?: string;
}
