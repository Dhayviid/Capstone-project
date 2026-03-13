import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Task, TaskState } from "./task.types";

// Simulated API delay
const simulateApiDelay = (ms: number = 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Async thunks
export const fetchTasks = createAsyncThunk(
  "task/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      await simulateApiDelay();
      const saved = localStorage.getItem("tasks");

      if (saved) {
        return JSON.parse(saved);
      }

      // Seed sample tasks on first load
      const today = new Date();
      const formatISODate = (date: Date) => date.toISOString().split("T")[0];

      const initialTasks: Task[] = [
        {
          id: "t-1",
          title: "Define MVP features",
          description: "Capture core requirements and user flows.",
          project: "Product",
          priority: "high",
          status: "todo",
          favorite: true,
          createdAt: new Date().toISOString(),
          dueDate: formatISODate(today),
          day: "Monday",
          time: "10:00 AM",
          participants: ["Ali", "Sam"],
        },
        {
          id: "t-2",
          title: "Design onboarding screens",
          description: "Create high-fidelity mocks for onboarding.",
          project: "Design",
          priority: "medium",
          status: "in-progress",
          favorite: false,
          createdAt: new Date().toISOString(),
          dueDate: formatISODate(
            new Date(today.getTime() + 24 * 60 * 60 * 1000),
          ),
          day: "Tuesday",
          time: "2:00 PM",
          participants: ["Maya"],
        },
        {
          id: "t-3",
          title: "Run usability tests",
          description: "Gather feedback from recent test sessions.",
          project: "Research",
          priority: "low",
          status: "todo",
          favorite: false,
          createdAt: new Date().toISOString(),
          dueDate: formatISODate(
            new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
          ),
          day: "Wednesday",
          time: "11:00 AM",
          participants: ["Jules", "Noah"],
        },
        {
          id: "t-4",
          title: "Prepare release notes",
          description: "Document product updates for this release.",
          project: "Release",
          priority: "high",
          status: "todo",
          favorite: false,
          createdAt: new Date().toISOString(),
          dueDate: formatISODate(
            new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
          ),
          day: "Thursday",
          time: "4:00 PM",
          participants: ["Sam"],
        },
      ];

      localStorage.setItem("tasks", JSON.stringify(initialTasks));
      return initialTasks;
    } catch {
      return rejectWithValue("Failed to fetch tasks");
    }
  },
);

export const createTask = createAsyncThunk(
  "task/createTask",
  async (taskData: Omit<Task, "id" | "createdAt">, { rejectWithValue }) => {
    try {
      await simulateApiDelay();
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: taskData.status ?? "todo",
        favorite: taskData.favorite ?? false,
      };

      const saved = localStorage.getItem("tasks");
      const tasks = saved ? JSON.parse(saved) : [];
      tasks.push(newTask);
      localStorage.setItem("tasks", JSON.stringify(tasks));

      return newTask;
    } catch {
      return rejectWithValue("Failed to create task");
    }
  },
);

export const updateTaskAsync = createAsyncThunk(
  "task/updateTask",
  async (task: Task, { rejectWithValue }) => {
    try {
      await simulateApiDelay();
      const saved = localStorage.getItem("tasks");
      const tasks = saved ? JSON.parse(saved) : [];
      const index = tasks.findIndex((t: Task) => t.id === task.id);

      if (index === -1) {
        throw new Error("Task not found");
      }

      tasks[index] = task;
      localStorage.setItem("tasks", JSON.stringify(tasks));

      return task;
    } catch {
      return rejectWithValue("Failed to update task");
    }
  },
);

export const deleteTaskAsync = createAsyncThunk(
  "task/deleteTask",
  async (taskId: string, { rejectWithValue }) => {
    try {
      await simulateApiDelay();
      const saved = localStorage.getItem("tasks");
      const tasks = saved ? JSON.parse(saved) : [];
      const filteredTasks = tasks.filter((t: Task) => t.id !== taskId);
      localStorage.setItem("tasks", JSON.stringify(filteredTasks));

      return taskId;
    } catch {
      return rejectWithValue("Failed to delete task");
    }
  },
);

export const toggleTaskAsync = createAsyncThunk(
  "task/toggleTask",
  async (taskId: string, { rejectWithValue, getState }) => {
    try {
      await simulateApiDelay();
      const state = getState() as { task: TaskState };
      const task = state.task.tasks.find((t) => t.id === taskId);

      if (!task) {
        throw new Error("Task not found");
      }

      const updatedTask = {
        ...task,
        status: task.status === "todo" ? "done" : "todo",
      } as Task;

      const saved = localStorage.getItem("tasks");
      const tasks = saved ? JSON.parse(saved) : [];
      const index = tasks.findIndex((t: Task) => t.id === taskId);
      tasks[index] = updatedTask;
      localStorage.setItem("tasks", JSON.stringify(tasks));

      return updatedTask;
    } catch {
      return rejectWithValue("Failed to toggle task");
    }
  },
);

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
    setActiveProject: (state, action: { payload: string | null }) => {
      state.activeProject = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Tasks
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
        state.error = action.payload as string;
      })

      // Create Task
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
        state.error = action.payload as string;
      })

      // Update Task
      .addCase(updateTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Task
      .addCase(deleteTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Toggle Task
      .addCase(toggleTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleTaskAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(toggleTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setActiveProject } = taskSlice.actions;
export default taskSlice.reducer;
