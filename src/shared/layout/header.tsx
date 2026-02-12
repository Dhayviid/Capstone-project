import { MdNotificationsNone, MdMailOutline, MdOutlineSearch } from "react-icons/md";
import { useLocation } from "react-router-dom";


const Header = () => {
  const location = useLocation();

  const getTitle = () => {
    if (location.pathname.includes("dashboard")) return "Board";
    if (location.pathname.includes("tasks")) return "Tasks";
    return "TeamTask";
  };

  return (
    <header className="h-16 bg-white border-b-2 border-b-gray-300 flex items-center justify-between px-6">
      {/* Left Section - Page Title */}
      <h2 className="text-xl font-semibold text-gray-800">{getTitle()}</h2>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="
              w-64 pl-10 pr-4 py-2
              rounded-lg border border-gray-200
              focus:outline-none focus:ring-2 focus:ring-blue-500
              text-sm
            "
          />
          <span className="absolute left-3 top-2.5 text-gray-400 text-sm items-center">
            <MdOutlineSearch className="h-5 w-5"/>
          </span>
        </div>

        {/* Notification Icons */}
        <button className="p-2 rounded-full hover:bg-gray-100 transition">
          <MdNotificationsNone className="text-xl text-gray-600" />
        </button>

        <button className="p-2 rounded-full hover:bg-gray-100 transition">
          <MdMailOutline className="text-xl text-gray-600" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
          DK
        </div>
      </div>
    </header>
  );
};

export default Header;
