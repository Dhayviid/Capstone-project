import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../../store/store";
import { updateTaskTimeAsync } from "../../task/model/task.slice";

export interface TimerState {
  activeTaskId: string | null;
  startTime: string | null;
  elapsed: number;
  isRunning: boolean;
  error: string | null;
}

const simulateApiDelay = (ms = 150) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const loadTimer = (): TimerState => {
  const stored = localStorage.getItem("timer");
  if (!stored) {
    return {
      activeTaskId: null,
      startTime: null,
      elapsed: 0,
      isRunning: false,
      error: null,
    };
  }
  try {
    const parsed = JSON.parse(stored) as TimerState;
    return {
      ...parsed,
      error: null,
    };
  } catch {
    return {
      activeTaskId: null,
      startTime: null,
      elapsed: 0,
      isRunning: false,
      error: null,
    };
  }
};

const persistTimer = (timer: TimerState) => {
  localStorage.setItem("timer", JSON.stringify(timer));
};

const getNow = () => new Date().toISOString();

export const startTimerAsync = createAsyncThunk<
  {
    activeTaskId: string;
    startTime: string;
    elapsed: number;
    isRunning: boolean;
  },
  { taskId: string },
  { state: RootState; rejectValue: string }
>(
  "timer/startTimer",
  async ({ taskId }, { dispatch, getState, rejectWithValue }) => {
    if (!taskId) {
      return rejectWithValue("Task is required to start timer");
    }
    try {
      await simulateApiDelay();
      const state = getState();
      const timer = state.timer;
      const now = Date.now();

      let elapsed = 0;
      if (timer.activeTaskId === taskId) {
        // resume existing task
        elapsed = timer.elapsed;
      }

      if (
        timer.isRunning &&
        timer.activeTaskId &&
        timer.activeTaskId !== taskId
      ) {
        const delta = Math.floor(
          (now - new Date(timer.startTime!).getTime()) / 1000,
        );
        const total = timer.elapsed + delta;
        await dispatch(
          updateTaskTimeAsync({ id: timer.activeTaskId, timeSpent: total }),
        ).unwrap();
      }

      return {
        activeTaskId: taskId,
        startTime: getNow(),
        elapsed,
        isRunning: true,
      };
    } catch {
      return rejectWithValue("Could not start timer");
    }
  },
);

export const pauseTimerAsync = createAsyncThunk<
  { startTime: null; elapsed: number; isRunning: false },
  void,
  { state: RootState; rejectValue: string }
>("timer/pauseTimer", async (_, { getState, rejectWithValue }) => {
  const state = getState();
  const timer = state.timer;
  if (!timer.activeTaskId || !timer.isRunning || !timer.startTime) {
    return rejectWithValue("No active running timer to pause");
  }
  try {
    await simulateApiDelay();
    const now = Date.now();
    const delta = Math.floor(
      (now - new Date(timer.startTime).getTime()) / 1000,
    );
    const elapsed = timer.elapsed + delta;
    return { startTime: null, elapsed, isRunning: false };
  } catch {
    return rejectWithValue("Could not pause timer");
  }
});

export const resumeTimerAsync = createAsyncThunk<
  { startTime: string; isRunning: true },
  void,
  { state: RootState; rejectValue: string }
>("timer/resumeTimer", async (_, { getState, rejectWithValue }) => {
  const state = getState();
  const timer = state.timer;
  if (!timer.activeTaskId) {
    return rejectWithValue("No paused timer to resume");
  }
  if (timer.isRunning) {
    return rejectWithValue("Timer is already running");
  }
  try {
    await simulateApiDelay();
    return { startTime: getNow(), isRunning: true };
  } catch {
    return rejectWithValue("Could not resume timer");
  }
});

export const cancelTimerAsync = createAsyncThunk<
  { activeTaskId: null; startTime: null; elapsed: 0; isRunning: false },
  void,
  { state: RootState; rejectValue: string }
>("timer/cancelTimer", async (_, { getState, rejectWithValue }) => {
  const state = getState();
  if (!state.timer.activeTaskId) {
    return rejectWithValue("No timer to cancel");
  }
  try {
    await simulateApiDelay();
    return {
      activeTaskId: null,
      startTime: null,
      elapsed: 0,
      isRunning: false,
    };
  } catch {
    return rejectWithValue("Could not cancel timer");
  }
});

export const stopTimerAsync = createAsyncThunk<
  { activeTaskId: null; startTime: null; elapsed: number; isRunning: false },
  void,
  { state: RootState; rejectValue: string }
