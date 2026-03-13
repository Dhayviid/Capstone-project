import { memo } from "react";
import { Pie, PieChart, ResponsiveContainer, Cell, Legend } from "recharts";

interface CircularChartCardProps {
  completed: number;
  pending: number;
}

const COLORS = ["#10B981", "#F59E0B"];

const CircularChartCard = ({ completed, pending }: CircularChartCardProps) => {
  const total = completed + pending;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  const data = [
    { name: "Completed", value: completed },
    { name: "Pending", value: pending },
  ];

  return (
    <div className="h-full rounded-xl border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Progress</h3>
          <p className="mt-1 text-sm text-gray-500">Tasks completion</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold text-gray-800">{percent}%</span>
          <p className="text-xs text-gray-500">done</p>
        </div>
      </div>

      <div className="mt-5 h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="60%"
              outerRadius="80%"
              paddingAngle={4}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" height={24} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default memo(CircularChartCard);
