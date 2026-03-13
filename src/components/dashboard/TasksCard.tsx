import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdCheckCircle,
  MdPlayArrow,
  MdStarBorder,
  MdStar,
} from "react-icons/md";
import type { Task } from "../../types/task.types";

interface TasksCardProps {
  tasks: Task[];
  projects: string[];
  activeProject: string | null;
  onProjectChange: (project: string | null) => void;
  onToggleFavorite: (taskId: string) => void;
  onStartTask: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  onCreateTask: (payload: {
    title: string;
    project: string;
    priority: Task["priority"];
    dueDate?: string;
  }) => void;
}

const TasksCard = ({
  tasks,
  projects,
  activeProject,
  onProjectChange,
  onToggleFavorite,
  onStartTask,
  onToggleComplete,
  onCreateTask,
}: TasksCardProps) => {
  const navigate = useNavigate();

  const handleStart = useCallback(
    (taskId: string) => () => onStartTask(taskId),
    [onStartTask],
  );

  const handleFavorite = useCallback(
    (taskId: string) => () => onToggleFavorite(taskId),
    [onToggleFavorite],
  );

  const [newTitle, setNewTitle] = useState("");
  const [newProject, setNewProject] = useState<string>(
    projects[0] ?? "General",
  );
  const [newPriority, setNewPriority] = useState<Task["priority"]>("medium");
  const [newDueDate, setNewDueDate] = useState<string>("");

  const visibleTasks = useMemo(() => tasks.slice(0, 3), [tasks]);
  const hiddenTaskCount = Math.max(0, tasks.length - visibleTasks.length);

  useEffect(() => {
    if (activeProject) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNewProject(activeProject);
    }
  }, [activeProject]);

  const handleCreate = useCallback(() => {
    if (!newTitle.trim()) return;

    onCreateTask({
      title: newTitle.trim(),
      project: newProject || "General",
      priority: newPriority,
      dueDate: newDueDate || undefined,
    });

    setNewTitle("");
    setNewDueDate("");
  }, [newDueDate, newPriority, newProject, newTitle, onCreateTask]);

  const handleComplete = useCallback(
    (taskId: string) => () => onToggleComplete(taskId),
    [onToggleComplete],
  );

  return (
    <div className="h-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 md:flex-col md:text-left md:justify-between">
        <div className="">
          <h3 className="text-lg font-semibold text-gray-800">Today's Tasks</h3>
          <p className="text-sm text-gray-500">
            Quick access to your active to-dos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">Project</label>
          <select
            value={activeProject ?? ""}
            onChange={(e) =>
              onProjectChange(e.target.value ? e.target.value : null)
            }
            className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">All projects</option>
            {projects.map((project) => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="max-h-85 space-y-3 overflow-y-auto pr-2">
          {visibleTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3 transition hover:bg-gray-100"
            >
              <button
                onClick={handleComplete(task.id)}
                className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-white text-green-500 shadow-sm transition hover:bg-green-50"
                aria-label={
                  task.status === "done"
                    ? `Mark ${task.title} as incomplete`
                    : `Mark ${task.title} as complete`
                }
              >
                <MdCheckCircle
                  className={`h-5 w-5 ${
                    task.status === "done" ? "text-green-500" : "text-gray-300"
                  }`}
                />
              </button>

              <button
                onClick={handleStart(task.id)}
                className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-white text-orange-500 shadow-sm transition hover:bg-orange-50"
                aria-label={`Start ${task.title}`}
              >
                <MdPlayArrow className="h-5 w-5" />
              </button>

              <div className="flex-1 px-3">
                <p
                  className={`text-sm font-semibold ${
                    task.status === "done"
                      ? "text-gray-400 line-through"
                      : "text-gray-800"
                  }`}
                >
                  {task.title}
                </p>
                <p className="text-xs text-gray-500">{task.project}</p>
              </div>

              <button
                onClick={handleFavorite(task.id)}
                className="inline-flex items-center justify-center h-10 w-10 rounded-lg text-gray-500 transition hover:bg-gray-100"
                aria-label={
                  task.favorite ? "Remove favorite" : "Add to favorites"
                }
              >
                {task.favorite ? (
                  <MdStar className="h-5 w-5 text-orange-500" />
                ) : (
                  <MdStarBorder className="h-5 w-5" />
                )}
              </button>
            </div>
          ))}
        </div>

        {hiddenTaskCount > 0 && (
          <div className="flex items-center justify-between gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
            <span>{hiddenTaskCount} more task(s) available</span>
            <button
              onClick={() => navigate("/task")}
              className="rounded-lg bg-blue-600 px-3 py-1 text-white transition hover:bg-blue-700 hover:scale-105"
            >
              Manage
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-gray-100 bg-white p-4">
        <h4 className="text-sm font-semibold text-gray-800">Add a new task</h4>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Task title"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />

          <select
            value={newProject}
            onChange={(e) => setNewProject(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            {projects.map((project) => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
          </select>

          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as Task["priority"])}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleCreate}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
            disabled={!newTitle.trim()}
          >
            Add task
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(TasksCard);