>("timer/stopTimer", async (_, { dispatch, getState, rejectWithValue }) => {
  const state = getState();
  const timer = state.timer;
  if (!timer.activeTaskId || !timer.startTime) {
    return {
      activeTaskId: null,
      startTime: null,
      elapsed: 0,
      isRunning: false,
    };
  }
  try {
    await simulateApiDelay();
    const now = Date.now();
    const delta = Math.floor(
      (now - new Date(timer.startTime).getTime()) / 1000,
    );
    const total = timer.elapsed + delta;
    await dispatch(
      updateTaskTimeAsync({ id: timer.activeTaskId, timeSpent: total }),
    ).unwrap();
    return {
      activeTaskId: null,
      startTime: null,
      elapsed: 0,
      isRunning: false,
    };
  } catch {
    return rejectWithValue("Could not stop timer");
  }
});

const initialState: TimerState = loadTimer();

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    resetTimerError: (state) => {
      state.error = null;
    },
    startTimer: (state, action: PayloadAction<{ taskId: string }>) => {
      state.activeTaskId = action.payload.taskId;
      state.startTime = getNow();
      state.elapsed = 0;
      state.isRunning = true;
      state.error = null;
      persistTimer(state);
    },
    pauseTimer: (state) => {
      if (!state.activeTaskId || !state.startTime || !state.isRunning) return;
      const now = Date.now();
      const delta = Math.floor(
        (now - new Date(state.startTime).getTime()) / 1000,
      );
      state.elapsed += delta;
      state.startTime = null;
      state.isRunning = false;
      state.error = null;
      persistTimer(state);
    },
    resumeTimer: (state) => {
      if (!state.activeTaskId || state.isRunning) return;
      state.startTime = getNow();
      state.isRunning = true;
      state.error = null;
      persistTimer(state);
    },
    cancelTimer: (state) => {
      state.activeTaskId = null;
      state.startTime = null;
      state.elapsed = 0;
      state.isRunning = false;
      state.error = null;
      persistTimer(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startTimerAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(startTimerAsync.fulfilled, (state, action) => {
        state.activeTaskId = action.payload.activeTaskId;
        state.startTime = action.payload.startTime;
        state.elapsed = action.payload.elapsed;
        state.isRunning = action.payload.isRunning;
        state.error = null;
        persistTimer(state);
      })
      .addCase(startTimerAsync.rejected, (state, action) => {
        state.error = action.payload ?? "Could not start timer";
      })
      .addCase(pauseTimerAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(pauseTimerAsync.fulfilled, (state, action) => {
        state.startTime = action.payload.startTime;
        state.elapsed = action.payload.elapsed;
        state.isRunning = action.payload.isRunning;
        state.error = null;
        persistTimer(state);
      })
      .addCase(pauseTimerAsync.rejected, (state, action) => {
        state.error = action.payload ?? "Could not pause timer";
      })
      .addCase(resumeTimerAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(resumeTimerAsync.fulfilled, (state, action) => {
        state.startTime = action.payload.startTime;
        state.isRunning = action.payload.isRunning;
        state.error = null;
        persistTimer(state);
      })
      .addCase(resumeTimerAsync.rejected, (state, action) => {
        state.error = action.payload ?? "Could not resume timer";
      })
      .addCase(cancelTimerAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(cancelTimerAsync.fulfilled, (state, action) => {
        state.activeTaskId = action.payload.activeTaskId;
        state.startTime = action.payload.startTime;
        state.elapsed = action.payload.elapsed;
        state.isRunning = action.payload.isRunning;
        state.error = null;
        persistTimer(state);
      })
      .addCase(cancelTimerAsync.rejected, (state, action) => {
        state.error = action.payload ?? "Could not cancel timer";
      })
      .addCase(stopTimerAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(stopTimerAsync.fulfilled, (state, action) => {
        state.activeTaskId = action.payload.activeTaskId;
        state.startTime = action.payload.startTime;
        state.elapsed = 0;
        state.isRunning = false;
        state.error = null;
        persistTimer(state);
      })
      .addCase(stopTimerAsync.rejected, (state, action) => {
        state.error = action.payload ?? "Could not stop timer";
      });
  },
});

export const {
  resetTimerError,
  startTimer,
  pauseTimer,
  resumeTimer,
  cancelTimer,
} = timerSlice.actions;

export const selectTimer = (state: RootState) => state.timer;
export const selectTimerDisplay = (state: RootState) => {
  if (!state.timer.isRunning || !state.timer.startTime) {
    return state.timer.elapsed;
  }
  const delta = Math.floor(
    (Date.now() - new Date(state.timer.startTime).getTime()) / 1000,
  );
  return state.timer.elapsed + delta;
};

export default timerSlice.reducer;
