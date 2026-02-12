interface StatsCardProps {
  title: string;
  value: number;
}

const StatsCard = ({ title, value }: StatsCardProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm cursor-pointer">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
    </div>
  );
};

export default StatsCard;
