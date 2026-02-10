import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../shared/layout/app-layout";
import ErrorFallback from "../shared/utils/error_fallback";
import ProtectedRoute from "../shared/utils/ProtectedRoute";

import DashboardPage from "../domains/dashboard/page/dashboard.page";
import SignInPage from "../auth/page/SignIn.page";
import SignUpPage from "../auth/page/SignUp.page";
import ProfilePage from "../domains/profile/page/profile.page";
import SettingsPage from "../domains/settings/page/settings.page";

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

  // 🔒 Protected Routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          { path: "dashboard", element: <DashboardPage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "settings", element: <SettingsPage /> },
          // { path: "logout", element: <Logout /> },
        ],
      },
    ],
  },
]);

export default router;
