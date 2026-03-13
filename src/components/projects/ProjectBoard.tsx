import type { ProjectTask } from "../../types/project.types";
import DayColumn from "./DayColumn";

interface ProjectBoardProps {
  tasks: ProjectTask[];
  todayTasks: ProjectTask[];
  todayWeekday: ProjectTask["day"];
  taskCount: number;
  onMoveTask: (taskId: string, toDay: ProjectTask["day"]) => void;
}

const DAYS: Array<ProjectTask["day"]> = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const ProjectBoard = ({
  tasks,
  todayTasks,
  todayWeekday,
  taskCount,
  onMoveTask,
}: ProjectBoardProps) => {
  const tasksByDay = tasks.reduce<Record<ProjectTask["day"], ProjectTask[]>>(
    (acc, task) => {
      if (!task.day) return acc;
      acc[task.day] = [...(acc[task.day] ?? []), task];
      return acc;
    },
    { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [] },
  );

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Weekly Project Board
          </h3>
          <p className="text-sm text-gray-500">
            Track progress across each day of the week.
          </p>
        </div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          {taskCount} tasks
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
        <DayColumn
          key="today"
          label="Today"
          day={todayWeekday}
          tasks={todayTasks}
          onDropTask={onMoveTask}
        />
        {DAYS.map((day) => (
          <DayColumn
            key={day}
            label={day}
            day={day}
            tasks={tasksByDay[day] ?? []}
            onDropTask={onMoveTask}
          />
        ))}
      </div>
    </section>
  );
};

export default ProjectBoard;
