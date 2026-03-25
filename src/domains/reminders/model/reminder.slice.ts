import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Reminder, ReminderState } from "./reminder.types";

const STORAGE_KEY = "reminders";

const loadFromStorage = (): Reminder[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as Reminder[];
  } catch {
    return [];
  }
};

const saveToStorage = (reminders: Reminder[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
};

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchReminders = createAsyncThunk<Reminder[]>(
  "reminder/fetchReminders",
  async () => {
    await delay();
    const items = loadFromStorage();
    return items;
  },
);

export const createReminder = createAsyncThunk<
  Reminder,
  Omit<Reminder, "id" | "createdAt">
>("reminder/createReminder", async (payload) => {
  await delay();
  const existing = loadFromStorage();
  const next: Reminder = {
    ...payload,
    id: `reminder-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const nextList = [...existing, next];
  saveToStorage(nextList);
  return next;
});

export const updateReminder = createAsyncThunk<Reminder, Reminder>(
  "reminder/updateReminder",
  async (payload, { rejectWithValue }) => {
    await delay();
    const existing = loadFromStorage();
    const index = existing.findIndex((r) => r.id === payload.id);
    if (index === -1) {
      return rejectWithValue("Reminder not found");
    }
    existing[index] = payload;
    saveToStorage(existing);
    return payload;
  },
);

export const deleteReminder = createAsyncThunk<string, string>(
  "reminder/deleteReminder",
  async (id, { rejectWithValue }) => {
    await delay();
    const existing = loadFromStorage();
    const next = existing.filter((r) => r.id !== id);
    if (next.length === existing.length) {
      return rejectWithValue("Reminder not found");
    }
    saveToStorage(next);
    return id;
  },
);

const initialState: ReminderState = {
  reminders: [],
  loading: false,
  error: null,
};

const reminderSlice = createSlice({
  name: "reminder",
  initialState,
  reducers: {
    setReminders: (state, action: PayloadAction<Reminder[]>) => {
      state.reminders = action.payload;
    },
    clearReminderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReminders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReminders.fulfilled, (state, action) => {
        state.loading = false;
        state.reminders = action.payload;
      })
      .addCase(fetchReminders.rejected, (state) => {
        state.loading = false;
        state.error = "Could not load reminders";
      })
      .addCase(createReminder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReminder.fulfilled, (state, action) => {
        state.loading = false;
        state.reminders.push(action.payload);
      })
      .addCase(createReminder.rejected, (state) => {
        state.loading = false;
        state.error = "Could not create reminder";
      })
      .addCase(updateReminder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReminder.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.reminders.findIndex(
          (r) => r.id === action.payload.id,
        );
        if (idx !== -1) {
          state.reminders[idx] = action.payload;
        }
      })
      .addCase(updateReminder.rejected, (state) => {
        state.loading = false;
        state.error = "Could not update reminder";
      })
      .addCase(deleteReminder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReminder.fulfilled, (state, action) => {
        state.loading = false;
        state.reminders = state.reminders.filter(
          (r) => r.id !== action.payload,
        );
      })
      .addCase(deleteReminder.rejected, (state) => {
        state.loading = false;
        state.error = "Could not delete reminder";
      });
  },
});

export const { setReminders, clearReminderError } = reminderSlice.actions;

export default reminderSlice.reducer;
