import { NavLink } from "react-router-dom";
import sidebarLinks from "../utils/sidebar.config";

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-white border-r flex flex-col px-4 py-6">
      {/* Logo */}
      <div className="mb-10">
        <h1 className="text-xl font-bold text-gray-800">TeamTask</h1>
        <p className="text-sm text-gray-500">Task Management</p>
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
                        : "text-gray-600 hover:bg-gray-100"
                    }`
                  }
                >
                  <Icon className="text-lg" />
                  <span>{item.label}</span>
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
