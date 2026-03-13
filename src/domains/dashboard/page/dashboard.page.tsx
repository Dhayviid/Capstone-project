import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ActivityCard from "../../../components/dashboard/ActivityCard";
import AddMeetingModal from "../../../components/dashboard/AddMeetingModal";
import CircularChartCard from "../../../components/dashboard/CircularChartCard";
import FocusCard from "../../../components/dashboard/FocusCard";
import type { FocusStatus } from "../../../components/dashboard/FocusCard";
import MeetingsCard from "../../../components/dashboard/MeetingsCard";
import TasksCard from "../../../components/dashboard/TasksCard";
import ProjectBoard from "../../../components/projects/ProjectBoard";
import type { Meeting } from "../../../types/meeting.types";
import type { Task } from "../../../types/task.types";
import {
  createTask,
  fetchTasks,
  setActiveProject,
  toggleTaskAsync,
  updateTaskAsync,
} from "../../../domains/task/model/task.slice";
import { fetchTeamMembers } from "../../../domains/team/model/team.slice";
import {
  selectActiveProject,
  selectProjects,
  selectTaskStats,
  selectTasksByProject,
} from "../../../domains/task/model/task.selectors";
import type { AppDispatch, RootState } from "../../../store/store";

const WEEK_DAYS: Array<Task["day"]> = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const INITIAL_FOCUS_SECONDS = 25 * 60;

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const tasks = useSelector(selectTasksByProject);
  const projects = useSelector(selectProjects);
  const activeProject = useSelector(selectActiveProject);
  const stats = useSelector(selectTaskStats);
  const loading = useSelector((state: RootState) => state.task.loading);
  const { members } = useSelector((state: RootState) => state.team);

  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    const saved = localStorage.getItem("meetings");
    return saved ? (JSON.parse(saved) as Meeting[]) : [];
  });
  const [isAddMeetingOpen, setIsAddMeetingOpen] = useState(false);

  const [focusSeconds, setFocusSeconds] = useState(INITIAL_FOCUS_SECONDS);
  const [focusStatus, setFocusStatus] = useState<FocusStatus>("paused");
  const autoScheduled = useRef<Set<string>>(new Set());

  const getWeekdayFromDate = (dateString: string) => {
    const date = new Date(dateString);
    const weekday = date.toLocaleDateString(undefined, { weekday: "long" });
    return weekday as Task["day"];
  };

  const todayIso = useMemo(() => new Date().toISOString().split("T")[0], []);
  const todayWeekday = useMemo(
    () => getWeekdayFromDate(todayIso) as NonNullable<Task["day"]>,
    [todayIso],
  );

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchTeamMembers());
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("meetings", JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    const tasksToAutoSchedule = tasks.filter(
      (task) => task.dueDate && !autoScheduled.current.has(task.id),
    );

    tasksToAutoSchedule.forEach((task) => {
      const desiredDay = getWeekdayFromDate(task.dueDate!);
      if (desiredDay && task.day !== desiredDay) {
        autoScheduled.current.add(task.id);
        void dispatch(
          updateTaskAsync({
            ...task,
            day: desiredDay,
          }),
        );
      }
    });
  }, [dispatch, tasks, todayIso]);

  const handleStartTask = useCallback(
    (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;
      void dispatch(
        updateTaskAsync({
          ...task,
          status: "in-progress",
        }),
      );
    },
    [dispatch, tasks],
  );

  const handleToggleFavorite = useCallback(
    (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;
      void dispatch(
        updateTaskAsync({
          ...task,
          favorite: !task.favorite,
        }),
      );
    },
    [dispatch, tasks],
  );

  const handleToggleComplete = useCallback(
    (taskId: string) => {
      void dispatch(toggleTaskAsync(taskId));
    },
    [dispatch],
  );

  const handleCreateTask = useCallback(
    async (
      task: Pick<Task, "title" | "project" | "priority"> & {
        dueDate?: string;
      },
    ) => {
      const day = task.dueDate ? getWeekdayFromDate(task.dueDate) : undefined;
      await dispatch(
        createTask({
          title: task.title,
          project: task.project,
          priority: task.priority,
          favorite: false,
          status: "todo",
          dueDate: task.dueDate,
          day,
        }),
      ).unwrap();
    },
    [dispatch],
  );

  const handleCreateMeeting = useCallback(
    (meeting: Meeting) => {
      setMeetings((prev) => [meeting, ...prev]);
      setIsAddMeetingOpen(false);
    },
    [setMeetings],
  );

  const handleProjectChange = useCallback(
    (project: string | null) => {
      dispatch(setActiveProject(project));
    },
    [dispatch],
  );

  const handleMoveTask = useCallback(
    (taskId: string, toDay: Task["day"]) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;
      void dispatch(
        updateTaskAsync({
          ...task,
          day: toDay,
        }),
      );
    },
    [dispatch, tasks],
  );

  const todayTasks = useMemo(
    () =>
      tasks.filter(
        (task): task is Task & { day: NonNullable<Task["day"]> } =>
          task.dueDate === todayIso && Boolean(task.day),
      ),
    [tasks, todayIso],
  );

  const boardTasks = useMemo(
    () =>
      tasks.filter((task) => task.day && task.dueDate !== todayIso) as Array<
        Task & { day: NonNullable<Task["day"]> }
      >,
    [tasks, todayIso],
  );

  const weekData = useMemo(() => {
    const counts = WEEK_DAYS.map(
      (day) => tasks.filter((task) => task.day === day).length,
    );
    // add weekend placeholders for ActivityCard (7 values)
    return [...counts, 0, 0];
  }, [tasks]);


  useEffect(() => {
    if (focusStatus !== "running") return;

    const interval = window.setInterval(() => {
      setFocusSeconds((seconds) => {
        if (seconds <= 1) {
          setFocusStatus("paused");
          return INITIAL_FOCUS_SECONDS;
        }
        return seconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [focusStatus]);

  const toggleFocus = () => {
    setFocusStatus((prev) => {
      const next = prev === "running" ? "paused" : "running";
      if (next === "running" && focusSeconds <= 0) {
        setFocusSeconds(INITIAL_FOCUS_SECONDS);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 xl:grid-rows-2">
        <div className="xl:row-span-1">
          <FocusCard
            projectName="Product Launch"
            status={focusStatus}
            duration={formatDuration(focusSeconds)}
            onToggle={toggleFocus}
          />
        </div>

        <div className="xl:row-span-2">
          <TasksCard
            tasks={tasks}
            projects={projects}
            activeProject={activeProject}
            onProjectChange={handleProjectChange}
            onToggleFavorite={handleToggleFavorite}
            onStartTask={handleStartTask}
            onToggleComplete={handleToggleComplete}
            onCreateTask={handleCreateTask}
          />
        </div>

        <div className="xl:row-span-1">
          <MeetingsCard
            meetings={meetings}
            onAddMeeting={() => setIsAddMeetingOpen(true)}
          />
        </div>

        <div className="xl:row-span-1">
          <ActivityCard
            completion={
              stats.total
                ? Math.round((stats.completed / stats.total) * 100)
                : 0
            }
            weekData={weekData}
          />
        </div>

        <div className="xl:row-start-2 xl:col-start-4">
          <CircularChartCard
            completed={stats.completed}
            pending={stats.pending}
          />
        </div>
      </div>

      <ProjectBoard
        tasks={boardTasks}
        todayTasks={todayTasks}
        todayWeekday={todayWeekday}
        taskCount={tasks.length}
        onMoveTask={handleMoveTask}
      />

      {isAddMeetingOpen && (
        <AddMeetingModal
          members={members}
          onCreate={handleCreateMeeting}
          onClose={() => setIsAddMeetingOpen(false)}
        />
      )}

      {loading && (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white p-5 text-sm text-gray-500">
          Loading tasks…
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
