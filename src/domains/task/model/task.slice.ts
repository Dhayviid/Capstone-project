import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Task, TaskState } from "./task.types";
import type { CreateTaskPayload } from "../../../types/task.types";

const simulateApiDelay = (ms = 700) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const loadTasksFromStorage = (): Task[] => {
  const saved = localStorage.getItem("tasks");
  if (!saved) return [];
  try {
    return JSON.parse(saved) as Task[];
  } catch {
    return [];
  }
};

const saveTasksToStorage = (tasks: Task[]) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

export const fetchTasks = createAsyncThunk<
  Task[],
  void,
  { rejectValue: string }
>("task/fetchTasks", async (_, { rejectWithValue }) => {
  try {
    await simulateApiDelay();
    const stored = loadTasksFromStorage();
    if (stored.length > 0) return stored;

    const now = new Date();
    const isoToday = now.toISOString();
    const plusDay = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    const plusTwoDays = new Date(
      now.getTime() + 2 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const seedTasks: Task[] = [
      {
        id: "task-1",
        title: "Kick off team planning",
        description: "Review roadmap and define sprint goals.",
        status: "todo",
        assignedTo: "David",
        createdAt: isoToday,
        priority: "high",
        scheduledAt: isoToday,
        timeSpent: 0,
      },
      {
        id: "task-2",
        title: "Design review session",
        description: "Go through UI feedback and finalize cards.",
        status: "todo",
        assignedTo: "Maya",
        createdAt: isoToday,
        priority: "medium",
        scheduledAt: plusDay,
        timeSpent: 0,
      },
      {
        id: "task-3",
        title: "Write integration tests",
        description: "Add tests for task CRUD flows.",
        status: "done",
        assignedTo: "Ali",
        createdAt: plusDay,
        priority: "low",
        scheduledAt: plusTwoDays,
        timeSpent: 3600,
      },
    ];
    saveTasksToStorage(seedTasks);
    return seedTasks;
  } catch {
    return rejectWithValue("Unable to load tasks");
  }
});

export const createTask = createAsyncThunk<
  Task,
  CreateTaskPayload,
  { rejectValue: string }
>("task/createTask", async (taskData, { rejectWithValue }) => {
  if (!taskData.assignedTo || !taskData.assignedTo.trim()) {
    return rejectWithValue("Task must be assigned to a user");
  }
  try {
    await simulateApiDelay();
    const tasks = loadTasksFromStorage();
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const next = [...tasks, newTask];
    saveTasksToStorage(next);
    return newTask;
  } catch {
    return rejectWithValue("Failed to create task");
  }
});

export const updateTaskAsync = createAsyncThunk<
  Task,
  Task,
  { rejectValue: string }
>("task/updateTask", async (task, { rejectWithValue }) => {
  try {
    await simulateApiDelay();
    const tasks = loadTasksFromStorage();
    const index = tasks.findIndex((item) => item.id === task.id);
    if (index === -1) {
      return rejectWithValue("Task not found");
    }
    tasks[index] = task;
    saveTasksToStorage(tasks);
    return task;
  } catch {
    return rejectWithValue("Failed to update task");
  }
});

export const deleteTaskAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("task/deleteTask", async (id, { rejectWithValue }) => {
  try {
    await simulateApiDelay();
    const tasks = loadTasksFromStorage();
    const next = tasks.filter((task) => task.id !== id);
    saveTasksToStorage(next);
    return id;
  } catch {
    return rejectWithValue("Failed to delete task");
  }
});

export const toggleTaskStatusAsync = createAsyncThunk<
  Task,
  string,
  { rejectValue: string }
>("task/toggleTaskStatus", async (id, { rejectWithValue }) => {
  await simulateApiDelay();
  const tasks = loadTasksFromStorage();
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    return rejectWithValue("Task not found");
  }
  const task = tasks[index];
  const updated: Task = {
    ...task,
    status: task.status === "todo" ? "done" : "todo",
  };
  tasks[index] = updated;
  saveTasksToStorage(tasks);
  return updated;
});

export const updateTaskTimeAsync = createAsyncThunk<
  Task,
  { id: string; timeSpent: number },
  { rejectValue: string }
>("task/updateTaskTime", async ({ id, timeSpent }, { rejectWithValue }) => {
  try {
    await simulateApiDelay();
    const tasks = loadTasksFromStorage();
    const index = tasks.findIndex((task) => task.id === id);
    if (index === -1) {
      return rejectWithValue("Task not found");
    }
    tasks[index] = { ...tasks[index], timeSpent };
    saveTasksToStorage(tasks);
    return tasks[index];
  } catch {
    return rejectWithValue("Failed to update task time");
  }
});

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  activeProject: null,
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setActiveProject: (state, action: PayloadAction<string | null>) => {
      state.activeProject = action.payload;
    },
    updateTaskSchedule: (
      state,
      action: PayloadAction<{ taskId: string; date: string }>,
    ) => {
      const task = state.tasks.find(
        (item) => item.id === action.payload.taskId,
      );
      if (!task) return;
      task.scheduledAt = action.payload.date;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Could not fetch tasks";
      })

      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Could not create task";
      })

      .addCase(updateTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        state.loading = false;
        const ix = state.tasks.findIndex(
          (task) => task.id === action.payload.id,
        );
        if (ix !== -1) state.tasks[ix] = action.payload;
      })
      .addCase(updateTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Could not update task";
      })

      .addCase(deleteTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(deleteTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Could not delete task";
      })

      .addCase(toggleTaskStatusAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleTaskStatusAsync.fulfilled, (state, action) => {
        state.loading = false;
        const ix = state.tasks.findIndex(
          (task) => task.id === action.payload.id,
        );
        if (ix !== -1) state.tasks[ix] = action.payload;
      })
      .addCase(toggleTaskStatusAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Could not toggle status";
      })

      .addCase(updateTaskTimeAsync.fulfilled, (state, action) => {
        const ix = state.tasks.findIndex(
          (task) => task.id === action.payload.id,
        );
        if (ix !== -1) state.tasks[ix] = action.payload;
      });
  },
});

export const { clearError, setActiveProject, updateTaskSchedule } =
  taskSlice.actions;

export default taskSlice.reducer;
