import {  MdOutlineBook, MdOutlineCalendarMonth, MdOutlineCheckBox, MdOutlineDashboard, MdOutlineHeadphones, MdOutlinePeople, MdOutlinePerson, MdOutlineReport, MdOutlineSettings  } from "react-icons/md";
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
    label: "Schedule",
    icon: MdOutlineCalendarMonth,
    path: "/schedule",
  },
  {
    label: "Note",
    icon: MdOutlineBook,
    path: "/note",
  },
  {
    label: "Report",
    icon: MdOutlineReport,
    path: "/report",
  },
  {
    label: "Team",
    icon: MdOutlinePeople,
    path: "/team",
  },
  {
    label: "Client",
    icon: MdOutlinePerson,
    path: "/client",
  },
  {
    label: "Settings",
    icon: MdOutlineSettings,
    path: "/settings",
  },

  {
    label: "Support",
    icon: MdOutlineHeadphones,
    path: "/support",
  },
];

export default sidebarLinks;
