import { useState } from "react";
import type { DragEvent } from "react";
import type { ProjectTask, Weekday } from "../../types/project.types";
import TaskCard from "./TaskCard";

interface DayColumnProps {
  label: string;
  day: Weekday;
  tasks: ProjectTask[];
  onDropTask: (taskId: string, toDay: Weekday) => void;
}

const DayColumn = ({ label, day, tasks, onDropTask }: DayColumnProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const taskId = event.dataTransfer.getData("text/plain");
    if (taskId) {
      onDropTask(taskId, day);
    }
  };

  return (
    <div
      className={`space-y-4 rounded-xl border p-4 transition ${
        isDragOver ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-gray-50"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-800">{label}</h4>
        <span className="text-xs text-gray-500">{tasks.length}</span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default DayColumn;
