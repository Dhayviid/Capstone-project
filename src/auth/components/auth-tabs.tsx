import { NavLink } from "react-router-dom";

export default function AuthTabs() {
  return (
    <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
      <NavLink
        to="/signin"
        className={({ isActive }) =>
          `flex-1 text-center py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out
 ${
   isActive ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-black"
 }`
        }
      >
        Sign In
      </NavLink>

      <NavLink
        to="/signup"
        className={({ isActive }) =>
          `flex-1 text-center py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out
 ${
   isActive ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-black"
 }`
        }
      >
        Sign Up
      </NavLink>
    </div>
  );
}
