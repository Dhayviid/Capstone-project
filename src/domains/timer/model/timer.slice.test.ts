import timerReducer, {
  startTimer,
  pauseTimer,
  resumeTimer,
  cancelTimer,
  startTimerAsync,
  pauseTimerAsync,
  resumeTimerAsync,
  cancelTimerAsync,
  stopTimerAsync,
} from "./timer.slice";
import type { TimerState } from "./timer.slice";

describe("timer reducer", () => {
  const initialState: TimerState = {
    activeTaskId: null,
    startTime: null,
    elapsed: 0,
    isRunning: false,
    error: null,
  };

  it("should start timer with reducer action", () => {
    const state = timerReducer(initialState, startTimer({ taskId: "task-1" }));
    expect(state.activeTaskId).toBe("task-1");
    expect(state.isRunning).toBe(true);
    expect(state.startTime).not.toBeNull();
    expect(state.elapsed).toBe(0);
  });

  it("should pause timer with reducer action", () => {
    const runningState: TimerState = {
      activeTaskId: "task-1",
      startTime: new Date(Date.now() - 2000).toISOString(),
      elapsed: 0,
      isRunning: true,
      error: null,
    };
    const state = timerReducer(runningState, pauseTimer());
    expect(state.isRunning).toBe(false);
    expect(state.startTime).toBeNull();
    expect(state.elapsed).toBeGreaterThanOrEqual(1);
  });

  it("should resume timer with reducer action", () => {
    const pausedState: TimerState = {
      activeTaskId: "task-1",
      startTime: null,
      elapsed: 10,
      isRunning: false,
      error: null,
    };
    const state = timerReducer(pausedState, resumeTimer());
    expect(state.isRunning).toBe(true);
    expect(state.startTime).not.toBeNull();
    expect(state.elapsed).toBe(10);
  });

  it("should cancel timer with reducer action", () => {
    const state = timerReducer(
      {
        activeTaskId: "task-1",
        startTime: new Date().toISOString(),
        elapsed: 20,
        isRunning: true,
        error: null,
      },
      cancelTimer(),
    );
    expect(state.activeTaskId).toBeNull();
    expect(state.isRunning).toBe(false);
    expect(state.elapsed).toBe(0);
  });

  it("should handle startTimerAsync fulfilled", () => {
    const action = startTimerAsync.fulfilled(
      {
        activeTaskId: "task-1",
        startTime: new Date().toISOString(),
        elapsed: 0,
        isRunning: true,
      },
      "",
      { taskId: "task-1" },
    );
    const state = timerReducer(initialState, action);
    expect(state.activeTaskId).toBe("task-1");
    expect(state.isRunning).toBe(true);
  });

  it("should handle pauseTimerAsync fulfilled", () => {
    const initial: TimerState = {
      activeTaskId: "task-1",
      startTime: new Date().toISOString(),
      elapsed: 5,
      isRunning: true,
      error: null,
    };
    const action = pauseTimerAsync.fulfilled(
      { startTime: null, elapsed: 10, isRunning: false },
      "",
    );
    const state = timerReducer(initial, action);
    expect(state.isRunning).toBe(false);
    expect(state.elapsed).toBe(10);
  });

  it("should handle resumeTimerAsync fulfilled", () => {
    const initial: TimerState = {
      activeTaskId: "task-1",
      startTime: null,
      elapsed: 10,
      isRunning: false,
      error: null,
    };
    const action = resumeTimerAsync.fulfilled(
      { startTime: new Date().toISOString(), isRunning: true },
      "",
    );
    const state = timerReducer(initial, action);
    expect(state.isRunning).toBe(true);
    expect(state.startTime).not.toBeNull();
  });

  it("should handle cancelTimerAsync fulfilled", () => {
    const initial: TimerState = {
      activeTaskId: "task-1",
      startTime: new Date().toISOString(),
      elapsed: 10,
      isRunning: true,
      error: null,
    };
    const action = cancelTimerAsync.fulfilled(
      { activeTaskId: null, startTime: null, elapsed: 0, isRunning: false },
      "",
    );
    const state = timerReducer(initial, action);
    expect(state.activeTaskId).toBeNull();
    expect(state.elapsed).toBe(0);
    expect(state.isRunning).toBe(false);
  });

  it("should handle stopTimerAsync fulfilled", () => {
    const initial: TimerState = {
      activeTaskId: "task-1",
      startTime: new Date().toISOString(),
      elapsed: 4,
      isRunning: true,
      error: null,
    };
    const action = stopTimerAsync.fulfilled(
      { activeTaskId: null, startTime: null, elapsed: 0, isRunning: false },
      "",
    );
    const state = timerReducer(initial, action);
    expect(state.activeTaskId).toBeNull();
    expect(state.isRunning).toBe(false);
  });
});
