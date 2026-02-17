import {  MdOutlineCheckBox, MdOutlineDashboard, MdOutlinePeople, MdOutlineSettings  } from "react-icons/md";
import type { IconType } from "react-icons";

export type SidebarLink = {
  label: string;
  path: string;
  icon: IconType;
};

const sidebarLinks: SidebarLink[] = [
  {
    label: "Dashboard",
    icon: MdOutlineDashboard,
    path: "/dashboard",
  },
  {
    label: "Task",
    icon: MdOutlineCheckBox,
    path: "/task",
  },
  {
    label: "Team",
    icon: MdOutlinePeople,
    path: "/team",
  },
  {
    label: "Settings",
    icon: MdOutlineSettings,
    path: "/settings",
  },

 
];

export default sidebarLinks;
