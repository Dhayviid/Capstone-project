import type { RootState } from "../../../store/store";

export const selectReminders = (state: RootState) => state.reminder.reminders;
export const selectReminderLoading = (state: RootState) =>
  state.reminder.loading;
export const selectReminderError = (state: RootState) => state.reminder.error;
