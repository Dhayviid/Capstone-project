import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../auth/slices/auth.slice";
import taskReducer from "../domains/task/model/task.slice";
import teamReducer from "../domains/team/model/team.slice";
import timerReducer from "../domains/timer/model/timer.slice";
import reminderReducer from "../domains/reminders/model/reminder.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
    team: teamReducer,
    timer: timerReducer,
    reminder: reminderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
