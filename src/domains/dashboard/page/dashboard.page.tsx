import DashboardSummary from "../components/dashboard-summary";

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <DashboardSummary />
    </div>
  );
};

export default DashboardPage;
