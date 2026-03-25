import { useDraggable } from "@dnd-kit/core";
import type { CSSProperties } from "react";
import type { Task } from "../../task/model/task.types";

interface SortableTaskCardProps {
  task: Task;
}

const SortableTaskCard = ({ task }: SortableTaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: { type: "task", taskId: task.id },
    });

  const style: CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-gray-200 rounded-md p-2 cursor-move shadow-sm hover:shadow-md transition"
      {...listeners}
      {...attributes}
    >
      <div className="text-sm font-medium text-gray-800">{task.title}</div>
      <div className="text-xs text-gray-500 mt-1">
        {task.status.toUpperCase()}
      </div>
    </div>
  );
};

export default SortableTaskCard;
