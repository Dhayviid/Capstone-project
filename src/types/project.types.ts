import type { Task } from "./task.types";

export type Weekday =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday";

export interface ProjectTask extends Task {
  day: Weekday;
  due?: string; // e.g. "2:00 PM"
  participants?: string[];
}
