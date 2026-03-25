import taskReducer, { fetchTasks, createTask } from "./task.slice";
import type { TaskState } from "./task.types";

describe("task reducer", () => {
  it("should load tasks on fetchFulfilled", () => {
    const initialState: TaskState = {
      tasks: [],
      loading: false,
      error: null,
      activeProject: null,
    };
    const nextState = taskReducer(
      initialState,
      fetchTasks.fulfilled(
        [
          {
            id: "1",
            title: "Task 1",
            status: "todo",
            createdAt: new Date().toISOString(),
            priority: "medium",
            timeSpent: 0,
          },
        ],
        "",
      ),
    );
    expect(nextState.tasks).toHaveLength(1);
    expect(nextState.tasks[0].title).toBe("Task 1");
  });

  it("should handle creating a task", () => {
    const initialState: TaskState = {
      tasks: [],
      loading: false,
      error: null,
      activeProject: null,
    };
    const newTask = {
      id: "1",
      title: "New task",
      status: "todo" as const,
      createdAt: new Date().toISOString(),
      priority: "low" as const,
      timeSpent: 0,
      assignedTo: "David",
    };
    const nextState = taskReducer(
      initialState,
      createTask.fulfilled(newTask, "", {
        title: newTask.title,
        status: newTask.status,
        priority: newTask.priority,
        timeSpent: newTask.timeSpent,
        assignedTo: newTask.assignedTo,
      }),
    );
    expect(nextState.tasks[0]).toEqual(newTask);
  });
});
