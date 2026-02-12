import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TaskStatus = "todo" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  assignedTo?: string;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [
    {
      id: "1",
      title: "Design Dashboard UI",
      description: "Create layout and summary cards",
      status: "todo",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Setup Redux Store",
      description: "Configure global state",
      status: "done",
      createdAt: new Date().toISOString(),
    },
  ],
  loading: false,
  error: null,
};
const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    toggleTaskStatus: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((task) => task.id === action.payload);
      if (task) {
        task.status = task.status === "todo" ? "done" : "todo";
      }
    },
  },
});

export const { addTask, deleteTask, toggleTaskStatus } = taskSlice.actions;

export default taskSlice.reducer;

