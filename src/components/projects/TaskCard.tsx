import { memo } from "react";
import type { ProjectTask } from "../../types/project.types";

interface TaskCardProps {
  task: ProjectTask;
}

const priorityStyles: Record<ProjectTask["priority"], string> = {
  low: "bg-green-100 text-green-800",
  medium: "bg-orange-100 text-orange-800",
  high: "bg-red-100 text-red-800",
};

const TaskCard = ({ task }: TaskCardProps) => (
  <div
    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
    draggable
    onDragStart={(event) => {
      event.dataTransfer.setData("text/plain", task.id);
      event.dataTransfer.effectAllowed = "move";
    }}
  >
    <div className="flex items-start justify-between gap-3">
      <span
        className={`rounded-full px-2 py-1 text-xs font-semibold ${priorityStyles[task.priority]}`}
      >
        {task.priority}
      </span>
      <span className="text-xs font-medium text-gray-500">
        {task.time ?? "—"}
      </span>
    </div>

    <h4 className="mt-3 text-sm font-semibold text-gray-800">{task.title}</h4>
    {task.description && (
      <p className="mt-1 max-h-10 overflow-hidden text-sm text-gray-500">
        {task.description}
      </p>
    )}

    {task.participants && task.participants.length > 0 && (
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {task.participants.slice(0, 3).map((participant) => (
          <span
            key={participant}
            className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
          >
            {participant}
          </span>
        ))}
        {task.participants.length > 3 && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
            +{task.participants.length - 3}
          </span>
        )}
      </div>
    )}
  </div>
);

export default memo(TaskCard);
