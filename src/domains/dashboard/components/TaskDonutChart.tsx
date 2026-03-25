import { useMemo } from "react";
import { useSelector } from "react-redux";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { selectTaskStats } from "../../task/model/task.selectors";
import type { RootState } from "../../../store/store";

const COLORS = ["#10B981", "#EF4444"];

const renderLegend = (props: any) => {
  const { payload } = props;
  return (
    <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-500">
      {payload?.map((entry: unknown) => (
        <div key={entry.value} className="flex items-center gap-2 rounded-full bg-gray-50 px-2 py-1 text-gray-600 border border-gray-100">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const TaskDonutChart = () => {
  const { total, completed, pending } = useSelector((state: RootState) =>
    selectTaskStats(state),
  );

  const chartData = useMemo(
    () => [
      { name: "Completed", value: completed },
      { name: "Pending", value: pending },
    ],
    [completed, pending],
  );

  const percentCompleted = total ? Math.round((completed / total) * 100) : 0;

  if (total === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="text-base font-semibold">Task Completion</div>
        <div className="mt-3 text-sm text-gray-500">No task data available.</div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-base font-semibold text-gray-800">Task Completion</div>
          <div className="text-xs text-gray-500">Completed vs Pending tasks</div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-gray-800">{percentCompleted}%</div>
          <div className="text-xs text-gray-500">Completed</div>
        </div>
      </div>

      <div className="mt-3 h-56">
        <div className="relative h-full">
          <div className="absolute inset-0 rounded-full border border-gray-100" />
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                stroke="transparent"
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value} tasks`} />
              <Legend content={renderLegend} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-700">
        <div className="flex justify-between">
          <span className="text-gray-500">Completed Tasks</span>
          <span className="font-semibold text-green-600">{completed}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Pending Tasks</span>
          <span className="font-semibold text-red-600">{pending}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskDonutChart;
