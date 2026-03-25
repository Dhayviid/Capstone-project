export interface TimerState {
  activeTaskId: string | null;
  startTime: string | null;
  elapsed: number;
  isRunning: boolean;
  error: string | null;
}
