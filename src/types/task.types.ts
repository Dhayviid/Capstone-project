export type TaskPriority = "low" | "medium" | "high";

export type Weekday =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday";

export interface Task {
  id: string;
  title: string;
  description?: string;
  project: string;
  priority: TaskPriority;
  status: "todo" | "in-progress" | "done";
  favorite: boolean;
  createdAt: string;
  dueDate?: string; // ISO date string (e.g., 2026-03-09)
  time?: string; // e.g. "2h", "3:30PM"
  day?: Weekday;
  participants?: string[];
  assignedTo?: string;
}
