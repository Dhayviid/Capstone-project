import { useMemo, useState } from "react";
import {
  MdDarkMode,
  MdLightMode,
  MdNotificationsNone,
  MdOutlineSearch,
  MdPerson,
} from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDark, setIsDark] = useState(false);

  const getTitle = useMemo(() => {
    if (location.pathname.includes("dashboard")) return "Dashboard";
    if (location.pathname.includes("task")) return "Tasks";
    if (location.pathname.includes("files")) return "Files";
    if (location.pathname.includes("sharing")) return "Sharing";
    if (location.pathname.includes("activity")) return "Activity";
    if (location.pathname.includes("notifications")) return "Notifications";
    if (location.pathname.includes("team")) return "Team";
    if (location.pathname.includes("settings")) return "Settings";
    return "TeamTask";
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/task?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      {/* Left Section - Page Title */}
      <h2 className="text-xl font-semibold text-gray-800">{getTitle}</h2>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 rounded-lg border border-gray-200 bg-white px-10 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button
            type="submit"
            className="absolute left-3 top-2.5 text-gray-400"
            aria-label="Search tasks"
          >
            <MdOutlineSearch className="h-5 w-5" />
          </button>
        </form>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <MdLightMode className="h-5 w-5" />
          ) : (
            <MdDarkMode className="h-5 w-5" />
          )}
        </button>

        {/* Notifications */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50"
          aria-label="View notifications"
        >
          <MdNotificationsNone className="h-5 w-5" />
        </button>

        {/* Avatar */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm"
          aria-label="Open user menu"
        >
          <MdPerson className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
