import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { selectAllTasks } from "../model/task.selectors";
import { fetchTasks } from "../model/task.slice";
import TaskHeader from "../components/task-header";
import TaskItem from "../components/task-item";
import type { RootState, AppDispatch } from "../../../store/store";
import type { Task } from "../model/task.types";

const TaskPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector(selectAllTasks);
  const { loading, error } = useSelector((state: RootState) => state.task);
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "status" | "title">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const filteredTasks = (() => {
    let filtered =
      status === "completed"
        ? tasks.filter((t) => t.status === "done")
        : status === "pending"
          ? tasks.filter((t) => t.status === "todo")
          : tasks;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          (task.assignedTo && task.assignedTo.toLowerCase().includes(query)),
      );
    }

    // Apply sorting
    filtered = [...filtered].sort((a: Task, b: Task) => {
      let comparison = 0;

      switch (sortBy) {
        case "date":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  })();

  if (loading && tasks.length === 0) {
    return (
      <div className="space-y-6">
        <TaskHeader />
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading tasks...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <TaskHeader />
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-center text-red-600">
            <p>Error loading tasks: {error}</p>
            <button
              onClick={() => dispatch(fetchTasks())}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TaskHeader />

      {/* Sorting and Search Controls */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "date" | "status" | "title")
              }
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm bg-white text-gray-900"
            >
              <option value="date">Date Created</option>
              <option value="status">Status</option>
              <option value="title">Title</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Order:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm bg-white text-gray-900"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-200">
        {filteredTasks.length === 0 ? (
          <p className="p-6 text-gray-500">
            {status
              ? `No ${status} tasks found`
              : searchQuery
                ? "No tasks match your search"
                : "No tasks found"}
          </p>
        ) : (
          filteredTasks.map((task) => <TaskItem key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
};

export default TaskPage;
