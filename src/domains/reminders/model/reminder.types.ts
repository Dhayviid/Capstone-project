export type ReminderPriority = "low" | "medium" | "high";

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  dateTime: string;
  priority: ReminderPriority;
  createdAt: string;
}

export interface ReminderState {
  reminders: Reminder[];
  loading: boolean;
  error: string | null;
}
