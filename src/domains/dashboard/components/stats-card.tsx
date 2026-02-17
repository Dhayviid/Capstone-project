import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color: string;
  to: string;
}

const StatsCard = ({ title, value, icon, color, to }: StatsCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(to)}
      className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-200 flex items-center justify-between cursor-pointer hover:scale-[1.02]"
    >
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <h2 className="text-3xl font-bold text-gray-800">{value}</h2>
      </div>

      <div
        className={`w-12 h-12 flex items-center justify-center rounded-xl ${color} text-white text-xl`}
      >
        {icon}
      </div>
    </div>
  );
};

export default StatsCard;
