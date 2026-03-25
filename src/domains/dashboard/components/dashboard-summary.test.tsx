import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import DashboardSummary from "./dashboard-summary";
import taskReducer from "../../task/model/task.slice";
import authReducer from "../../../auth/slices/auth.slice";
import teamReducer from "../../team/model/team.slice";
import timerReducer from "../../timer/model/timer.slice";

it("renders dashboard summary metrics", () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      task: taskReducer,
      team: teamReducer,
      timer: timerReducer,
    },
    preloadedState: {
      task: {
        tasks: [
          {
            id: "1",
            title: "t",
            status: "todo" as const,
            createdAt: new Date().toISOString(),
            priority: "low" as const,
            timeSpent: 0,
          },
        ],
        loading: false,
        error: null,
        activeProject: null,
      },
      auth: {
        isAuthenticated: true,
        user: { name: "Test", email: "test@test.com" },
      },
      team: { members: [], loading: false, error: null },
      timer: {
        activeTaskId: null,
        startTime: null,
        elapsed: 0,
        isRunning: false,
        error: null,
      },
    },
  });

  render(
    <Provider store={store}>
      <BrowserRouter>
        <DashboardSummary />
      </BrowserRouter>
    </Provider>,
  );
  expect(screen.getByText(/Total Tasks/i)).toBeInTheDocument();
  expect(screen.getByText(/Completed Tasks/i)).toBeInTheDocument();
  expect(screen.getByText(/Pending Tasks/i)).toBeInTheDocument();
});
