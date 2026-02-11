import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../shared/layout/app-layout";
import ErrorFallback from "../shared/utils/error_fallback";
import ProtectedRoute from "../shared/utils/ProtectedRoute";

import DashboardPage from "../domains/dashboard/page/dashboard.page";
import SignInPage from "../auth/page/SignIn.page";
import SignUpPage from "../auth/page/SignUp.page";
// import ProfilePage from "../domains/profile/page/profile.page";
import SettingsPage from "../domains/settings/page/settings.page";
import ClientPage from "../domains/client/page/client.page";
import NotePage from "../domains/note/page/note.page";
import ReportPage from "../domains/report/page/report.page";
import SchedulePage from "../domains/schedule/page/schedule.page";
import SupportPage from "../domains/support/page/support.page";
import TaskPage from "../domains/task/page/task.page";
import TeamPage from "../domains/team/page/team.page";

const router = createBrowserRouter([
  // 🔓 Public Routes
  {
    path: "/",
    errorElement: <ErrorFallback />,
    children: [
      { index: true, element: <SignInPage /> },
      { path: "signin", element: <SignInPage /> },
      { path: "signup", element: <SignUpPage /> },
    ],
  },

  // Protected Routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          { path: "dashboard", element: <DashboardPage /> },
          { path: "client", element: <ClientPage /> },
          { path: "note", element: <NotePage /> },
          { path: "report", element: <ReportPage /> },
          { path: "schedule", element: <SchedulePage /> },
          { path: "settings", element: <SettingsPage /> },
          { path: "support", element: <SupportPage /> },
          { path: "task", element: <TaskPage /> },
          { path: "Team", element: <TeamPage /> },
          // { path: "logout", element: <Logout /> },
        ],
      },
    ],
  },
]);

export default router;
