import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Task, TaskState } from "./task.types";

const loadInitialTasks = (): Task[] => {
  try {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState: TaskState = {
  tasks: loadInitialTasks(),
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
      localStorage.setItem("tasks", JSON.stringify(state.tasks));
    },

    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      localStorage.setItem("tasks", JSON.stringify(state.tasks));
    },

    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) {
        task.status = task.status === "todo" ? "done" : "todo";
      }
      localStorage.setItem("tasks", JSON.stringify(state.tasks));
    },

    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
      localStorage.setItem("tasks", JSON.stringify(state.tasks));
    },
  },
});

export const { addTask, deleteTask, toggleTask, updateTask } =
  taskSlice.actions;
export default taskSlice.reducer;
