import { NavLink } from "react-router-dom";
import sidebarLinks from "../utils/sidebar.config";
import RocketLogo from "../ui/RocketLogo";
import { useState } from "react";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";


const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <aside
      className={`
    relative h-screen bg-white rounded-l-2xl border-r-2 border-t-2 border-r-gray-300 border-t-gray-300
    transition-all duration-300 pt-8 p-4
    ${collapsed ? "w-20" : "w-64"}
  `}
    >
      {/* Logo */}
      <div className="relative mb-10">
        {/* Logo + Name */}
        <div
          className="
      flex items-center gap-3 px-2
      cursor-pointer
      transition-transform duration-300
      hover:scale-105
    "
        >
          <RocketLogo />

          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <h1 className="text-xl font-bold text-blue-700 items-center">
                TeamTask
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Task Management App
              </p>
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="
      absolute top-2 -right-3
      w-6 h-6 rounded-full
      bg-blue-600 text-white
      flex items-center justify-center
      shadow-md
      transition hover:scale-105
    "
          aria-label="Toggle sidebar"
        >
          {collapsed ? <MdArrowRight /> : <MdArrowLeft />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {sidebarLinks.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition
                    ${
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100 transition-transform duration-300 hover:scale-105"
                    }`
                  }
                >
                  <Icon className="text-lg shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
