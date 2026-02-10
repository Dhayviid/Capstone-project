import { MdDashboard, MdPerson, MdSettings, MdLogout } from "react-icons/md";
import type { IconType } from "react-icons";

export type SidebarLink = {
  label: string;
  path: string;
  icon: IconType;
};

const sidebarLinks: SidebarLink[] = [
  {
    label: "Dashboard",
    icon: MdDashboard,
    path: "/dashboard",
  },
  {
    label: "Profile",
    icon: MdPerson,
    path: "/profile",
  },
  {
    label: "Settings",
    icon: MdSettings,
    path: "/settings",
  },
  {
    label: "Logout",
    icon: MdLogout,
    path: "/logout",
  },
];

export default sidebarLinks;
