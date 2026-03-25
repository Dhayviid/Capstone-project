import { useDroppable } from "@dnd-kit/core";
import type { Task } from "../../task/model/task.types";
import SortableTaskCard from "./sortable-task-card";

interface DayColumnProps {
  date: string;
  label: string;
  tasks: Task[];
}

const DayColumn = ({ date, label, tasks }: DayColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: date });

  return (
    <section
      ref={setNodeRef}
      className={`min-w-55 border rounded-xl p-3 bg-white transition ${
        isOver ? "border-blue-400 bg-blue-50" : "border-gray-200"
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-gray-500">{label}</p>
          <p className="text-sm font-semibold text-gray-700">{date}</p>
        </div>
        <div className="text-xs text-gray-500">{tasks.length}</div>
      </div>
      <div className="space-y-2 min-h-30">
        {tasks.length === 0 ? (
          <div className="text-xs text-gray-400">No tasks</div>
        ) : (
          tasks.map((task) => <SortableTaskCard key={task.id} task={task} />)
        )}
      </div>
    </section>
  );
};

export default DayColumn;
